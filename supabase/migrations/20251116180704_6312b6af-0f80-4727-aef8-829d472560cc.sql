-- Allow authenticated users to insert merchant or user roles for themselves
-- CRITICAL: Does NOT allow self-assignment of 'admin' role to prevent privilege escalation
CREATE POLICY "Users can insert their own merchant or user role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('merchant', 'user')
);