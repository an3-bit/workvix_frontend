-- First, let's check what columns exist in support_users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'support_users';

-- If user_id column doesn't exist, we need to add it
-- Uncomment the following if user_id column is missing:
-- ALTER TABLE support_users ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);

-- Then add the foreign key constraint
-- ALTER TABLE support_users DROP CONSTRAINT IF EXISTS support_users_user_id_fkey;
-- ALTER TABLE support_users ADD CONSTRAINT support_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id); 