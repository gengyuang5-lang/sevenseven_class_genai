/*
  # Seed Demo Data

  ## Overview
  Insert sample articles, communities, and author profiles for demonstration.

  ## Data Inserted
  - 6 author profiles
  - 6 articles across different categories
  - 4 communities
*/

DO $$
DECLARE
  author1_id uuid := '00000000-0000-0000-0000-000000000001';
  author2_id uuid := '00000000-0000-0000-0000-000000000002';
  author3_id uuid := '00000000-0000-0000-0000-000000000003';
  author4_id uuid := '00000000-0000-0000-0000-000000000004';
  author5_id uuid := '00000000-0000-0000-0000-000000000005';
  author6_id uuid := '00000000-0000-0000-0000-000000000006';
BEGIN
  INSERT INTO profiles (id, name, avatar_url, bio) VALUES
    (author1_id, 'Alex Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Productivity expert and author focused on deep work strategies.'),
    (author2_id, 'Sara Li', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', 'UX designer specializing in payment flows and micro-interactions.'),
    (author3_id, 'Jordan Blake', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', 'Creator economy analyst and business strategist.'),
    (author4_id, 'Taylor Kim', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor', 'Habit formation coach and behavioral psychology enthusiast.'),
    (author5_id, 'Casey Morgan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey', 'Remote work consultant and digital nomad since 2018.'),
    (author6_id, 'Riley Park', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley', 'Minimalist living advocate and sustainability writer.')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO articles (author_id, title, slug, thumbnail_url, excerpt, content_html, read_minutes, price_cents, tips_count, category) VALUES
    (author1_id, 'Mastering Focus in a Noisy World', 'mastering-focus-noisy-world', 'https://images.pexels.com/photos/7976204/pexels-photo-7976204.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Practical, evidence-based tactics to protect your attention and reclaim deep work in an age of constant distraction.', 
     '<h2>The Crisis of Attention</h2><p>In today''s hyper-connected world, our attention is under constant siege. Every notification, email, and ping competes for a slice of our cognitive bandwidth.</p><h2>Building Focus Muscles</h2><p>Like physical fitness, mental focus requires consistent practice and the right techniques. Here are proven strategies to strengthen your concentration.</p><h3>1. Time Blocking</h3><p>Dedicate specific time blocks to deep work. During these periods, eliminate all distractions and focus on a single task.</p><h3>2. Digital Minimalism</h3><p>Audit your digital life. Remove apps and services that don''t provide significant value to your life or work.</p><blockquote>The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.</blockquote><h3>3. Environmental Design</h3><p>Create a workspace that promotes focus. This might mean noise-cancelling headphones, a clean desk, or a dedicated office space.</p>', 
     7, 299, 124, 'Productivity'),
    
    (author2_id, 'Designing for Micro-Transactions', 'designing-micro-transactions', 'https://images.pexels.com/photos/7947662/pexels-photo-7947662.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Friction kills conversion—here''s how to reduce it with intent-first UI patterns and psychology-driven design.', 
     '<h2>The Friction Problem</h2><p>Every extra click, form field, or moment of confusion in a payment flow dramatically reduces conversion rates.</p><h2>Intent-First Design</h2><p>The key to successful micro-transaction design is understanding and respecting user intent. When someone decides to pay, make it effortless.</p><h3>One-Click Purchases</h3><p>Amazon popularized this pattern for a reason—it works. Store payment methods securely and allow instant purchases with a single confirmation.</p><h3>Clear Value Communication</h3><p>Users need to understand exactly what they''re getting before they pay. Show value props clearly and concisely.</p><h3>Trust Signals</h3><p>Security badges, clear refund policies, and transparent pricing build the trust needed for quick purchase decisions.</p>', 
     5, 0, 89, 'Design'),
    
    (author3_id, 'The Creator Economy in 2025', 'creator-economy-2025', 'https://images.pexels.com/photos/5561923/pexels-photo-5561923.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'How independent creators are building sustainable businesses through direct monetization and community-first strategies.', 
     '<h2>The Shift to Direct Monetization</h2><p>Creators are moving away from ad-based revenue models toward direct relationships with their audiences.</p><h2>Multiple Revenue Streams</h2><p>Successful creators don''t rely on a single income source. They diversify across tips, premium content, and community subscriptions.</p><h3>Tips as Social Currency</h3><p>Micro-tips have emerged as a powerful way for audiences to show appreciation without major financial commitment.</p><h3>Premium Content</h3><p>High-quality, in-depth content commands premium prices when it provides genuine value.</p><h3>Community Access</h3><p>Exclusive communities create ongoing relationships and recurring revenue.</p>', 
     8, 499, 203, 'Business'),
    
    (author4_id, 'Building Habits That Last', 'building-habits-that-last', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Science-backed strategies for creating lasting behavioral change without relying on willpower alone.', 
     '<h2>The Habit Loop</h2><p>Every habit follows a simple loop: cue, routine, reward. Understanding this loop is key to building better habits.</p><h2>Start Small</h2><p>The biggest mistake people make is trying to change too much at once. Start with tiny, almost laughably small habits.</p><h3>Stack Your Habits</h3><p>Link new habits to existing ones. After I pour my coffee, I will meditate for 2 minutes.</p><h3>Make It Obvious</h3><p>Design your environment to make good habits the path of least resistance.</p><blockquote>You do not rise to the level of your goals. You fall to the level of your systems.</blockquote>', 
     6, 0, 156, 'Personal Growth'),
    
    (author5_id, 'The Future of Remote Work', 'future-remote-work', 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Remote work is here to stay. Explore emerging trends and tools shaping the distributed workplace.', 
     '<h2>The Remote Revolution</h2><p>COVID-19 accelerated a trend that was already in motion. Remote work has proven to be not just viable but preferable for many knowledge workers.</p><h2>Async-First Communication</h2><p>The most successful remote teams prioritize asynchronous communication, respecting deep work time.</p><h3>Tools That Matter</h3><p>The right tools can make or break a remote team. Focus on tools that reduce friction rather than add complexity.</p><h3>Building Culture Remotely</h3><p>Culture doesn''t require physical proximity, but it does require intentional effort.</p>', 
     9, 399, 178, 'Technology'),
    
    (author6_id, 'Minimalist Living: A Practical Guide', 'minimalist-living-guide', 'https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Declutter your space and mind with practical minimalism strategies that actually work in real life.', 
     '<h2>What Minimalism Really Means</h2><p>Minimalism isn''t about owning as little as possible. It''s about making room for what matters by removing what doesn''t.</p><h2>The KonMari Method</h2><p>Marie Kondo''s approach asks one simple question: Does this spark joy? If not, thank it for its service and let it go.</p><h3>Digital Minimalism</h3><p>Our digital lives need decluttering too. Unsubscribe, unfollow, and delete ruthlessly.</p><h3>Mindful Consumption</h3><p>Before acquiring anything new, ask: Do I need this? Will it add value to my life?</p>', 
     7, 0, 92, 'Lifestyle')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO communities (owner_id, name, slug, cover_url, description, members_count, monthly_price_cents) VALUES
    (author1_id, 'Deep Focus Lab', 'deep-focus-lab', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Evidence-based productivity strategies with weekly AMAs, accountability partners, and exclusive research deep-dives.', 
     1542, 799),
    
    (author3_id, 'Creator Growth Guild', 'creator-growth-guild', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Monetization playbooks, portfolio reviews, and direct feedback from creators earning 6-7 figures.', 
     832, 999),
    
    (author2_id, 'Design Systems Collective', 'design-systems-collective', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'For designers building and scaling design systems. Share components, patterns, and lessons learned.', 
     645, 1299),
    
    (author5_id, 'Remote Work Pioneers', 'remote-work-pioneers', 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800', 
     'Community for remote workers and digital nomads. Tips, tools, and travel recommendations from around the world.', 
     2134, 599)
  ON CONFLICT (slug) DO NOTHING;

END $$;
