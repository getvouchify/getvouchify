-- Allow merchants to insert their own profile during registration
CREATE POLICY "Merchants can insert their own profile"
ON public.merchants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);