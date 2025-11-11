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
    const { merchant_email, merchant_name, rejection_reason, resubmit_url } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #652C9D;">Update on Your Vouchify Merchant Application</h2>
        <p>Hi ${merchant_name},</p>
        <p>Thank you for your interest in joining Vouchify.</p>
        
        <div style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Application Status</h4>
          <p style="margin: 0;">After reviewing your application, we're unable to approve your account at this time for the following reason:</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-style: italic;">${rejection_reason}</p>
        </div>
        
        <p>You're welcome to address these concerns and resubmit your application.</p>
        
        <a href="${resubmit_url}" 
           style="display: inline-block; background: #652C9D; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Update & Resubmit Application
        </a>
        
        <p>If you have any questions or need clarification, please contact us at support@vouchify.com.</p>
        
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
        subject: "Update on Your Vouchify Merchant Application",
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
    console.error("Error sending rejection email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
