/*
  # Update Video Bucket Size Limit

  1. Changes
    - Increase videos bucket file size limit to 500MB (524288000 bytes)
    - This allows uploading larger video files

  2. Important Notes
    - Supabase free tier has storage limits
    - Large files may take longer to upload
*/

-- Update the videos bucket to allow 500MB files
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'videos';