-- ============================================================================
-- PHASE 1: Database Schema & Merchant Authentication
-- ============================================================================

-- 1. EXTEND app_role ENUM TO INCLUDE 'merchant'
-- ============================================================================
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'merchant';

-- 2. EXTEND merchants TABLE WITH ALL REQUIRED FIELDS
-- ============================================================================
ALTER TABLE public.merchants
  -- Business Information
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS registered_name TEXT,
  ADD COLUMN IF NOT EXISTS year_established INTEGER,
  ADD COLUMN IF NOT EXISTS business_reg_number TEXT,
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS full_description TEXT,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  
  -- Location Details
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS lga TEXT,
  ADD COLUMN IF NOT EXISTS landmark TEXT,
  
  -- Operations
  ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}, "wednesday": {"open": "09:00", "close": "17:00"}, "thursday": {"open": "09:00", "close": "17:00"}, "friday": {"open": "09:00", "close": "17:00"}, "saturday": {"open": "09:00", "close": "17:00"}, "sunday": {"open": "09:00", "close": "17:00"}}'::jsonb,
  ADD COLUMN IF NOT EXISTS working_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS delivery_method TEXT,
  ADD COLUMN IF NOT EXISTS delivery_coverage TEXT,
  ADD COLUMN IF NOT EXISTS avg_delivery_time TEXT,
  
  -- Digital Presence
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_handle TEXT,
  ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
  ADD COLUMN IF NOT EXISTS google_business_url TEXT,
  ADD COLUMN IF NOT EXISTS online_menu_url TEXT,
  
  -- Document URLs
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS storefront_image_url TEXT,
  ADD COLUMN IF NOT EXISTS cac_document_url TEXT,
  ADD COLUMN IF NOT EXISTS owner_id_url TEXT,
  ADD COLUMN IF NOT EXISTS menu_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS other_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Banking & Payment
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS settlement_frequency TEXT DEFAULT 'weekly',
  ADD COLUMN IF NOT EXISTS escrow_type TEXT DEFAULT 'standard',
  
  -- Contact Information
  ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS primary_contact_role TEXT,
  ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
  ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS secondary_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS secondary_contact_email TEXT,
  ADD COLUMN IF NOT EXISTS secondary_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_service_contact TEXT,
  ADD COLUMN IF NOT EXISTS support_email TEXT,
  ADD COLUMN IF NOT EXISTS support_phone TEXT,
  ADD COLUMN IF NOT EXISTS support_whatsapp TEXT,
  
  -- Status & Approval
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS approved_by_admin_id UUID REFERENCES auth.users(id),
  
  -- Link to Auth User
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_category ON public.merchants(category);

-- 3. EXTEND deals TABLE WITH BOOKING/SCHEDULING FIELDS
-- ============================================================================
ALTER TABLE public.deals
  -- Booking & Scheduling
  ADD COLUMN IF NOT EXISTS requires_booking BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_time_slot BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_qr_code BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS available_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  ADD COLUMN IF NOT EXISTS available_time_slots JSONB DEFAULT '[]'::jsonb,
  
  -- Deal Validity
  ADD COLUMN IF NOT EXISTS deal_start_date DATE,
  ADD COLUMN IF NOT EXISTS deal_end_date DATE,
  ADD COLUMN IF NOT EXISTS usage_limit INTEGER,
  ADD COLUMN IF NOT EXISTS daily_limit INTEGER,
  ADD COLUMN IF NOT EXISTS expiry_date DATE,
  
  -- Additional Details
  ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  ADD COLUMN IF NOT EXISTS age_restriction TEXT,
  ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT,
  ADD COLUMN IF NOT EXISTS deal_images JSONB DEFAULT '[]'::jsonb;

-- Create indexes for deals
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON public.deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_category ON public.deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_is_active ON public.deals(is_active);

-- 4. CREATE merchant_branches TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.merchant_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  branch_name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT,
  city TEXT,
  lga TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.merchant_branches ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_branches_merchant_id ON public.merchant_branches(merchant_id);

-- 5. CREATE bookings TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'redeemed', 'cancelled', 'expired')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  special_instructions TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bookings_deal_id ON public.bookings(deal_id);
CREATE INDEX IF NOT EXISTS idx_bookings_merchant_id ON public.bookings(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_qr_code ON public.bookings(qr_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 6. CREATE qr_redemptions TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.qr_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  redeemed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.qr_redemptions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_qr_redemptions_booking_id ON public.qr_redemptions(booking_id);
CREATE INDEX IF NOT EXISTS idx_qr_redemptions_merchant_id ON public.qr_redemptions(merchant_id);

-- 7. CREATE merchant_messages TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.merchant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('merchant', 'customer')),
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.merchant_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.merchant_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_merchant_id ON public.merchant_messages(merchant_id);
CREATE INDEX IF NOT EXISTS idx_messages_customer_id ON public.merchant_messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON public.merchant_messages(order_id);

-- 8. CREATE settlements TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
  payout_date DATE,
  transaction_reference TEXT,
  bank_details JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_settlements_merchant_id ON public.settlements(merchant_id);
CREATE INDEX IF NOT EXISTS idx_settlements_payout_status ON public.settlements(payout_status);

-- 9. CREATE merchant_documents TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.merchant_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

ALTER TABLE public.merchant_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_documents_merchant_id ON public.merchant_documents(merchant_id);

-- 10. RLS POLICIES FOR MERCHANT_BRANCHES
-- ============================================================================
CREATE POLICY "Merchants can view their own branches"
  ON public.merchant_branches FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert their own branches"
  ON public.merchant_branches FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own branches"
  ON public.merchant_branches FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete their own branches"
  ON public.merchant_branches FOR DELETE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all branches"
  ON public.merchant_branches FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 11. RLS POLICIES FOR BOOKINGS
-- ============================================================================
CREATE POLICY "Merchants can view their bookings"
  ON public.bookings FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view their bookings"
  ON public.bookings FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Merchants can update their bookings"
  ON public.bookings FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage bookings"
  ON public.bookings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 12. RLS POLICIES FOR QR_REDEMPTIONS
-- ============================================================================
CREATE POLICY "Merchants can view their redemptions"
  ON public.qr_redemptions FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert redemptions"
  ON public.qr_redemptions FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all redemptions"
  ON public.qr_redemptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 13. RLS POLICIES FOR MERCHANT_MESSAGES
-- ============================================================================
CREATE POLICY "Merchants can view their messages"
  ON public.merchant_messages FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view their messages"
  ON public.merchant_messages FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Merchants can send messages"
  ON public.merchant_messages FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    ) AND sender_type = 'merchant'
  );

CREATE POLICY "Customers can send messages"
  ON public.merchant_messages FOR INSERT
  WITH CHECK (customer_id = auth.uid() AND sender_type = 'customer');

CREATE POLICY "Merchants can update their messages"
  ON public.merchant_messages FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.merchant_messages FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 14. RLS POLICIES FOR SETTLEMENTS
-- ============================================================================
CREATE POLICY "Merchants can view their settlements"
  ON public.settlements FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all settlements"
  ON public.settlements FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 15. RLS POLICIES FOR MERCHANT_DOCUMENTS
-- ============================================================================
CREATE POLICY "Merchants can view their documents"
  ON public.merchant_documents FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert their documents"
  ON public.merchant_documents FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents"
  ON public.merchant_documents FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
  ON public.merchants FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- 16. UPDATE MERCHANTS RLS TO ALLOW MERCHANTS TO VIEW/UPDATE THEIR OWN DATA
-- ============================================================================
CREATE POLICY "Merchants can view their own profile"
  ON public.merchants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Merchants can update their own profile"
  ON public.merchants FOR UPDATE
  USING (user_id = auth.uid());

-- 17. UPDATE DEALS RLS TO ALLOW MERCHANTS TO MANAGE THEIR DEALS
-- ============================================================================
CREATE POLICY "Merchants can view their own deals"
  ON public.deals FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create deals"
  ON public.deals FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own deals"
  ON public.deals FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete their own deals"
  ON public.deals FOR DELETE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE user_id = auth.uid()
    )
  );

-- 18. CREATE STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('merchant-logos', 'merchant-logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('merchant-storefronts', 'merchant-storefronts', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('merchant-documents', 'merchant-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('merchant-deal-images', 'merchant-deal-images', true)
ON CONFLICT (id) DO NOTHING;

-- 19. STORAGE RLS POLICIES FOR merchant-logos
-- ============================================================================
CREATE POLICY "Merchants can upload their logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'merchant-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view merchant logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'merchant-logos');

CREATE POLICY "Merchants can update their logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'merchant-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 20. STORAGE RLS POLICIES FOR merchant-storefronts
-- ============================================================================
CREATE POLICY "Merchants can upload storefront images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'merchant-storefronts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view storefront images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'merchant-storefronts');

CREATE POLICY "Merchants can update storefronts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'merchant-storefronts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 21. STORAGE RLS POLICIES FOR merchant-documents
-- ============================================================================
CREATE POLICY "Merchants can upload their documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'merchant-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Merchants can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'merchant-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'merchant-documents' AND
    has_role(auth.uid(), 'admin')
  );

-- 22. STORAGE RLS POLICIES FOR merchant-deal-images
-- ============================================================================
CREATE POLICY "Merchants can upload deal images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'merchant-deal-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view deal images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'merchant-deal-images');

CREATE POLICY "Merchants can update deal images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'merchant-deal-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 23. CREATE TRIGGER FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON public.merchant_branches
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();