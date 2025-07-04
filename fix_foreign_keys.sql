BEGIN;

-- Fix samples table foreign key
ALTER TABLE samples DROP CONSTRAINT IF EXISTS samples_uploaded_by_user_id_fkey;
ALTER TABLE samples ADD CONSTRAINT samples_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES profiles(id);

-- Fix news table foreign key
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_author_id_fkey;
ALTER TABLE news ADD CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES profiles(id);

-- Fix support_tickets table foreign keys
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);

ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_assigned_to_admin_id_fkey;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_assigned_to_admin_id_fkey FOREIGN KEY (assigned_to_admin_id) REFERENCES profiles(id);

-- Note: support_users table structure needs to be checked first
-- The user_id column may not exist or may have a different name

COMMIT; 