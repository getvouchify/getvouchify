-- Add state and local government columns to waitlist table
ALTER TABLE waitlist 
ADD COLUMN state text,
ADD COLUMN local_government text;