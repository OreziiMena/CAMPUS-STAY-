const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create Default Admin User
  const adminEmail = "admin@campusstay.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  let adminUser;
  if (!existingAdmin) {
    console.log("Creating default Admin user...");
    const hashedAdminPassword = await bcrypt.hash("adminpassword123", 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        phone: "+2349000000000",
        password: hashedAdminPassword,
        role: "ADMIN",
        isEmailVerified: true
      }
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    adminUser = existingAdmin;
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // 2. Create Sample Agent Users
  // Agent 1: Verified Agent
  const agent1Email = "agent.verified@campusstay.com";
  const existingAgent1 = await prisma.user.findUnique({
    where: { email: agent1Email }
  });
  
  let agent1;
  if (!existingAgent1) {
    console.log("Creating verified agent...");
    const hashedPwd = await bcrypt.hash("agentpassword", 10);
    agent1 = await prisma.user.create({
      data: {
        email: agent1Email,
        phone: "+2349011111111",
        password: hashedPwd,
        role: "AGENT",
        isEmailVerified: true,
        agentProfile: {
          create: {
            fullName: "Precious Olise",
            address: "12 FUPRE Road, Effurun",
            agencyName: "Olise & Partners Realty",
            bio: "Experienced student housing consultant operating around FUPRE and PTI campus areas.",
            isVerified: true,
            ninDocument: "/uploads/verification/sample-nin.pdf"
          }
        }
      },
      include: { agentProfile: true }
    });
  } else {
    agent1 = await prisma.user.findUnique({
      where: { email: agent1Email },
      include: { agentProfile: true }
    });
  }

  // Agent 2: Unverified Agent
  const agent2Email = "agent.pending@campusstay.com";
  const existingAgent2 = await prisma.user.findUnique({
    where: { email: agent2Email }
  });

  let agent2;
  if (!existingAgent2) {
    console.log("Creating unverified (pending) agent...");
    const hashedPwd = await bcrypt.hash("agentpassword", 10);
    agent2 = await prisma.user.create({
      data: {
        email: agent2Email,
        phone: "+2349022222222",
        password: hashedPwd,
        role: "AGENT",
        isEmailVerified: true,
        agentProfile: {
          create: {
            fullName: "Boma Jack",
            address: "PTI Road, Effurun",
            agencyName: "Boma Housing Agency",
            bio: "New agent looking to list hostel accommodation options.",
            isVerified: false,
            ninDocument: "/uploads/verification/sample-nin-pending.pdf"
          }
        }
      },
      include: { agentProfile: true }
    });
  } else {
    agent2 = await prisma.user.findUnique({
      where: { email: agent2Email },
      include: { agentProfile: true }
    });
  }

  // 3. Create Sample Student Users
  // Student 1: Verified Student
  const student1Email = "student.verified@campusstay.com";
  const existingStudent1 = await prisma.user.findUnique({
    where: { email: student1Email }
  });

  let student1;
  if (!existingStudent1) {
    console.log("Creating verified student...");
    const hashedPwd = await bcrypt.hash("studentpassword", 10);
    student1 = await prisma.user.create({
      data: {
        email: student1Email,
        phone: "+2349033333333",
        password: hashedPwd,
        role: "STUDENT",
        isEmailVerified: true,
        studentProfile: {
          create: {
            fullName: "Tobi Adebayo",
            university: "FUPRE",
            username: "tobi_fupre",
            isVerified: true,
            idCardDoc: "/uploads/verification/student-id.jpg",
            feesReceiptDoc: "/uploads/verification/fees-receipt.jpg",
            preferences: {
              openToRoommates: true,
              budgetLimit: 150000,
              gender: "Male",
              cleanliness: "High",
              sleepSchedule: "Early Bird",
              noiseLevel: "Quiet"
            }
          }
        }
      },
      include: { studentProfile: true }
    });
  } else {
    student1 = await prisma.user.findUnique({
      where: { email: student1Email },
      include: { studentProfile: true }
    });
  }

  // Student 2: Unverified Student
  const student2Email = "student.pending@campusstay.com";
  const existingStudent2 = await prisma.user.findUnique({
    where: { email: student2Email }
  });

  let student2;
  if (!existingStudent2) {
    console.log("Creating unverified (pending) student...");
    const hashedPwd = await bcrypt.hash("studentpassword", 10);
    student2 = await prisma.user.create({
      data: {
        email: student2Email,
        phone: "+2349044444444",
        password: hashedPwd,
        role: "STUDENT",
        isEmailVerified: true,
        studentProfile: {
          create: {
            fullName: "Amara Nwachukwu",
            university: "DSUST",
            username: "amara_dsust",
            isVerified: false,
            idCardDoc: "/uploads/verification/student-id-pending.jpg",
            preferences: {
              openToRoommates: true,
              budgetLimit: 120000,
              gender: "Female",
              cleanliness: "Average",
              sleepSchedule: "Flexible",
              noiseLevel: "Flexible"
            }
          }
        }
      },
      include: { studentProfile: true }
    });
  } else {
    student2 = await prisma.user.findUnique({
      where: { email: student2Email },
      include: { studentProfile: true }
    });
  }

  // 4. Create Sample Properties
  console.log("Creating properties...");

  // Property 1: Verified Agent Property
  const prop1Title = "Standard Self-Contain near FUPRE Main Gate";
  const existingProp1 = await prisma.property.findFirst({
    where: { title: prop1Title }
  });

  if (!existingProp1 && agent1.agentProfile) {
    await prisma.property.create({
      data: {
        title: prop1Title,
        hostelType: "Self-Contain",
        price: 150000,
        location: "FUPRE Road, Effurun",
        distance: "5 mins walk to campus",
        description: "A neat and well-maintained self-contained apartment located just 5 minutes walk from the FUPRE main gate. Perfect for single students who desire proximity to lectures, featuring a serene study environment, strong security, and constant water supply.",
        amenities: ["Bed included", "Private Bathroom", "Prepaid Meter", "Borehole Water"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        isAvailable: true,
        isVerified: true,
        university: "FUPRE",
        agentId: agent1.agentProfile.id
      }
    });
  }

  // Property 2: Unverified Agent Property
  const prop2Title = "Luxury 1-Bedroom Flat near PTI Gate";
  const existingProp2 = await prisma.property.findFirst({
    where: { title: prop2Title }
  });

  if (!existingProp2 && agent2.agentProfile) {
    await prisma.property.create({
      data: {
        title: prop2Title,
        hostelType: "1-Bedroom Flat",
        price: 220000,
        location: "PTI Road Junction",
        distance: "8 mins walk to campus",
        description: "Luxury 1-bedroom flat built recently. Features security fencing, running water, and backup generator spaces. Unverified listing waiting for admin review.",
        amenities: ["Private Bathroom", "Prepaid Meter", "Borehole Water", "Gated Compound"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        isAvailable: true,
        isVerified: false,
        university: "PTI",
        agentId: agent2.agentProfile.id
      }
    });
  }

  // Property 3: Student Roommate Listing (Verified)
  const prop3Title = "Shared Room in Fenced Compound near FUPRE";
  const existingProp3 = await prisma.property.findFirst({
    where: { title: prop3Title }
  });

  if (!existingProp3 && student1.studentProfile) {
    await prisma.property.create({
      data: {
        title: prop3Title,
        hostelType: "Shared Hostel Room",
        price: 80000,
        location: "Ugbomro Community, near FUPRE",
        distance: "10 mins walk to campus",
        description: "I am looking for a neat roommate to split a standard double-room with. Water and prepaid electricity meters are ready. Looking for someone friendly.",
        amenities: ["Bed included", "Borehole Water", "Prepaid Meter"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"],
        isAvailable: true,
        isVerified: true,
        isRoommateOption: true,
        university: "FUPRE",
        studentId: student1.studentProfile.id
      }
    });
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
