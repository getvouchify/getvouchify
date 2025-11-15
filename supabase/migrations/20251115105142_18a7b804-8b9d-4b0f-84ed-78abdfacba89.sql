-- Add secondary contact role column to merchants table
ALTER TABLE merchants 
ADD COLUMN IF NOT EXISTS secondary_contact_role TEXT;