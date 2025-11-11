/*
  # Seed Creator Platform Data

  ## Overview
  Insert sample creators, posts, and subscription tiers for demonstration.

  ## Data Inserted
  - 3 creators with different profiles
  - 5 posts (3 videos, 2 articles)
  - Multiple subscription tiers
*/

DO $$
DECLARE
  creator1_id uuid := '10000000-0000-0000-0000-000000000001';
  creator2_id uuid := '10000000-0000-0000-0000-000000000002';
  creator3_id uuid := '10000000-0000-0000-0000-000000000003';
BEGIN
  -- Insert creators
  INSERT INTO creators (id, handle, name, avatar, banner, bio, stats) VALUES
    (creator1_id, 'focusmaster', 'Alex Rivera', 
     'https://api.dicebear.com/7.x/avataaars/svg?seed=FocusMaster', 
     'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=400&fit=crop',
     'Productivity coach helping creators reclaim their attention. 10+ years teaching deep work strategies.',
     '{"followers": 12500, "tipsTotal": 48500, "monthlySupporters": 342}'::jsonb),
    
    (creator2_id, 'creatortech', 'Sam Chen', 
     'https://api.dicebear.com/7.x/avataaars/svg?seed=CreatorTech', 
     'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
     'Writing about the creator economy, Web3, and sustainable monetization. Former product lead at a major platform.',
     '{"followers": 8900, "tipsTotal": 32100, "monthlySupporters": 215}'::jsonb),
    
    (creator3_id, 'mindfulmaker', 'Jordan Lee', 
     'https://api.dicebear.com/7.x/avataaars/svg?seed=MindfulMaker', 
     'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=400&fit=crop',
     'Meditation teacher & content creator. Helping you build mindful habits in a noisy world.',
     '{"followers": 15200, "tipsTotal": 67800, "monthlySupporters": 428}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- Insert subscription tiers
  INSERT INTO subscription_tiers (creator_id, name, price_cents, perks, position) VALUES
    (creator1_id, 'Supporter', 300, '["Early access to videos", "Supporter badge", "Monthly Q&A access"]'::jsonb, 1),
    (creator1_id, 'Pro', 800, '["All Supporter perks", "Exclusive productivity templates", "1-on-1 coaching session (quarterly)", "Private community access"]'::jsonb, 2),
    
    (creator2_id, 'Reader', 300, '["Access to all premium articles", "Weekly newsletter", "Supporter badge"]'::jsonb, 1),
    (creator2_id, 'Insider', 500, '["All Reader perks", "Monthly creator economy reports", "Early access to new content"]'::jsonb, 2),
    
    (creator3_id, 'Mindful', 500, '["Guided meditation library", "Supporter badge", "Weekly mindfulness challenges"]'::jsonb, 1)
  ON CONFLICT DO NOTHING;

  -- Insert video post 1
  INSERT INTO posts (creator_id, type, title, cover, tags, access, media_url, duration_seconds, views, tips_count, tips_total_cents)
  VALUES (
    creator1_id,
    'video',
    'The 3-Minute Focus Reset',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop',
    ARRAY['productivity', 'focus', 'tips'],
    'public',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    180,
    8234,
    156,
    15600
  ) ON CONFLICT DO NOTHING;

  -- Insert article post 1
  INSERT INTO posts (creator_id, type, title, cover, tags, access, article_markdown, reading_minutes, views, tips_count, tips_total_cents)
  VALUES (
    creator2_id,
    'article',
    'How Micro-Tips Empower Independent Creators',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop',
    ARRAY['creator-economy', 'monetization', 'web3'],
    'public',
    E'# How Micro-Tips Empower Independent Creators\n\n## The Problem with Ad-Based Models\n\nFor years, creators have been forced to choose between two bad options: give away content for free and hope for ad revenue, or put everything behind a hard paywall that limits reach.\n\n**Ad-based models have serious drawbacks:**\n- Creators optimize for clicks, not quality\n- Privacy concerns for audiences\n- Unpredictable revenue\n- Platform dependency\n\n## Enter Micro-Tips\n\nMicro-tips solve this by allowing audiences to directly support creators with small amounts ($0.50 to $5) on individual pieces of content they value.\n\n### Why It Works\n\n1. **Low friction**: One-click payments mean fans can tip impulsively\n2. **Fair exchange**: Pay what you think it''s worth\n3. **Direct relationship**: Money goes straight to creators (minus minimal platform fees)\n4. **Sustainable**: Creators can earn from passion projects without chasing algorithms\n\n## The Future\n\nAs payment infrastructure improves and crypto enables micropayments at scale, we''ll see more platforms adopt this model. The future of content isn''t ads or hard paywalls—it''s voluntary, direct support from engaged audiences.\n\n> "When 1,000 true fans each contribute a few dollars, creators can make a living doing what they love."\n\n## Get Started\n\nWhether you''re a video creator, writer, or podcaster, consider enabling micro-tips. Your audience wants to support you—make it easy for them.',
    7,
    5432,
    89,
    8900
  ) ON CONFLICT DO NOTHING;

  -- Insert video post 2
  INSERT INTO posts (creator_id, type, title, cover, tags, access, media_url, duration_seconds, views, tips_count, tips_total_cents)
  VALUES (
    creator3_id,
    'video',
    '5-Minute Morning Meditation',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop',
    ARRAY['meditation', 'mindfulness', 'morning-routine'],
    'public',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    300,
    12450,
    234,
    23400
  ) ON CONFLICT DO NOTHING;

  -- Insert article post 2 (supporters only)
  INSERT INTO posts (creator_id, type, title, cover, tags, access, article_markdown, reading_minutes, views, tips_count, tips_total_cents)
  VALUES (
    creator1_id,
    'article',
    'Deep Work in the Age of Distraction',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop',
    ARRAY['productivity', 'deep-work', 'focus'],
    'supporters',
    E'# Deep Work in the Age of Distraction\n\nIn a world of constant notifications and infinite scrolling, the ability to focus deeply has become a superpower.\n\n## What is Deep Work?\n\nDeep work is the ability to focus without distraction on a cognitively demanding task. It''s becoming increasingly rare and valuable.\n\n## How to Cultivate Deep Work\n\n1. **Time blocking**: Schedule specific hours for deep work\n2. **Remove distractions**: Turn off notifications, close unnecessary tabs\n3. **Build rituals**: Create consistent cues that signal deep work time\n4. **Embrace boredom**: Train your mind to resist constant stimulation\n\nThis full article is available to supporters only.',
    10,
    3210,
    67,
    6700
  ) ON CONFLICT DO NOTHING;

  -- Insert video post 3
  INSERT INTO posts (creator_id, type, title, cover, tags, access, media_url, duration_seconds, views, tips_count, tips_total_cents)
  VALUES (
    creator2_id,
    'video',
    'Building Your Creator Tech Stack',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop',
    ARRAY['creator-tools', 'productivity', 'tech'],
    'public',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    420,
    6789,
    123,
    12300
  ) ON CONFLICT DO NOTHING;

END $$;
