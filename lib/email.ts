export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_test_key" || apiKey.includes("your_resend_api_key")) {
    console.log("\n==============================================");
    console.log(`[DEV EMAIL DELIVERY FALLBACK]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, " ").trim()}`);
    console.log("==============================================\n");
    return { success: true, debug: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Campus Stay <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
