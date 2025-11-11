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
    const { merchant_email, merchant_name } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #652C9D;">Welcome to Vouchify!</h2>
        <p>Hi ${merchant_name || "there"},</p>
        <p>Welcome to Vouchify! We're excited to have you join our growing community of merchants.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Next Steps:</h3>
          <ol style="padding-left: 20px;">
            <li>Complete your business profile</li>
            <li>Upload verification documents</li>
            <li>Submit for approval</li>
            <li>Start creating deals!</li>
          </ol>
        </div>
        
        <p>Our team typically reviews applications within 24-48 hours.</p>
        
        <p>If you have any questions, reach out to us at support@vouchify.com</p>
        
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
        subject: "Welcome to Vouchify Merchant Platform!",
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
    console.error("Error sending welcome email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
