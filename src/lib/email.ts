import { Resend } from 'resend';

// The RESEND_API_KEY is loaded from your .env.local file.
// Make sure you replace 're_xxxxxxxxx' in .env.local with your real API key!
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: string) {
  // If no API key is set or if it's the placeholder, fallback to console log
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_xxxxxxxxx') {
    console.log("\n=========================================");
    console.log(`✉️ SIMULATED EMAIL NOTIFICATION (No valid RESEND_API_KEY)`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`-----------------------------------------`);
    console.log(`${body}`);
    console.log("=========================================\n");
    return true;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'TransitOps <onboarding@resend.dev>',
      to: [to], // NOTE: Since you're using Resend's free tier, this MUST match your registered email (e.g. itzhardic@gmail.com)
      subject: subject,
      text: body,
      // html: `<p>${body}</p>` // You can also pass HTML here if you like!
    });

    if (error) {
      console.error("Failed to send email via Resend:", error);
      return false;
    }
    
    console.log(`Email successfully sent to ${to}`);
    return true;
  } catch (err) {
    console.error("Exception when sending email:", err);
    return false;
  }
}
