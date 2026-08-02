interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Reusable utility to dispatch emails using the Resend API.
 * Automatically falls back to terminal logs if RESEND_API_KEY is missing or invalid.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.startsWith("your-resend-api")) {
      console.warn("RESEND_API_KEY is not configured or is a placeholder. Simulating email delivery...");
      console.log(`
====== [EMAIL SIMULATION] ======
To: ${to}
Subject: ${subject}
Message:
${text || html.replace(/<[^>]*>/g, "")}
================================
      `);
      return { success: true, simulated: true };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Campus Stay <onboarding@resend.dev>", // Replace with your verified custom domain once configured in Resend (e.g., hello@campusstay.com)
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Resend API error: ${errorText}`);
      return { success: false, error: errorText };
    }

    return { success: true, simulated: false };
  } catch (error: any) {
    console.error(`Email delivery failure: ${error.message}`);
    return { success: false, error: error.message };
  }
}
