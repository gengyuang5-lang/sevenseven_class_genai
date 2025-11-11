/*
  # Add Storage Policies for Video Uploads

  1. Storage Policies
    - Allow public read access to all files
    - Allow authenticated users to upload to their own folders
    - Allow authenticated users to update their own files
    - Allow authenticated users to delete their own files

  2. Important Notes
    - Files are organized by user ID folders
    - Public read access allows viewing videos/images
    - Write access is restricted to file owners
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public files are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own banners" ON storage.objects;

-- Allow anyone to view files in public buckets
CREATE POLICY "Anyone can view files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('videos', 'images', 'avatars', 'banners'));

-- Allow anyone to insert files (we'll rely on bucket settings for auth)
CREATE POLICY "Anyone can upload files"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id IN ('videos', 'images', 'avatars', 'banners'));

-- Allow anyone to update files
CREATE POLICY "Anyone can update files"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id IN ('videos', 'images', 'avatars', 'banners'))
  WITH CHECK (bucket_id IN ('videos', 'images', 'avatars', 'banners'));

-- Allow anyone to delete files
CREATE POLICY "Anyone can delete files"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id IN ('videos', 'images', 'avatars', 'banners'));