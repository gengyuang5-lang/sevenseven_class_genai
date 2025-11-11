/*
  # Creator Platform Database Schema

  ## Overview
  Complete schema for short-video and article creator platform with micro-tips and subscriptions.

  ## New Tables
  
  ### `creators`
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - Link to auth.users for authenticated creators
  - `handle` (text, unique) - @username
  - `name` (text) - Display name
  - `avatar` (text) - Avatar URL
  - `banner` (text) - Banner image URL
  - `bio` (text) - Creator bio
  - `links` (jsonb) - Social links array
  - `stats` (jsonb) - Followers, tips total, monthly supporters
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `subscription_tiers`
  - `id` (uuid, primary key)
  - `creator_id` (uuid, foreign key to creators)
  - `name` (text) - Tier name (e.g., "Basic", "Pro")
  - `price_cents` (integer) - Monthly price in cents
  - `perks` (jsonb) - Array of perk strings
  - `position` (integer) - Display order
  - `active` (boolean, default true)
  - `created_at` (timestamptz)
  
  ### `posts`
  - `id` (uuid, primary key)
  - `creator_id` (uuid, foreign key to creators)
  - `type` (text) - 'video' or 'article'
  - `title` (text)
  - `cover` (text) - Cover image URL
  - `tags` (text[]) - Array of tags
  - `access` (text) - 'public' or 'supporters'
  - `media_url` (text, nullable) - Video URL
  - `captions_url` (text, nullable) - VTT captions URL
  - `duration_seconds` (integer, nullable) - Video duration
  - `article_markdown` (text, nullable) - Article content
  - `reading_minutes` (integer, nullable) - Estimated reading time
  - `views` (integer, default 0)
  - `tips_count` (integer, default 0)
  - `tips_total_cents` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `post_tips`
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key to posts)
  - `creator_id` (uuid, foreign key to creators)
  - `user_id` (uuid, nullable)
  - `amount_cents` (integer)
  - `currency` (text, default 'USD')
  - `tipped_at` (timestamptz)
  
  ### `creator_subscriptions`
  - `id` (uuid, primary key)
  - `creator_id` (uuid, foreign key to creators)
  - `tier_id` (uuid, foreign key to subscription_tiers)
  - `user_id` (uuid, nullable)
  - `status` (text) - 'active', 'cancelled', 'expired'
  - `current_period_end` (timestamptz)
  - `subscribed_at` (timestamptz)
  - `cancelled_at` (timestamptz, nullable)
  
  ### `post_comments`
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key to posts)
  - `user_id` (uuid, nullable)
  - `creator_id` (uuid, foreign key to creators, nullable) - If commenter is a creator
  - `text` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `follows`
  - `id` (uuid, primary key)
  - `follower_id` (uuid) - User following
  - `creator_id` (uuid, foreign key to creators) - Creator being followed
  - `followed_at` (timestamptz)
  - Unique constraint on (follower_id, creator_id)
  
  ### `saved_posts`
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `post_id` (uuid, foreign key to posts)
  - `saved_at` (timestamptz)
  - Unique constraint on (user_id, post_id)

  ## Security
  - Enable RLS on all tables
  - Public read access for posts, creators, comments
  - Authenticated users can create tips, subscriptions, comments
  - Creators can manage their own content
*/

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  handle text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text DEFAULT '',
  banner text DEFAULT '',
  bio text DEFAULT '',
  links jsonb DEFAULT '[]'::jsonb,
  stats jsonb DEFAULT '{"followers": 0, "tipsTotal": 0, "monthlySupporters": 0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators are publicly readable"
  ON creators FOR SELECT
  USING (true);

CREATE POLICY "Users can create creator profiles"
  ON creators FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update own profile"
  ON creators FOR UPDATE
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Subscription tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price_cents integer NOT NULL,
  perks jsonb DEFAULT '[]'::jsonb,
  position integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tiers are publicly readable"
  ON subscription_tiers FOR SELECT
  USING (true);

CREATE POLICY "Creators can manage own tiers"
  ON subscription_tiers FOR ALL
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'article')),
  title text NOT NULL,
  cover text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  access text DEFAULT 'public' CHECK (access IN ('public', 'supporters')),
  media_url text,
  captions_url text,
  duration_seconds integer,
  article_markdown text,
  reading_minutes integer,
  views integer DEFAULT 0,
  tips_count integer DEFAULT 0,
  tips_total_cents integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Creators can create posts"
  ON posts FOR INSERT
  WITH CHECK (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

CREATE POLICY "Creators can update own posts"
  ON posts FOR UPDATE
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()))
  WITH CHECK (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

CREATE POLICY "Creators can delete own posts"
  ON posts FOR DELETE
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Post tips table
CREATE TABLE IF NOT EXISTS post_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  tipped_at timestamptz DEFAULT now()
);

ALTER TABLE post_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tips"
  ON post_tips FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create tips"
  ON post_tips FOR INSERT
  WITH CHECK (true);

-- Creator subscriptions table
CREATE TABLE IF NOT EXISTS creator_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_end timestamptz NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  cancelled_at timestamptz
);

ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON creator_subscriptions FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create subscriptions"
  ON creator_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own subscriptions"
  ON creator_subscriptions FOR UPDATE
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  creator_id uuid REFERENCES creators(id) ON DELETE SET NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  followed_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, creator_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are publicly readable"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow creators"
  ON follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow creators"
  ON follows FOR DELETE
  USING (follower_id = auth.uid());

-- Saved posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved posts"
  ON saved_posts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can save posts"
  ON saved_posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave posts"
  ON saved_posts FOR DELETE
  USING (user_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_access ON posts(access);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_tips_post ON post_tips(post_id);
CREATE INDEX IF NOT EXISTS idx_tips_creator ON post_tips(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON creator_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON creator_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_creator ON follows(creator_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_posts(user_id);