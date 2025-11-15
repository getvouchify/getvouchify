-- Create merchant_account_credentials table to store generated passwords
CREATE TABLE IF NOT EXISTS merchant_account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  merchant_email TEXT NOT NULL,
  merchant_name TEXT,
  business_name TEXT,
  temporary_password TEXT NOT NULL,
  created_by_admin_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  password_changed BOOLEAN DEFAULT FALSE,
  first_login_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS
ALTER TABLE merchant_account_credentials ENABLE ROW LEVEL SECURITY;

-- Only admins can view credentials
CREATE POLICY "Admins can view all credentials"
  ON merchant_account_credentials FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can insert credentials
CREATE POLICY "Admins can insert credentials"
  ON merchant_account_credentials FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update credentials
CREATE POLICY "Admins can update credentials"
  ON merchant_account_credentials FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Add must_change_password column to merchants table
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_merchant_credentials_merchant_id ON merchant_account_credentials(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_credentials_email ON merchant_account_credentials(merchant_email);