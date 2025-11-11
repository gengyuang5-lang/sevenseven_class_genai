/*
  # Attentive App Database Schema

  ## Overview
  Complete schema for one-click monetization platform with articles, communities, payments, and transactions.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `name` (text) - User display name
  - `avatar_url` (text) - Profile picture URL
  - `bio` (text) - User biography
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `articles`
  - `id` (uuid, primary key)
  - `author_id` (uuid, foreign key to profiles)
  - `title` (text) - Article title
  - `slug` (text, unique) - URL-friendly identifier
  - `thumbnail_url` (text) - Cover image
  - `excerpt` (text) - Short description
  - `content_html` (text) - Full article content
  - `read_minutes` (integer) - Estimated reading time
  - `price_cents` (integer) - Price in cents (0 = free)
  - `tips_count` (integer, default 0) - Number of tips received
  - `category` (text) - Article category
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `communities`
  - `id` (uuid, primary key)
  - `owner_id` (uuid, foreign key to profiles)
  - `name` (text) - Community name
  - `slug` (text, unique) - URL-friendly identifier
  - `cover_url` (text) - Cover image
  - `description` (text) - Community description
  - `members_count` (integer, default 0) - Number of members
  - `monthly_price_cents` (integer) - Monthly subscription price
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `article_purchases`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `article_id` (uuid, foreign key to articles)
  - `amount_cents` (integer) - Purchase amount
  - `purchased_at` (timestamptz)
  - Unique constraint on (user_id, article_id)
  
  ### `article_tips`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `article_id` (uuid, foreign key to articles)
  - `amount_cents` (integer) - Tip amount
  - `tipped_at` (timestamptz)
  
  ### `community_subscriptions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `community_id` (uuid, foreign key to communities)
  - `status` (text) - active, cancelled, trial
  - `trial_ends_at` (timestamptz, nullable)
  - `current_period_end` (timestamptz)
  - `subscribed_at` (timestamptz)
  - Unique constraint on (user_id, community_id)
  
  ### `payment_methods`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `brand` (text) - visa, mc, amex, apple_pay, google_pay
  - `last4` (text, nullable) - Last 4 digits
  - `is_default` (boolean, default false)
  - `created_at` (timestamptz)
  
  ### `transactions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `type` (text) - purchase, tip, subscription
  - `amount_cents` (integer)
  - `description` (text)
  - `article_id` (uuid, nullable)
  - `community_id` (uuid, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read their own data
  - Users can read public articles and communities
  - Users can create tips, purchases, and subscriptions
  - Profiles are publicly readable
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  thumbnail_url text DEFAULT '',
  excerpt text DEFAULT '',
  content_html text DEFAULT '',
  read_minutes integer DEFAULT 5,
  price_cents integer DEFAULT 0,
  tips_count integer DEFAULT 0,
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  cover_url text DEFAULT '',
  description text DEFAULT '',
  members_count integer DEFAULT 0,
  monthly_price_cents integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are publicly readable"
  ON communities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can create communities"
  ON communities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own communities"
  ON communities FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Article purchases table
CREATE TABLE IF NOT EXISTS article_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  amount_cents integer NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE article_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON article_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON article_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Article tips table
CREATE TABLE IF NOT EXISTS article_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  amount_cents integer NOT NULL,
  tipped_at timestamptz DEFAULT now()
);

ALTER TABLE article_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tips"
  ON article_tips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tips"
  ON article_tips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Community subscriptions table
CREATE TABLE IF NOT EXISTS community_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active',
  trial_ends_at timestamptz,
  current_period_end timestamptz NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, community_id)
);

ALTER TABLE community_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON community_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions"
  ON community_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON community_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL,
  last4 text DEFAULT '',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  amount_cents integer NOT NULL,
  description text DEFAULT '',
  article_id uuid REFERENCES articles(id) ON DELETE SET NULL,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communities_owner ON communities(owner_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON article_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_tips_article ON article_tips(article_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON community_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, created_at DESC);