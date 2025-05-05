
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  confirmationUrl: string;
  username?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, username }: ConfirmationEmailRequest = await req.json();
    
    if (!email || !confirmationUrl) {
      throw new Error("Email and confirmation URL are required");
    }

    const displayName = username || email.split('@')[0];

    const emailResponse = await resend.emails.send({
      from: "MovieVerse <onboarding@resend.dev>",
      to: [email],
      subject: "Confirm Your MovieVerse Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #e50914; margin-bottom: 10px;">MovieVerse</h1>
            <p style="font-size: 18px; font-weight: bold;">Just one more step!</p>
          </div>
          
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p>Hello ${displayName},</p>
            <p>Thank you for signing up for MovieVerse! To activate your account and start exploring movies, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm My Account</a>
            </div>
            
            <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #777;">
            <p>© ${new Date().getFullYear()} MovieVerse. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Confirmation email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
