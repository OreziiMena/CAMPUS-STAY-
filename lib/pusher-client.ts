import Pusher from "pusher-js";

const PusherClient = (Pusher as any).default || Pusher;

export const isPusherClientConfigured = !!(
  process.env.NEXT_PUBLIC_PUSHER_KEY &&
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

export const pusherClient = (typeof window !== "undefined" && isPusherClientConfigured)
  ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      forceTLS: true,
    })
  : null;
