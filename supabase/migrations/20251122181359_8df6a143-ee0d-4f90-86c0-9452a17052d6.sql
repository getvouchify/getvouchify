-- Add delivery and tracking columns to bookings table
ALTER TABLE bookings 
ADD COLUMN customer_address TEXT,
ADD COLUMN delivery_status TEXT DEFAULT 'pending',
ADD COLUMN shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN tracking_notes TEXT;

-- Add delivery and tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN customer_address TEXT,
ADD COLUMN delivery_status TEXT DEFAULT 'pending',
ADD COLUMN shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN tracking_notes TEXT;

-- Add comments to document delivery_status values
COMMENT ON COLUMN bookings.delivery_status IS 'Values: pending, processing, shipped, out_for_delivery, delivered, cancelled';
COMMENT ON COLUMN orders.delivery_status IS 'Values: pending, processing, shipped, out_for_delivery, delivered, cancelled';