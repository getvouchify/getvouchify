import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleCheck) {
      throw new Error("Admin access required");
    }

    const { merchantEmail } = await req.json();

    if (!merchantEmail) {
      throw new Error("Merchant email is required");
    }

    // Check if account already exists
    const { data: existingMerchant } = await supabaseAdmin
      .from("merchants")
      .select("user_id")
      .eq("email", merchantEmail)
      .maybeSingle();

    if (existingMerchant?.user_id) {
      throw new Error("Account already exists for this merchant");
    }

    // Fetch waitlist data
    const { data: waitlistData, error: waitlistError } = await supabaseAdmin
      .from("waitlist")
      .select("*")
      .eq("email", merchantEmail)
      .eq("type", "merchant")
      .maybeSingle();

    if (waitlistError || !waitlistData) {
      throw new Error("Merchant not found in waitlist");
    }

    // Generate secure password
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const special = '!@#$%&*';
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    // Create auth user
    const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
      email: merchantEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: waitlistData.name,
        business_name: waitlistData.business_name,
      }
    });

    if (authCreateError) {
      throw new Error(`Failed to create auth user: ${authCreateError.message}`);
    }

    // Assign merchant role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: "merchant",
      });

    if (roleError) {
      throw new Error(`Failed to assign role: ${roleError.message}`);
    }

    // Create merchant profile with pre-populated data and auto-approve
    const { data: merchantData, error: merchantError } = await supabaseAdmin
      .from("merchants")
      .insert({
        user_id: authData.user.id,
        email: waitlistData.email,
        name: waitlistData.business_name || waitlistData.name || '',
        phone: waitlistData.phone || '',
        category: waitlistData.category || '',
        state: waitlistData.state || '',
        lga: waitlistData.local_government || '',
        primary_contact_name: waitlistData.name || '',
        primary_contact_email: waitlistData.email,
        primary_contact_phone: waitlistData.phone || '',
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by_admin_id: user.id,
        must_change_password: false,
      })
      .select()
      .single();

    if (merchantError || !merchantData) {
      throw new Error(`Failed to create merchant profile: ${merchantError?.message || 'Unknown error'}`);
    }

    // Store credentials in the credentials table for admin access
    const { error: credentialsError } = await supabaseAdmin
      .from("merchant_account_credentials")
      .insert({
        merchant_id: merchantData.id,
        merchant_email: merchantEmail,
        merchant_name: waitlistData.name || '',
        business_name: waitlistData.business_name || '',
        temporary_password: password,
        created_by_admin_id: user.id,
        password_changed: false,
      });

    if (credentialsError) {
      console.error("Failed to store credentials:", credentialsError);
      // Don't throw error here, merchant account is already created
    }

    console.log(`Successfully created and approved account for ${merchantEmail}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        email: merchantEmail,
        password: password,
        name: waitlistData.name,
        business_name: waitlistData.business_name,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error creating merchant account:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
