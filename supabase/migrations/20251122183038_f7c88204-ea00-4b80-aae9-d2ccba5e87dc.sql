-- Add delivery payment method field to deals table
ALTER TABLE deals 
ADD COLUMN delivery_payment_method TEXT 
CHECK (delivery_payment_method IN ('buyer_to_rider', 'included_in_price', 'buyer_choice'));