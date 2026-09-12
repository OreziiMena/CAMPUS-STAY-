import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pusher sends application/x-www-form-urlencoded
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return NextResponse.json({ error: "Missing socket_id or channel_name" }, { status: 400 });
    }

    // Ensure authorized access to private chat channels
    if (channelName.startsWith("private-chat-")) {
      const roomId = channelName.replace("private-chat-", "");
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        select: { studentId: true, agentId: true },
      });

      if (!chatRoom) {
        return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
      }

      // Only room participants or admins can subscribe
      const isParticipant = chatRoom.studentId === user.id || chatRoom.agentId === user.id;
      const isAdmin = user.role === "ADMIN";

      if (!isParticipant && !isAdmin) {
        return NextResponse.json({ error: "Forbidden. You are not a participant in this conversation." }, { status: 403 });
      }
    }

    if (!pusherServer) {
      return NextResponse.json({ error: "Pusher is not configured on the server." }, { status: 503 });
    }

    const authData = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authData);
  } catch (err: any) {
    console.error("Pusher channel authorization error:", err);
    return NextResponse.json({ error: "Internal authorization error." }, { status: 500 });
  }
}
