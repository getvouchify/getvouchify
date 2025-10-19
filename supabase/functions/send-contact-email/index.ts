import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const BUSINESS_EMAIL = 'hello@getvouchify.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactFormRequest = await req.json();

    console.log(`Processing contact form from ${email}`);

    // Validate required fields
    if (!email || !message || !name) {
      throw new Error('Missing required fields');
    }

    // Email to business
    const businessEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
            .info-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .message-box { background: #fff; border-left: 4px solid #9b87f5; padding: 20px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="info-box">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <h3>Message:</h3>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Quick Reply:</strong> Simply hit reply to respond directly to ${name}.
              </p>
            </div>
            <div class="footer">
              <p>Sent via Vouchify Contact Form</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Confirmation email to user
    const userConfirmationContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .highlight { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Message Received!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Thank you for reaching out to Vouchify. We've received your message and our team will get back to you as soon as possible.</p>
              
              <div class="highlight">
                <p><strong>Your message:</strong></p>
                <p style="font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
              </div>
              
              <p>We typically respond within 24 hours during business days. If your inquiry is urgent, please email us directly at <a href="mailto:${BUSINESS_EMAIL}" style="color: #9b87f5;">${BUSINESS_EMAIL}</a>.</p>
              
              <p style="margin-top: 30px;">
                Looking forward to chatting with you soon!<br>
                <strong>The Vouchify Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vouchify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to business
    const businessEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vouchify Contact <hello@send.updates.getvouchify.com>',
        to: [BUSINESS_EMAIL],
        reply_to: email,
        subject: `Contact Form: ${subject || 'New Message'} - from ${name}`,
        html: businessEmailContent,
      }),
    });

    const businessEmailData = await businessEmailRes.json();

    if (!businessEmailRes.ok) {
      console.error('Failed to send business email:', businessEmailData);
      throw new Error('Failed to send email to business');
    }

    // Send confirmation email to user
    const userEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vouchify <hello@send.updates.getvouchify.com>',
        to: [email],
        subject: 'We received your message! - Vouchify',
        html: userConfirmationContent,
      }),
    });

    const userEmailData = await userEmailRes.json();

    if (!userEmailRes.ok) {
      console.error('Failed to send user confirmation:', userEmailData);
      // Don't throw here - business email was sent successfully
    }

    console.log('Contact form emails sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        businessEmailId: businessEmailData.id,
        userEmailId: userEmailData.id 
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-contact-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
