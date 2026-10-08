"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  getChatRooms, 
  getChatMessages, 
  sendChatMessage, 
  getOrCreateChatRoom 
} from "@/app/actions/chat";
import { pusherClient, isPusherClientConfigured } from "@/lib/pusher-client";
import ChatInput from "@/components/ChatInput";
import "./chat.css";
import { useToast } from "@/components/ToastProvider";

interface ChatRoom {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  targetName: string;
  targetRoleLabel: string;
  targetRole?: "AGENT" | "STUDENT";
  targetAvatarText?: string;
  lastMessage: string;
  lastMessageAt: Date | string;
  targetVerified?: boolean;
}

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  text: string;
  createdAt: Date | string;
}

function ChatContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initPropertyId = searchParams.get("propertyId");
  const initRoomId = searchParams.get("roomId");

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  // Keep ref to selectedRoomId so Pusher callbacks have access without resubscribing
  const selectedRoomIdRef = useRef<string | null>(selectedRoomId);
  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 120000); // 2 minutes
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    resetIdleTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  // Lock body and html scrolling on mount to make headers sticky
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  // Keep navbar visible and resize chat-container to match visual viewport (prevent keyboard panning)
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;

      const chatContainer = document.querySelector(".chat-container") as HTMLElement;
      if (chatContainer) {
        // Dynamically compute navbar height (70px on mobile/tablet <=1024px, 80px on desktop)
        const navHeight = window.innerWidth <= 1024 ? 70 : 80;
        const availableHeight = viewport.height - navHeight;
        
        chatContainer.style.setProperty("--chat-container-height", `${availableHeight}px`);
        chatContainer.style.height = `${availableHeight}px`;
        
        // Offset for top panning (keep navbar at the top of the viewport)
        if (viewport.offsetTop > 0) {
          chatContainer.style.top = `${navHeight - viewport.offsetTop}px`;
        } else {
          chatContainer.style.top = `${navHeight}px`;
        }
      }
      
      // Force page scroll offset back to 0 to keep fixed navbar visible
      window.scrollTo(0, 0);
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
      
      // Reset styles on unmount
      const chatContainer = document.querySelector(".chat-container") as HTMLElement;
      if (chatContainer) {
        chatContainer.style.height = "";
        chatContainer.style.top = "";
        chatContainer.style.removeProperty("--chat-container-height");
      }
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load rooms and handle initial property conversation trigger
  useEffect(() => {
    const initializeChat = async () => {
      setLoadingRooms(true);
      
      // Fetch conversations list
      const roomsRes = await getChatRooms();
      if (roomsRes.success && roomsRes.chatRooms) {
        setRooms(roomsRes.chatRooms);
        setCurrentUserId(roomsRes.currentUserId || "");
        
        //If a specific property chat was initiated
        if (initPropertyId) {
          const createRes = await getOrCreateChatRoom(initPropertyId);
          if (createRes.success && createRes.chatRoomId) {
            const newRoomId = createRes.chatRoomId;
            
            // Refresh list to include newly created room
            const refreshRes = await getChatRooms();
            if (refreshRes.success && refreshRes.chatRooms) {
              setRooms(refreshRes.chatRooms);
            }
            setSelectedRoomId(newRoomId);
            
            // Remove propertyId query param from url cleanly
            router.replace("/chat");
          } else {
            showToast(createRes.error || "Failed to initialize conversation.", "error");
          }
        } else if (initRoomId) {
          //  If a specific chat room was selected directly
          setSelectedRoomId(initRoomId);
          router.replace("/chat");
        } else {
          // Clean slate with no inbox opened on load if no roomId/propertyId query parameters are passed
          setSelectedRoomId(null);
        }
      }
      setLoadingRooms(false);
    };

    initializeChat();
  }, [initPropertyId, initRoomId, router]);

  // Load message history on conversation select
  useEffect(() => {
    if (!selectedRoomId) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      const res = await getChatMessages(selectedRoomId);
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
      setLoadingMessages(false);
    };

    loadMessages();
  }, [selectedRoomId]);

  // Real-Time Listener (WebSockets - Pusher) for ALL rooms with stable subscription lifecycle
  const roomsIdsSignature = rooms.map((r) => r.id).sort().join(",");
  useEffect(() => {
    if (!pusherClient || !isPusherClientConfigured || rooms.length === 0) return;

    const subscriptions = rooms.map((room) => {
      const channelName = `private-chat-${room.id}`;
      const channel = pusherClient!.subscribe(channelName);

      channel.bind("new-message", (data: any) => {
        // 1. If this message is for the currently active room, append or deduplicate
        if (room.id === selectedRoomIdRef.current) {
          setMessages((prev) => {
            // If already present by verified id, ignore
            if (prev.some((m) => m.id === data.id)) return prev;
            
            // Deduplicate optimistic messages (match by text and sender)
            const tempIndex = prev.findIndex(
              (m) => m.id.startsWith("temp-") && m.text === data.text && m.senderId === data.senderId
            );
            if (tempIndex !== -1) {
              return prev.map((m, idx) => (idx === tempIndex ? data : m));
            }
            
            return [...prev, data];
          });
        }
        
        // 2. Refresh the rooms list to update the sidebar last-message preview and sorting order globally
        getChatRooms().then((roomsRes) => {
          if (roomsRes.success && roomsRes.chatRooms) {
            setRooms(roomsRes.chatRooms);
          }
        });
      });

      return { roomId: room.id, channel };
    });

    return () => {
      subscriptions.forEach((sub) => {
        pusherClient!.unsubscribe(`private-chat-${sub.roomId}`);
      });
    };
  }, [roomsIdsSignature]);

  // Periodically refresh the entire conversation list to ensure sidebar is updated globally with adaptive intervals
  useEffect(() => {
    // Dynamic Polling Rate: 5s if active, 15s if idle, 30s if tab is hidden
    const intervalTime = !isTabVisible ? 30000 : isIdle ? 15000 : 5000;

    const pollRoomsInterval = setInterval(async () => {
      const res = await getChatRooms();
      if (res.success && res.chatRooms) {
        setRooms((prevRooms) => {
          const hasChanges = prevRooms.length !== res.chatRooms.length ||
            prevRooms.some((r, i) => r.lastMessage !== res.chatRooms[i]?.lastMessage);
          if (hasChanges) {
            return res.chatRooms;
          }
          return prevRooms;
        });
      }
    }, intervalTime);

    return () => clearInterval(pollRoomsInterval);
  }, [isTabVisible, isIdle]);

  // Real-Time Fallback (Polling) for messages if Pusher credentials are not provided with adaptive intervals
  useEffect(() => {
    if (!selectedRoomId || isPusherClientConfigured) return;

    // Dynamic Polling Rate: 3s if active, 8s if idle, 15s if tab is hidden
    const intervalTime = !isTabVisible ? 15000 : isIdle ? 8000 : 3000;

    const pollInterval = setInterval(async () => {
      const res = await getChatMessages(selectedRoomId);
      if (res.success && res.messages) {
        setMessages((prev) => {
          if (
            prev.length !== res.messages.length ||
            prev[prev.length - 1]?.id !== res.messages[res.messages.length - 1]?.id
          ) {
            getChatRooms().then((roomsRes) => {
              if (roomsRes.success && roomsRes.chatRooms) {
                setRooms(roomsRes.chatRooms);
              }
            });
            return res.messages;
          }
          return prev;
        });
      }
    }, intervalTime);

    return () => clearInterval(pollInterval);
  }, [selectedRoomId, isTabVisible, isIdle]);

  // Auto scroll to message bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!selectedRoomId || !textToSend.trim()) return;

    const trimmed = textToSend.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      chatRoomId: selectedRoomId,
      senderId: currentUserId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic UI updates
    setMessages((prev) => [...prev, optimisticMsg]);

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoomId
          ? { ...room, lastMessage: trimmed, lastMessageAt: new Date().toISOString() }
          : room
      )
    );

    // 2. Send payload to server
    try {
      const res = await sendChatMessage(selectedRoomId, trimmed);
      if (res.success && res.message) {
        const msg = res.message;
        const confirmedMsg: Message = {
          id: msg.id,
          chatRoomId: msg.chatRoomId,
          senderId: msg.senderId,
          text: msg.text,
          createdAt: typeof msg.createdAt === "string" ? msg.createdAt : msg.createdAt.toISOString(),
        };

        setMessages((prev) => {
          // If Pusher already pushed this message by id, ensure tempId is removed
          if (prev.some((m) => m.id === confirmedMsg.id)) {
            return prev.filter((m) => m.id !== tempId);
          }
          // Otherwise replace the tempId
          return prev.map((m) => (m.id === tempId ? confirmedMsg : m));
        });
      } else {
        // Rollback optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        showToast(res.error || "Failed to send message.", "error");
      }
    } catch (err: any) {
      // Rollback optimistic message on network error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showToast("Network error. Please try again.", "error");
    }
  };

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <>
      <Navbar />

      <div className={`chat-container ${selectedRoomId ? "show-chat" : ""}`}>
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="sidebar-search sticky top-0 z-10 bg-white">
            <input type="text" placeholder="Filter conversations..." disabled />
          </div>

          <div className="conversations-list">
            {loadingRooms ? (
              <div className="chat-loader">
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </div>
            ) : rooms.length === 0 ? (
              <div className="no-conversations-msg">
                No active conversations yet.
              </div>
            ) : (
              rooms.map((room) => (
                <div 
                  key={room.id}
                  className={`conversation-item ${room.id === selectedRoomId ? "active" : ""}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className={`conversation-avatar ${room.targetRole === "AGENT" ? "agent-avatar" : "student-avatar"}`}>
                    {room.targetAvatarText || (room.targetName ? room.targetName.replace(/^@/, "")[0]?.toUpperCase() : "U")}
                  </div>
                  <div className="conversation-details">
                    <h4 className="conversation-title-row">
                       {room.targetName}
                       {room.targetVerified && (
                         <i className="fas fa-check-circle verified-icon verified-icon-chat" title="Verified User"></i>
                       )}
                     </h4>
                    <p className="listing-title-sub">{room.propertyTitle}</p>
                    <p className="last-msg">{room.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Conversation Window */}
        <main className="chat-main">
          {!selectedRoomId ? (
            <div className="chat-empty-state">
              <i className="far fa-comments"></i>
              <h3>Select a conversation</h3>
              <p>Choose an active student inquiry from the sidebar panel to start chatting live.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header sticky top-0 z-10 bg-white">
                {selectedRoom && (
                  <>
                    <div className="chat-header-user-info">
                      <button onClick={() => setSelectedRoomId(null)} className="chat-back-btn">
                        <i className="fas fa-arrow-left"></i>
                      </button>
                      <div className={`conversation-avatar ${selectedRoom.targetRole === "AGENT" ? "agent-avatar" : "student-avatar"} chat-header-avatar`}>
                        {selectedRoom.targetAvatarText || (selectedRoom.targetName ? selectedRoom.targetName.replace(/^@/, "")[0]?.toUpperCase() : "U")}
                      </div>
                      <div className="header-info">
                        <h3 className="conversation-title-row">
                          {selectedRoom.targetName}
                          {selectedRoom.targetVerified && (
                            <i className="fas fa-check-circle verified-icon verified-icon-chat-header" title="Verified User"></i>
                          )}
                        </h3>
                        <p>Query: {selectedRoom.propertyTitle}</p>
                      </div>
                    </div>
                    <Link href={`/apartment-details?id=${selectedRoom.propertyId}`} className="property-link-btn">
                      View Listing Details
                    </Link>
                  </>
                )}
              </div>

              {/* Chat Messages */}
              <div className="messages-feed">
                {loadingMessages ? (
                  <div className="chat-loader">
                    <i className="fas fa-spinner fa-spin"></i> Loading messages...
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`message-bubble-wrapper ${msg.senderId === currentUserId ? "sent" : "received"}`}
                      >
                        <div className="message-bubble">
                          {msg.text}
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={loadingMessages}
                placeholder="Type your message here..."
              />
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="chat-loader chat-loader-fullscreen">
        <i className="fas fa-spinner fa-spin"></i> Loading chat workspace...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

