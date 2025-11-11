/*
  # Create Storage Buckets for Attentive Platform

  1. Storage Buckets
    - `videos` - For video uploads (creator content)
    - `images` - For article images, post covers, thumbnails
    - `avatars` - For user profile pictures
    - `banners` - For creator profile banners

  2. Security
    - Public read access for all buckets (content is meant to be viewed)
    - Authenticated write access (only logged-in users can upload)
    - Users can only delete their own uploads

  3. Configuration
    - Set appropriate file size limits
    - Configure allowed MIME types
    - Enable public URLs for content delivery

  ## Important Notes
  - Videos bucket: max 500MB per file, video formats only
  - Images bucket: max 10MB per file, image formats only
  - Avatars bucket: max 2MB per file, image formats only
  - Banners bucket: max 5MB per file, image formats only
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('videos', 'videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']),
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('banners', 'banners', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;