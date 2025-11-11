export type Article = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  excerpt: string;
  content_html?: string;
  read_minutes: number;
  price_cents: number;
  is_owned: boolean;
  tips_count: number;
  author: {
    id: string;
    name: string;
    avatar_url: string;
    community_id?: string;
  };
  category: string;
  created_at: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  cover_url: string;
  description: string;
  members_count: number;
  monthly_price_cents: number;
  joined: boolean;
  owner: {
    id: string;
    name: string;
    avatar_url: string;
  };
};

export type PaymentMethod = {
  id: string;
  brand: 'visa' | 'mc' | 'amex' | 'apple_pay' | 'google_pay';
  last4?: string;
  is_default: boolean;
};

export type Transaction = {
  id: string;
  type: 'purchase' | 'tip' | 'subscription';
  amount_cents: number;
  description: string;
  article_id?: string;
  community_id?: string;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
};

export type ArticlePurchase = {
  id: string;
  user_id: string;
  article_id: string;
  amount_cents: number;
  purchased_at: string;
};

export type ArticleTip = {
  id: string;
  user_id: string;
  article_id: string;
  amount_cents: number;
  tipped_at: string;
};

export type CommunitySubscription = {
  id: string;
  user_id: string;
  community_id: string;
  status: 'active' | 'cancelled' | 'trial';
  trial_ends_at?: string;
  current_period_end: string;
  subscribed_at: string;
};
