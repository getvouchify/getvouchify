import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WaitlistConfirmationRequest {
  email: string;
  name?: string;
  businessName?: string;
  type: 'customer' | 'business';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, businessName, type }: WaitlistConfirmationRequest = await req.json();

    console.log(`Sending waitlist confirmation to ${email} (type: ${type})`);

    // Prepare email content based on type
    const isCustomer = type === 'customer';
    const displayName = name || 'there';
    
    const subject = isCustomer 
      ? "Welcome to Vouchify! 🎉" 
      : "Welcome to Vouchify for Business! 🚀";

    const htmlContent = isCustomer ? `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .highlight { background: #f0f0f0; padding: 15px; border-left: 4px solid #9b87f5; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Vouchify!</h1>
            </div>
            <div class="content">
              <h2>Hi ${displayName}!</h2>
              <p>Welcome to the Vouchify waitlist! You're now part of an exclusive group that will be the first to discover amazing deals in your area.</p>
              
              <div class="highlight">
                <strong>What happens next?</strong>
                <ul>
                  <li>📧 We'll notify you as soon as we launch</li>
                  <li>🎁 You'll get early access to exclusive deals</li>
                  <li>🏪 Be the first to explore local businesses</li>
                </ul>
              </div>
              
              <p>Get ready for the best deals Lagos has to offer!</p>
              
              <p style="margin-top: 30px;">
                <strong>Stay connected:</strong><br>
                📱 Instagram: <a href="https://instagram.com/vouchify" style="color: #9b87f5;">@vouchify</a>
              </p>
              
              <p style="margin-top: 30px;">
                Excited to have you on board!<br>
                <strong>The Vouchify Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>You received this email because you joined the Vouchify waitlist.</p>
              <p>&copy; ${new Date().getFullYear()} Vouchify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .highlight { background: #f0f0f0; padding: 15px; border-left: 4px solid #9b87f5; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to Vouchify for Business!</h1>
            </div>
            <div class="content">
              <h2>Hi ${displayName}${businessName ? ` from ${businessName}` : ''}!</h2>
              <p>Thank you for joining the Vouchify business waitlist. We're excited to help you reach 500,000+ shoppers and grow your business.</p>
              
              <div class="highlight">
                <strong>What's next?</strong>
                <ul>
                  <li>👥 Our team will review your application</li>
                  <li>📞 We'll reach out within 2-3 business days</li>
                  <li>🎯 Get ready to create your first exclusive deal</li>
                  <li>📈 Start attracting new customers immediately</li>
                </ul>
              </div>
              
              <p><strong>Why partner with Vouchify?</strong></p>
              <ul>
                <li>Reach 500,000+ active shoppers in Lagos</li>
                <li>No upfront costs - only pay when you get customers</li>
                <li>Boost visibility during slow periods</li>
                <li>Build customer loyalty with exclusive deals</li>
              </ul>
              
              <p style="margin-top: 30px;">
                Questions? Simply reply to this email anytime - we're here to help!
              </p>
              
              <p style="margin-top: 30px;">
                Looking forward to partnering with you!<br>
                <strong>The Vouchify Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>You received this email because you joined the Vouchify business waitlist.</p>
              <p>&copy; ${new Date().getFullYear()} Vouchify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vouchify <hello@send.updates.getvouchify.com>',
        to: [email],
        reply_to: 'hello@getvouchify.com',
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, messageId: data.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-waitlist-confirmation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
