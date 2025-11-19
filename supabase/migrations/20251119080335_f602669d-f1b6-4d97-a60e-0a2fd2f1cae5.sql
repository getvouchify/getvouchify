-- Add listing_type column to deals table
ALTER TABLE deals 
ADD COLUMN listing_type TEXT DEFAULT 'full_price' 
CHECK (listing_type IN ('full_price', 'loyalty_program', 'discounted_offer'));

-- Add merchant_loyalty_details for loyalty programs
ALTER TABLE deals 
ADD COLUMN merchant_loyalty_details TEXT;

-- Make discount column nullable since it's only required for discounted offers
ALTER TABLE deals 
ALTER COLUMN discount DROP NOT NULL;

COMMENT ON COLUMN deals.listing_type IS 'Type of listing: full_price (default), loyalty_program, or discounted_offer';
COMMENT ON COLUMN deals.merchant_loyalty_details IS 'Loyalty program details entered by merchant (e.g., "Book 3 times, get 50% off the 4th")';