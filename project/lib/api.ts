import { supabase } from './supabase';
import type { Article, Community, PaymentMethod, Transaction } from './types';

export async function getArticles(params?: {
  search?: string;
  category?: string;
  price?: 'free' | 'paid';
  sort?: 'most_tipped' | 'recent';
  cursor?: string;
  limit?: number;
}) {
  let query = supabase
    .from('articles')
    .select(`
      *,
      author:profiles!articles_author_id_fkey(id, name, avatar_url)
    `);

  if (params?.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  if (params?.category && params.category !== 'All') {
    query = query.eq('category', params.category);
  }

  if (params?.price === 'free') {
    query = query.eq('price_cents', 0);
  } else if (params?.price === 'paid') {
    query = query.gt('price_cents', 0);
  }

  if (params?.sort === 'most_tipped') {
    query = query.order('tips_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const limit = params?.limit || 12;
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;

  const user = (await supabase.auth.getUser()).data.user;
  let purchases: string[] = [];

  if (user) {
    const { data: purchaseData } = await supabase
      .from('article_purchases')
      .select('article_id')
      .eq('user_id', user.id);
    purchases = purchaseData?.map(p => p.article_id) || [];
  }

  const articles: Article[] = (data || []).map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    thumbnail_url: article.thumbnail_url,
    excerpt: article.excerpt,
    content_html: article.content_html,
    read_minutes: article.read_minutes,
    price_cents: article.price_cents,
    is_owned: purchases.includes(article.id) || article.price_cents === 0,
    tips_count: article.tips_count,
    author: {
      id: article.author.id,
      name: article.author.name,
      avatar_url: article.author.avatar_url,
    },
    category: article.category,
    created_at: article.created_at,
  }));

  return { items: articles, nextCursor: null };
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!articles_author_id_fkey(id, name, avatar_url, bio)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const user = (await supabase.auth.getUser()).data.user;
  let isOwned = data.price_cents === 0;

  if (user && !isOwned) {
    const { data: purchase } = await supabase
      .from('article_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('article_id', id)
      .maybeSingle();
    isOwned = !!purchase;
  }

  const article: Article = {
    id: data.id,
    title: data.title,
    slug: data.slug,
    thumbnail_url: data.thumbnail_url,
    excerpt: data.excerpt,
    content_html: data.content_html,
    read_minutes: data.read_minutes,
    price_cents: data.price_cents,
    is_owned: isOwned,
    tips_count: data.tips_count,
    author: {
      id: data.author.id,
      name: data.author.name,
      avatar_url: data.author.avatar_url,
    },
    category: data.category,
    created_at: data.created_at,
  };

  return article;
}

export async function purchaseArticle(articleId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const article = await getArticleById(articleId);
  if (!article) throw new Error('Article not found');

  const { error: purchaseError } = await supabase
    .from('article_purchases')
    .insert({
      user_id: user.id,
      article_id: articleId,
      amount_cents: article.price_cents,
    });

  if (purchaseError) throw purchaseError;

  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'purchase',
      amount_cents: article.price_cents,
      description: `Purchased: ${article.title}`,
      article_id: articleId,
    });

  if (txError) throw txError;

  return { success: true, owned: true };
}

export async function tipArticle(articleId: string, amountCents: number) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const article = await getArticleById(articleId);
  if (!article) throw new Error('Article not found');

  const { error: tipError } = await supabase
    .from('article_tips')
    .insert({
      user_id: user.id,
      article_id: articleId,
      amount_cents: amountCents,
    });

  if (tipError) throw tipError;

  const { error: updateError } = await supabase
    .from('articles')
    .update({ tips_count: article.tips_count + 1 })
    .eq('id', articleId);

  if (updateError) throw updateError;

  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'tip',
      amount_cents: amountCents,
      description: `Tipped: ${article.title}`,
      article_id: articleId,
    });

  if (txError) throw txError;

  return { success: true, newTipsCount: article.tips_count + 1 };
}

export async function getCommunities(joined?: boolean) {
  const query = supabase
    .from('communities')
    .select(`
      *,
      owner:profiles!communities_owner_id_fkey(id, name, avatar_url)
    `)
    .order('members_count', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  const user = (await supabase.auth.getUser()).data.user;
  let subscriptions: string[] = [];

  if (user) {
    const { data: subData } = await supabase
      .from('community_subscriptions')
      .select('community_id')
      .eq('user_id', user.id)
      .eq('status', 'active');
    subscriptions = subData?.map(s => s.community_id) || [];
  }

  let communities: Community[] = (data || []).map(community => ({
    id: community.id,
    name: community.name,
    slug: community.slug,
    cover_url: community.cover_url,
    description: community.description,
    members_count: community.members_count,
    monthly_price_cents: community.monthly_price_cents,
    joined: subscriptions.includes(community.id),
    owner: {
      id: community.owner.id,
      name: community.owner.name,
      avatar_url: community.owner.avatar_url,
    },
  }));

  if (joined !== undefined) {
    communities = communities.filter(c => c.joined === joined);
  }

  return { items: communities };
}

export async function subscribeToCommunity(communityId: string, trial: boolean) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const community = (await getCommunities()).items.find(c => c.id === communityId);
  if (!community) throw new Error('Community not found');

  const trialEndsAt = trial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;
  const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const { error: subError } = await supabase
    .from('community_subscriptions')
    .insert({
      user_id: user.id,
      community_id: communityId,
      status: trial ? 'trial' : 'active',
      trial_ends_at: trialEndsAt?.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
    });

  if (subError) throw subError;

  const { error: updateError } = await supabase
    .from('communities')
    .update({ members_count: community.members_count + 1 })
    .eq('id', communityId);

  if (updateError) throw updateError;

  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'subscription',
      amount_cents: trial ? 0 : community.monthly_price_cents,
      description: `Subscribed to: ${community.name}${trial ? ' (Free Trial)' : ''}`,
      community_id: communityId,
    });

  if (txError) throw txError;

  return { success: true, joined: true };
}

export async function getPaymentMethods() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []) as PaymentMethod[];
}

export async function addPaymentMethod(brand: string, last4?: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const existingMethods = await getPaymentMethods();
  const isDefault = existingMethods.length === 0;

  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: user.id,
      brand,
      last4,
      is_default: isDefault,
    })
    .select()
    .single();

  if (error) throw error;

  return data as PaymentMethod;
}

export async function getTransactions() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []) as Transaction[];
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
