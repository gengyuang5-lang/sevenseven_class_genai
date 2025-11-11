/*
  # Modify Profiles Table for Demo Data

  ## Overview
  Allow profiles to exist independently for demo purposes while maintaining auth integration for real users.

  ## Changes
  1. Drop the foreign key constraint from profiles to auth.users
  2. Re-create it as optional (allowing NULLs would break the primary key, so we remove the constraint)
  3. This allows us to create demo profiles for seeding data

  ## Security
  - Existing RLS policies remain unchanged
  - Real users still get profiles linked to auth.users
  - Demo profiles can exist for displaying content
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;
