"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { triggerPusherEvent } from "@/lib/pusher";
import { sendEmail } from "@/lib/email";

export async function getOrCreateChatRoom(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to contact listing owner." };
    }

    if (user.role === "STUDENT" && !user.studentProfile?.isVerified) {
      return { success: false, error: "Verification required. You must verify your student profile to message listing owners." };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: true,
        student: true,
      },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    const recipientUserId = property.agent?.userId || property.student?.userId;
    if (!recipientUserId) {
      return { success: false, error: "Listing owner not found." };
    }

    if (recipientUserId === user.id) {
      return { success: false, error: "You cannot message yourself about your own listing." };
    }

    // Find or create chat room between student initiator and agent recipient for this property
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        studentId: user.id,
        agentId: recipientUserId,
        propertyId: propertyId,
      },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          studentId: user.id,
          agentId: recipientUserId,
          propertyId: propertyId,
        },
      });
    }

    return { success: true, chatRoomId: chatRoom.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initialize conversation." };
  }
}

export async function getChatRooms() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { studentId: user.id },
          { agentId: user.id },
        ],
      },
      include: {
        property: true,
        student: {
          include: {
            studentProfile: true,
          },
        },
        agent: {
          include: {
            agentProfile: true,
            studentProfile: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map chat rooms to include target user name and role helper
    const formattedRooms = chatRooms.map((room) => {
      const isInitiator = room.studentId === user.id;
      
      let targetName = "Campus Stay User";
      let targetRoleLabel = "User";
      let targetVerified = false;

      if (isInitiator) {
        // Recipient is room.agent
        if (room.agent.studentProfile) {
          targetName = room.agent.studentProfile.username 
            ? `@${room.agent.studentProfile.username}` 
            : "Student";
          targetRoleLabel = "Student Partner";
          targetVerified = room.agent.studentProfile.isVerified;
        } else {
          targetName = room.agent.agentProfile?.fullName || "Agent";
          targetRoleLabel = "Agent";
          targetVerified = room.agent.agentProfile?.isVerified || false;
        }
      } else {
        // Recipient is room.student
        targetName = room.student.studentProfile?.username 
          ? `@${room.student.studentProfile.username}` 
          : "Student";
        targetRoleLabel = "Student";
        targetVerified = room.student.studentProfile?.isVerified || false;
      }

      return {
        id: room.id,
        propertyId: room.property.id,
        propertyTitle: room.property.title,
        propertyImage: room.property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3",
        targetName,
        targetRoleLabel,
        targetVerified,
        lastMessage: room.messages?.[0]?.text || "No messages yet",
        lastMessageAt: room.messages?.[0]?.createdAt || room.createdAt,
      };
    });

    return { success: true, chatRooms: formattedRooms, currentUserId: user.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch conversations." };
  }
}

export async function getChatMessages(chatRoomId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      return { success: false, error: "Conversation not found." };
    }

    if (chatRoom.studentId !== user.id && chatRoom.agentId !== user.id) {
      return { success: false, error: "Unauthorized access to this conversation." };
    }

    // Mark messages sent by others in this room as read
    await prisma.message.updateMany({
      where: {
        chatRoomId,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, messages, currentUserId: user.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch messages." };
  }
}

export async function sendChatMessage(chatRoomId: string, text: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    if (!text || text.trim() === "") {
      return { success: false, error: "Message cannot be empty." };
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        property: true,
      },
    });

    if (!chatRoom) {
      return { success: false, error: "Conversation not found." };
    }

    if (chatRoom.studentId !== user.id && chatRoom.agentId !== user.id) {
      return { success: false, error: "Unauthorized to send messages in this conversation." };
    }

    const isFirstMessage = (await prisma.message.count({
      where: { chatRoomId }
    })) === 0;

    const message = await prisma.message.create({
      data: {
        chatRoomId,
        senderId: user.id,
        text: text.trim(),
      },
    });

    // Trigger Pusher real-time broadcast on conversation channel
    await triggerPusherEvent(`chat-${chatRoomId}`, "new-message", {
      id: message.id,
      chatRoomId: message.chatRoomId,
      senderId: message.senderId,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    });

    // If first message in a roommate matching conversation, notify the recipient via email
    if (isFirstMessage) {
      (async () => {
        try {
          if (chatRoom.property.isRoommateOption) {
            const recipientId = chatRoom.studentId === user.id ? chatRoom.agentId : chatRoom.studentId;
            const recipientUser = await prisma.user.findUnique({
              where: { id: recipientId },
              include: { studentProfile: true }
            });

            if (recipientUser) {
              const senderName = user.studentProfile?.fullName || user.email;
              const recipientName = recipientUser.studentProfile?.fullName || "Student";
              const listingTitle = chatRoom.property.title;

              await sendEmail({
                to: recipientUser.email,
                subject: `New Roommate Inquiry on Campus Stay!`,
                html: `
                  <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 16px;">
                    <h2 style="color: rgb(2, 53, 28); font-weight: 700;">New Roommate Interest!</h2>
                    <p>Hello ${recipientName},</p>
                    <p><strong>${senderName}</strong> has sent you a message regarding your roommate listing: <strong>"${listingTitle}"</strong> on Campus Stay.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid rgb(2, 53, 28); border-radius: 4px; margin: 20px 0; font-style: italic;">
                       "${text}"
                    </div>
                    
                    <p>Please log in to your dashboard to reply and coordinate details:</p>
                    <div style="text-align: center; margin: 25px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://campus-stay.vercel.app'}/chat?roomId=${chatRoomId}" style="background-color: rgb(2, 53, 28); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                        Open Chat Room
                      </a>
                    </div>
                    <p style="color: #666; font-size: 0.85rem;">Best regards,<br/>The Campus Stay Team</p>
                  </div>
                `
              });
            }
          }
        } catch (emailErr) {
          console.error("Failed to send roommate notification email:", emailErr);
        }
      })();
    }

    return { success: true, message };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message." };
  }
}

export async function getUnreadMessagesCount() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: true, count: 0 };

    const count = await prisma.message.count({
      where: {
        chatRoom: {
          OR: [
            { studentId: user.id },
            { agentId: user.id },
          ],
        },
        senderId: { not: user.id },
        isRead: false,
      },
    });

    return { success: true, count };
  } catch {
    return { success: false, count: 0 };
  }
}

export async function getOrCreateRoommateChatRoom(recipientUserId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please log in to contact potential roommates." };
    }

    if (user.role === "STUDENT" && !user.studentProfile?.isVerified) {
      return { success: false, error: "Verification required. You must verify your student profile to message potential roommates." };
    }

    if (recipientUserId === user.id) {
      return { success: false, error: "You cannot message yourself." };
    }

    // 1. Locate a roommate hostel listing published by the recipient
    let property = await prisma.property.findFirst({
      where: {
        student: { userId: recipientUserId },
        isRoommateOption: true,
      },
    });

    // 2. If the recipient has no listing, check if the initiator has a roommate listing
    if (!property) {
      property = await prisma.property.findFirst({
        where: {
          student: { userId: user.id },
          isRoommateOption: true,
        },
      });
    }

    // 3. If neither has a listing, link the chat to a fallback system property
    if (!property) {
      property = await prisma.property.findFirst({
        where: { title: "General Roommate Match" },
      });

      if (!property) {
        property = await prisma.property.create({
          data: {
            title: "General Roommate Match",
            hostelType: "Shared Hostel Room",
            price: 0,
            location: "Campus Stay Community",
            distance: "Flexible Proximity",
            description: "A placeholder listing for student-to-student roommate matching chat rooms.",
            amenities: ["Roommate Search"],
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
            isAvailable: true,
            isVerified: true,
          },
        });
      }
    }

    // Find or create ChatRoom
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        studentId: user.id,
        agentId: recipientUserId,
        propertyId: property.id,
      },
    });

    if (!chatRoom) {
      // Try reverse search
      chatRoom = await prisma.chatRoom.findFirst({
        where: {
          studentId: recipientUserId,
          agentId: user.id,
          propertyId: property.id,
        },
      });
    }

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          studentId: user.id,
          agentId: recipientUserId,
          propertyId: property.id,
        },
      });
    }

    return { success: true, chatRoomId: chatRoom.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initialize roommate conversation." };
  }
}
