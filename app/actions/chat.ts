"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { triggerPusherEvent } from "@/lib/pusher";

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
      const targetUser = isInitiator ? room.agent : room.student;
      
      let targetName = "Campus Stay User";
      let targetRoleLabel = "User";

      if (isInitiator) {
        // Agent side
        targetName = room.agent.agentProfile?.fullName || room.agent.studentProfile?.fullName || "Agent";
        targetRoleLabel = room.agent.agentProfile ? "Agent" : "Student Partner";
      } else {
        // Student side
        targetName = room.student.studentProfile?.username 
          ? `@${room.student.studentProfile.username}` 
          : "Student";
        targetRoleLabel = "Student";
      }

      return {
        id: room.id,
        propertyId: room.property.id,
        propertyTitle: room.property.title,
        propertyImage: room.property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3",
        targetName,
        targetRoleLabel,
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
