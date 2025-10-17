-- Add UPDATE policy for admins on waitlist table
CREATE POLICY "Admins can update waitlist"
ON public.waitlist
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));