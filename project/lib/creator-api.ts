import { supabase } from './supabase';
import type { Post, Creator, Tier } from './creator-types';

export async function getFeed(params?: {
  tab?: 'trending' | 'following' | 'latest';
  type?: 'all' | 'video' | 'article';
  limit?: number;
}) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      creator:creators!posts_creator_id_fkey(id, handle, name, avatar, stats)
    `);

  if (params?.type === 'video') {
    query = query.eq('type', 'video');
  } else if (params?.type === 'article') {
    query = query.eq('type', 'article');
  }

  if (params?.tab === 'trending') {
    query = query.order('views', { ascending: false });
  } else if (params?.tab === 'latest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('views', { ascending: false });
  }

  const limit = params?.limit || 20;
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;

  const posts: Post[] = (data || []).map(post => ({
    id: post.id,
    creatorId: post.creator_id,
    creator: post.creator ? {
      id: post.creator.id,
      handle: post.creator.handle,
      name: post.creator.name,
      avatar: post.creator.avatar,
      stats: post.creator.stats,
      tiers: [],
    } : undefined,
    type: post.type,
    title: post.title,
    cover: post.cover,
    tags: post.tags || [],
    createdAt: post.created_at,
    access: post.access,
    media: post.media_url ? {
      url: post.media_url,
      captions: post.captions_url,
      durationSeconds: post.duration_seconds,
    } : undefined,
    article: post.article_markdown ? {
      markdown: post.article_markdown,
      readingMins: post.reading_minutes || 5,
    } : undefined,
    metrics: {
      views: post.views || 0,
      tips: post.tips_count || 0,
      tipsTotalCents: post.tips_total_cents || 0,
    },
  }));

  return { items: posts };
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      creator:creators!posts_creator_id_fkey(id, handle, name, avatar, bio, stats)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const post: Post = {
    id: data.id,
    creatorId: data.creator_id,
    creator: data.creator ? {
      id: data.creator.id,
      handle: data.creator.handle,
      name: data.creator.name,
      avatar: data.creator.avatar,
      bio: data.creator.bio,
      stats: data.creator.stats,
      tiers: [],
    } : undefined,
    type: data.type,
    title: data.title,
    cover: data.cover,
    tags: data.tags || [],
    createdAt: data.created_at,
    access: data.access,
    media: data.media_url ? {
      url: data.media_url,
      captions: data.captions_url,
      durationSeconds: data.duration_seconds,
    } : undefined,
    article: data.article_markdown ? {
      markdown: data.article_markdown,
      readingMins: data.reading_minutes || 5,
    } : undefined,
    metrics: {
      views: data.views || 0,
      tips: data.tips_count || 0,
      tipsTotalCents: data.tips_total_cents || 0,
    },
  };

  return post;
}

export async function tipPost(postId: string, amountCents: number) {
  const { data: post } = await supabase
    .from('posts')
    .select('creator_id, tips_count, tips_total_cents')
    .eq('id', postId)
    .maybeSingle();

  if (!post) throw new Error('Post not found');

  const { error: tipError } = await supabase
    .from('post_tips')
    .insert({
      post_id: postId,
      creator_id: post.creator_id,
      amount_cents: amountCents,
      currency: 'USD',
    });

  if (tipError) throw tipError;

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      tips_count: post.tips_count + 1,
      tips_total_cents: post.tips_total_cents + amountCents,
    })
    .eq('id', postId);

  if (updateError) throw updateError;

  return { success: true };
}

export async function getCreator(handle: string) {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      tiers:subscription_tiers(*)
    `)
    .eq('handle', handle)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const creator: Creator = {
    id: data.id,
    handle: data.handle,
    name: data.name,
    avatar: data.avatar,
    banner: data.banner,
    bio: data.bio,
    links: data.links || [],
    stats: data.stats,
    tiers: (data.tiers || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      price: t.price_cents / 100,
      perks: t.perks || [],
      position: t.position,
      active: t.active,
    })),
  };

  return creator;
}

export async function subscribeToCreator(creatorId: string, tierId: string) {
  const { data: tier } = await supabase
    .from('subscription_tiers')
    .select('price_cents')
    .eq('id', tierId)
    .maybeSingle();

  if (!tier) throw new Error('Tier not found');

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

  const { error } = await supabase
    .from('creator_subscriptions')
    .insert({
      creator_id: creatorId,
      tier_id: tierId,
      status: 'active',
      current_period_end: currentPeriodEnd.toISOString(),
    });

  if (error) throw error;

  return { success: true };
}
