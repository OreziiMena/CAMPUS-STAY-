import { removeEmojis, maskPhoneNumbers } from "./email-sanitizer";

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
  isInspectionMessage = false,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  isInspectionMessage?: boolean;
}): Promise<{ success: boolean; error?: string; debug?: boolean; data?: any }> {
  // 1. Remove all inline emojis from subject and body content
  const cleanedSubject = removeEmojis(subject).trim();
  let cleanedHtml = removeEmojis(html).trim();
  let cleanedText = text ? removeEmojis(text).trim() : cleanedHtml.replace(/<[^>]*>/g, " ").trim();

  // 2. Remove / mask phone numbers from email unless it is an inspection message
  if (!isInspectionMessage) {
    cleanedHtml = maskPhoneNumbers(cleanedHtml);
    cleanedText = maskPhoneNumbers(cleanedText);
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_test_key" || apiKey === "placeholder" || apiKey.includes("your_resend_api_key")) {
    console.log("\n==============================================");
    console.log(`[DEV / LOCAL EMAIL FALLBACK]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${cleanedSubject}`);
    console.log(`From: ${from || "Campus Tent <support@campustent.com>"}`);
    console.log(`Reply-To: ${replyTo || "support@campustent.com"}`);
    console.log(`Content:\n${cleanedHtml.replace(/<[^>]*>/g, " ").trim()}`);
    console.log("==============================================\n");
    return { success: true, debug: true };
  }

  // Priority: 1. Explicit from param -> 2. EMAIL_FROM in env -> 3. RESEND_FROM in env -> 4. support@campustent.com
  const fromAddress = from || process.env.EMAIL_FROM || process.env.RESEND_FROM || "Campus Tent <support@campustent.com>";
  const replyToAddress = replyTo || process.env.EMAIL_REPLY_TO || "support@campustent.com";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to.trim()],
        reply_to: replyToAddress,
        subject: cleanedSubject,
        html: cleanedHtml,
        text: cleanedText,
      }),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error(`Resend API Error (HTTP ${response.status}):`, responseBody);
      return { 
        success: false, 
        error: responseBody 
      };
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(responseBody);
    } catch {
      // response is plain text
    }

    return { success: true, data: parsedData };
  } catch (err: any) {
    console.error("sendEmail Network Exception:", err);
    return { success: false, error: err.message || "Network error while sending email." };
  }
}
