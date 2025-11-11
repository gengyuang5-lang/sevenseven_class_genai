export type Creator = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  banner?: string;
  bio?: string;
  links?: { label: string; url: string }[];
  stats: {
    followers: number;
    tipsTotal: number;
    monthlySupporters: number;
  };
  tiers: Tier[];
};

export type Tier = {
  id: string;
  name: string;
  price: number;
  perks: string[];
  position: number;
  active: boolean;
};

export type Post = {
  id: string;
  creatorId: string;
  creator?: Creator;
  type: 'video' | 'article';
  title: string;
  cover: string;
  tags: string[];
  createdAt: string;
  access: 'public' | 'supporters';
  media?: {
    url: string;
    captions?: string;
    durationSeconds?: number;
  };
  article?: {
    markdown: string;
    readingMins: number;
  };
  metrics: {
    views: number;
    tips: number;
    tipsTotalCents: number;
  };
};

export type Comment = {
  id: string;
  postId: string;
  userId?: string;
  creatorId?: string;
  creator?: Creator;
  text: string;
  createdAt: string;
  isSupporter?: boolean;
};

export type TipIntent = {
  postId: string;
  amount: number;
  currency: 'USD';
};

export type SubscriptionIntent = {
  creatorId: string;
  tierId: string;
  currency: 'USD';
};

export type Follow = {
  id: string;
  followerId: string;
  creatorId: string;
  followedAt: string;
};

export type SavedPost = {
  id: string;
  userId: string;
  postId: string;
  savedAt: string;
};
