import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESSKEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

const isR2Configured = !!(
  accountId && accountId !== "your-cloudflare-account-id" &&
  accessKeyId && accessKeyId !== "your-r2-access-key-id" &&
  secretAccessKey && secretAccessKey !== "your-r2-secret-access-key" &&
  bucketName && bucketName !== "your-r2-bucket-name"
);

// S3 Client configured for Cloudflare R2
const s3 = isR2Configured ? new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
}) : null;

export async function uploadToR2(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!s3 || !isR2Configured) {
    return { success: false, error: "Cloudflare R2 is not configured. Falling back to local storage." };
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Format final public URL
    const cleanPublicUrl = publicUrl?.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
    return {
      success: true,
      url: `${cleanPublicUrl}/${filename}`,
    };
  } catch (err: any) {
    console.error("Cloudflare R2 upload error:", err);
    return { success: false, error: err.message || "Failed to upload" };
  }
}
