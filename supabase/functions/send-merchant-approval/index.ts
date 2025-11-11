import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { merchant_email, merchant_name, dashboard_url } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #652C9D;">🎉 Your Vouchify Merchant Account is Approved!</h2>
        <p>Hi ${merchant_name},</p>
        <p>Great news! Your Vouchify merchant application has been approved.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">You can now:</h3>
          <ul style="padding-left: 20px;">
            <li>Create exclusive deals</li>
            <li>Manage your business profile</li>
            <li>Track orders and bookings</li>
            <li>Connect with customers</li>
          </ul>
        </div>
        
        <a href="${dashboard_url}" 
           style="display: inline-block; background: #652C9D; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Access Your Dashboard
        </a>
        
        <div style="background: #FFF9E6; border-left: 4px solid #FFD700; padding: 15px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Getting Started Guide:</h4>
          <ol style="padding-left: 20px; margin: 0;">
            <li>Complete your business profile</li>
            <li>Create your first deal</li>
            <li>Set up your availability</li>
            <li>Start accepting bookings!</li>
          </ol>
        </div>
        
        <p>Welcome to the Vouchify family!</p>
        
        <p>Best regards,<br/>The Vouchify Team</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Vouchify <onboarding@resend.dev>",
        to: [merchant_email],
        subject: "🎉 Your Vouchify Merchant Account is Approved!",
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sending approval email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
