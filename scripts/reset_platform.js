const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

// 1. Manually parse .env to guarantee environment variables are loaded
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex !== -1) {
        const key = trimmed.substring(0, eqIndex).trim();
        let val = trimmed.substring(eqIndex + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const prisma = new PrismaClient();

// 2. Configure Cloudflare R2 client
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESSKEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

const isR2Configured = !!(
  accountId && accountId !== "your-cloudflare-account-id" &&
  accessKeyId && accessKeyId !== "your-r2-access-key-id" &&
  secretAccessKey && secretAccessKey !== "your-r2-secret-access-key" &&
  bucketName && bucketName !== "your-r2-bucket-name"
);

const s3 = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

async function purgeR2PropertyMedia() {
  console.log("\n--- STEP 1: CLOUDFLARE R2 PROPERTY MEDIA PURGE ---");
  if (!s3 || !isR2Configured) {
    console.warn("⚠️  Cloudflare R2 is not configured. Skipping bucket purge.");
    return { deletedCount: 0 };
  }

  let totalDeleted = 0;
  try {
    console.log(`Scanning bucket '${bucketName}' for property media under prefix 'properties/'...`);
    let continuationToken = undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "properties/",
        ContinuationToken: continuationToken,
      });

      const listResponse = await s3.send(listCommand);
      const objects = listResponse.Contents || [];

      if (objects.length > 0) {
        console.log(`Found ${objects.length} media file(s) to delete...`);
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key })),
            Quiet: true,
          },
        };

        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3.send(deleteCommand);
        totalDeleted += objects.length;
        console.log(`✓ Deleted ${objects.length} media file(s) from R2.`);
      }

      continuationToken = listResponse.IsTruncated
        ? listResponse.NextContinuationToken
        : undefined;
    } while (continuationToken);

    console.log(`✓ R2 Media Purge Complete. Total deleted property files: ${totalDeleted}`);
    return { deletedCount: totalDeleted };
  } catch (err) {
    console.error("❌ Error purging Cloudflare R2 property media:", err.message);
    return { deletedCount: totalDeleted, error: err.message };
  }
}

async function runPlatformReset() {
  console.log("=================================================");
  console.log("       CAMPUS TENT - PLATFORM RESET UTILITY      ");
  console.log("=================================================");

  // 1. Pre-flight stats
  const preProperties = await prisma.property.count();
  const preViewings = await prisma.viewing.count();
  const preQueries = await prisma.availabilityQuery.count();
  const prePayments = await prisma.inspectionPayment.count();
  const preInquiries = await prisma.inquiry.count();
  const preChatRooms = await prisma.chatRoom.count();
  const preMessages = await prisma.message.count();
  const preReports = await prisma.report.count();
  const preStudentProfiles = await prisma.studentProfile.count();
  const preStudentUsers = await prisma.user.count({ where: { role: "STUDENT" } });

  const preservedAgents = await prisma.user.count({ where: { role: "AGENT" } });
  const preservedAgentProfiles = await prisma.agentProfile.count();
  const preservedAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  const preservedAmbassadors = await prisma.ambassadorApplication.count();

  console.log("\n[PRE-FLIGHT AUDIT]");
  console.log(`• Properties to delete:         ${preProperties}`);
  console.log(`• Viewings / Bookings:         ${preViewings}`);
  console.log(`• Availability Queries:        ${preQueries}`);
  console.log(`• Inspection Payments:         ${prePayments}`);
  console.log(`• Inquiries:                   ${preInquiries}`);
  console.log(`• Chat Rooms:                  ${preChatRooms}`);
  console.log(`• Chat Messages:               ${preMessages}`);
  console.log(`• Reports:                     ${preReports}`);
  console.log(`• Student Profiles:            ${preStudentProfiles}`);
  console.log(`• Student User Accounts:       ${preStudentUsers}`);
  console.log("-------------------------------------------------");
  console.log(`🛡️  PRESERVED Agent Users:       ${preservedAgents}`);
  console.log(`🛡️  PRESERVED Agent Profiles:    ${preservedAgentProfiles}`);
  console.log(`🛡️  PRESERVED Admin Users:       ${preservedAdmins}`);
  console.log(`🛡️  PRESERVED Ambassadors:       ${preservedAmbassadors}`);
  console.log("-------------------------------------------------");

  // 2. Purge R2 Media
  const r2Result = await purgeR2PropertyMedia();

  // 3. Database Atomic Transaction
  console.log("\n--- STEP 2: ATOMIC DATABASE TRANSACTION ---");
  console.log("Executing transaction to wipe student records & property listings...");

  await prisma.$transaction(
    async (tx) => {
      // 1. Messages & ChatRooms
      const delMessages = await tx.message.deleteMany({});
      const delChatRooms = await tx.chatRoom.deleteMany({});
      console.log(`  ✓ Cleared ${delMessages.count} messages and ${delChatRooms.count} chat rooms.`);

      // 2. Viewings, Inquiries, Availability Queries
      const delViewings = await tx.viewing.deleteMany({});
      const delQueries = await tx.availabilityQuery.deleteMany({});
      const delInquiries = await tx.inquiry.deleteMany({});
      console.log(`  ✓ Cleared ${delViewings.count} viewings, ${delQueries.count} availability queries, and ${delInquiries.count} inquiries.`);

      // 3. Inspection Payments
      const delPayments = await tx.inspectionPayment.deleteMany({});
      console.log(`  ✓ Cleared ${delPayments.count} inspection payments & escrow ledgers.`);

      // 4. Reports
      const delReports = await tx.report.deleteMany({});
      console.log(`  ✓ Cleared ${delReports.count} reports.`);

      // 5. Properties
      const delProperties = await tx.property.deleteMany({});
      console.log(`  ✓ Cleared ${delProperties.count} properties.`);

      // 6. Student Profiles & Student Accounts
      const delStudentProfiles = await tx.studentProfile.deleteMany({});
      const delStudentUsers = await tx.user.deleteMany({ where: { role: "STUDENT" } });
      console.log(`  ✓ Cleared ${delStudentProfiles.count} student profiles and ${delStudentUsers.count} student user accounts.`);

      // 7. Clean up activity logs associated with deleted student records or properties
      const delActivityLogs = await tx.activityLog.deleteMany({ where: { userRole: "STUDENT" } });
      console.log(`  ✓ Cleared ${delActivityLogs.count} student activity log entries.`);

      // 8. Record audit log entry
      await tx.auditLog.create({
        data: {
          actorRole: "SYSTEM",
          actorName: "Platform Reset Utility",
          actorEmail: "system@campustent.com",
          action: "PLATFORM_RESET",
          targetType: "DATABASE_AND_R2",
          targetLabel: "Complete Platform Reset",
          details: `Platform reset executed: Purged ${r2Result.deletedCount} R2 media files, deleted ${delProperties.count} properties, ${delStudentUsers.count} student accounts, ${delPayments.count} payments, ${delChatRooms.count} chat rooms. Preserved ${preservedAgents} agent accounts and ${preservedAdmins} admins.`,
          metadata: {
            r2MediaDeleted: r2Result.deletedCount,
            propertiesDeleted: delProperties.count,
            studentUsersDeleted: delStudentUsers.count,
            paymentsDeleted: delPayments.count,
            chatRoomsDeleted: delChatRooms.count,
            preservedAgentCount: preservedAgents,
            preservedAdminCount: preservedAdmins,
            preservedAmbassadorCount: preservedAmbassadors,
          },
        },
      });
      console.log("  ✓ Audit log entry created.");
    },
    { maxWait: 20000, timeout: 60000 }
  );

  console.log("✓ Atomic database transaction committed successfully.");

  // 4. Post-execution verification
  console.log("\n--- STEP 3: POST-EXECUTION VERIFICATION ---");
  const postProperties = await prisma.property.count();
  const postViewings = await prisma.viewing.count();
  const postPayments = await prisma.inspectionPayment.count();
  const postChatRooms = await prisma.chatRoom.count();
  const postStudentUsers = await prisma.user.count({ where: { role: "STUDENT" } });
  const postAgentUsers = await prisma.user.count({ where: { role: "AGENT" } });
  const postAgentProfiles = await prisma.agentProfile.count();
  const postAdminUsers = await prisma.user.count({ where: { role: "ADMIN" } });
  const postAmbassadors = await prisma.ambassadorApplication.count();

  console.log(`• Properties remaining:        ${postProperties} (expected: 0)`);
  console.log(`• Viewings remaining:          ${postViewings} (expected: 0)`);
  console.log(`• Payments remaining:          ${postPayments} (expected: 0)`);
  console.log(`• Chat Rooms remaining:        ${postChatRooms} (expected: 0)`);
  console.log(`• Student Users remaining:     ${postStudentUsers} (expected: 0)`);
  console.log(`🛡️  Agent Users preserved:      ${postAgentUsers} (expected: ${preservedAgents})`);
  console.log(`🛡️  Agent Profiles preserved:   ${postAgentProfiles} (expected: ${preservedAgentProfiles})`);
  console.log(`🛡️  Admin Users preserved:      ${postAdminUsers} (expected: ${preservedAdmins})`);
  console.log(`🛡️  Ambassadors preserved:      ${postAmbassadors} (expected: ${preservedAmbassadors})`);

  // Sample check on preserved agent profiles
  const sampleAgent = await prisma.user.findFirst({
    where: { role: "AGENT" },
    include: { agentProfile: true },
  });

  if (sampleAgent) {
    console.log("\n[SAMPLE PRESERVED AGENT VERIFICATION]");
    console.log(`• Agent Name:     ${sampleAgent.agentProfile ? sampleAgent.agentProfile.fullName : "N/A"}`);
    console.log(`• Agent Email:    ${sampleAgent.email}`);
    console.log(`• Bank Name:      ${sampleAgent.agentProfile ? sampleAgent.agentProfile.bankName : "N/A"}`);
    console.log(`• Account Number: ${sampleAgent.agentProfile ? sampleAgent.agentProfile.accountNumber : "N/A"}`);
    console.log(`• Recipient Code: ${sampleAgent.agentProfile ? sampleAgent.agentProfile.recipientCode : "N/A"}`);
    console.log(`• Password Hash:  ${sampleAgent.password ? "✓ Secured intact" : "N/A"}`);
  }

  console.log("\n=================================================");
  console.log("       PLATFORM RESET COMPLETED SUCCESSFULLY     ");
  console.log("=================================================\n");
}

runPlatformReset()
  .catch((err) => {
    console.error("FATAL: Platform reset failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
