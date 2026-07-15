import Pusher from "pusher";

const isPusherConfigured = !!(
  process.env.PUSHER_APP_ID &&
  process.env.NEXT_PUBLIC_PUSHER_KEY &&
  process.env.PUSHER_SECRET &&
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

export const pusherServer = isPusherConfigured
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID || "",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
      secret: process.env.PUSHER_SECRET || "",
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      useTLS: true,
    })
  : null;

export async function triggerPusherEvent(channel: string, event: string, data: any) {
  if (pusherServer) {
    try {
      await pusherServer.trigger(channel, event, data);
      return true;
    } catch (err) {
      console.error("Pusher server event trigger error:", err);
      return false;
    }
  } else {
    console.warn("Pusher server is offline because environment variables are missing.");
    return false;
  }
}
