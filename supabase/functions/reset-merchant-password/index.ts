import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    const { data: adminRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !adminRole) {
      throw new Error('Unauthorized: Admin access required');
    }

    const { merchantEmail } = await req.json();

    if (!merchantEmail) {
      throw new Error('Merchant email is required');
    }

    console.log(`Resetting password for merchant: ${merchantEmail}`);

    // Get merchant data
    const { data: merchantData, error: merchantError } = await supabaseClient
      .from('merchants')
      .select('id, user_id, name, email')
      .eq('email', merchantEmail)
      .maybeSingle();

    if (merchantError || !merchantData) {
      throw new Error('Merchant not found');
    }

    if (!merchantData.user_id) {
      throw new Error('Merchant does not have a user account');
    }

    // Generate new secure password
    const generatePassword = () => {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const special = '!@#$%^&*';
      const all = lowercase + uppercase + numbers + special;
      
      let password = '';
      password += lowercase[Math.floor(Math.random() * lowercase.length)];
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
      password += numbers[Math.floor(Math.random() * numbers.length)];
      password += special[Math.floor(Math.random() * special.length)];
      
      for (let i = 4; i < 12; i++) {
        password += all[Math.floor(Math.random() * all.length)];
      }
      
      return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    const newPassword = generatePassword();

    // Update auth user password
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      merchantData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      throw new Error('Failed to update password');
    }

    // Check if credentials record exists
    const { data: existingCred } = await supabaseClient
      .from('merchant_account_credentials')
      .select('id')
      .eq('merchant_id', merchantData.id)
      .maybeSingle();

    if (existingCred) {
      // Update existing credentials
      const { error: credError } = await supabaseClient
        .from('merchant_account_credentials')
        .update({
          temporary_password: newPassword,
          password_changed: false,
          notes: `Password reset by admin on ${new Date().toISOString()}`,
        })
        .eq('merchant_id', merchantData.id);

      if (credError) {
        console.error('Error updating credentials:', credError);
      }
    } else {
      // Insert new credentials record
      const { error: credError } = await supabaseClient
        .from('merchant_account_credentials')
        .insert({
          merchant_id: merchantData.id,
          merchant_email: merchantData.email,
          merchant_name: merchantData.name,
          temporary_password: newPassword,
          created_by_admin_id: user.id,
          password_changed: false,
          notes: `Password generated for existing merchant on ${new Date().toISOString()}`,
        });

      if (credError) {
        console.error('Error storing credentials:', credError);
      }
    }

    console.log('Password reset successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        newPassword,
        message: 'Password reset successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in reset-merchant-password function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
