-- Add merchant_id column to deals table
ALTER TABLE public.deals 
ADD COLUMN merchant_id uuid REFERENCES public.merchants(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_deals_merchant_id ON public.deals(merchant_id);

-- Add comment for documentation
COMMENT ON COLUMN public.deals.merchant_id IS 'Foreign key linking deal to merchant';