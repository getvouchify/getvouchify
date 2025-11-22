-- Add fulfillment options to deals table
ALTER TABLE deals 
ADD COLUMN fulfillment_type TEXT,
ADD COLUMN delivery_fee NUMERIC,
ADD COLUMN delivery_address TEXT;