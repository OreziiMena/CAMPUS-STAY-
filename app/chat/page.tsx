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
import "./chat.css";

interface ChatRoom {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  targetName: string;
  targetRoleLabel: string;
  lastMessage: string;
  lastMessageAt: Date | string;
}

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  text: string;
  createdAt: Date | string;
}

function ChatContent() {
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
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

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
        // Adjust the container height to fit the visible area between navbar (80px) and keyboard top
        chatContainer.style.height = `${viewport.height - 80}px`;
        
        // Offset for top panning (keep navbar at the top of the viewport)
        if (viewport.offsetTop > 0) {
          chatContainer.style.top = `${80 - viewport.offsetTop}px`;
        } else {
          chatContainer.style.top = "80px";
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
      }
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
            alert(createRes.error || "Failed to initialize conversation.");
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

  // Real-Time Listener (WebSockets - Pusher) for ALL rooms
  useEffect(() => {
    if (!pusherClient || !isPusherClientConfigured || rooms.length === 0) return;

    const subscriptions = rooms.map((room) => {
      const channelName = `chat-${room.id}`;
      const channel = pusherClient!.subscribe(channelName);

      channel.bind("new-message", (data: any) => {
        // 1. If this message is for the currently selected room, append to messages state
        if (room.id === selectedRoomId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;
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
        pusherClient!.unsubscribe(`chat-${sub.roomId}`);
      });
    };
  }, [rooms, selectedRoomId]);

  // Periodically refresh the entire conversation list to ensure sidebar is updated globally
  useEffect(() => {
    const pollRoomsInterval = setInterval(async () => {
      const res = await getChatRooms();
      if (res.success && res.chatRooms) {
        setRooms((prevRooms) => {
          // Compare to avoid unnecessary re-renders/scroll resets
          const hasChanges = prevRooms.length !== res.chatRooms.length ||
            prevRooms.some((r, i) => r.lastMessage !== res.chatRooms[i]?.lastMessage);
          if (hasChanges) {
            return res.chatRooms;
          }
          return prevRooms;
        });
      }
    }, 5000);

    return () => clearInterval(pollRoomsInterval);
  }, []);

  // Real-Time Fallback (Polling) for messages if Pusher credentials are not provided
  useEffect(() => {
    if (!selectedRoomId || isPusherClientConfigured) return;

    const pollInterval = setInterval(async () => {
      const res = await getChatMessages(selectedRoomId);
      if (res.success && res.messages) {
        setMessages((prev) => {
          if (
            prev.length !== res.messages.length ||
            prev[prev.length - 1]?.id !== res.messages[res.messages.length - 1]?.id
          ) {
            // Also trigger a re-fetch of rooms list to update the sidebar previews
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
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [selectedRoomId]);

  // Auto scroll to message bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputFocus = () => {
    // Reset body scrolls immediately to override mobile safari automatic zoom/pan offsets
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }, 40);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    // Maintain keyboard focus and clear input box immediately
    inputRef.current?.focus();

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      chatRoomId: selectedRoomId,
      senderId: currentUserId,
      text: textToSend,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI updates
    setMessages((prev) => [...prev, optimisticMsg]);

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoomId
          ? { ...room, lastMessage: textToSend, lastMessageAt: new Date().toISOString() }
          : room
      )
    );

    // Send payload asynchronously in background
    setIsSending(true);
    sendChatMessage(selectedRoomId, textToSend).then((res) => {
      if (res.success && res.message) {
        const msg = res.message;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  id: msg.id,
                  chatRoomId: msg.chatRoomId,
                  senderId: msg.senderId,
                  text: msg.text,
                  createdAt: msg.createdAt.toISOString(),
                }
              : m
          )
        );
      } else {
        // Rollback optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert(res.error || "Failed to send message.");
      }
      setIsSending(false);
    });
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
              <div style={{ textAlign: "center", padding: "40px 10px", color: "#888", fontSize: "14px" }}>
                No active conversations yet.
              </div>
            ) : (
              rooms.map((room) => (
                <div 
                  key={room.id}
                  className={`conversation-item ${room.id === selectedRoomId ? "active" : ""}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <img src={room.propertyImage} alt="property thumbnail" className="conversation-img" />
                  <div className="conversation-details">
                    <h4>{room.targetName}</h4>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => setSelectedRoomId(null)} className="chat-back-btn">
                        <i className="fas fa-arrow-left"></i>
                      </button>
                      <div className="header-info">
                        <h3>{selectedRoom.targetName}</h3>
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
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onFocus={handleInputFocus}
                  disabled={loadingMessages}
                />
                <button 
                  type="submit" 
                  className="send-message-btn"
                  disabled={!inputText.trim() || loadingMessages}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
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
      <div className="chat-loader" style={{ height: "100vh" }}>
        <i className="fas fa-spinner fa-spin"></i> Loading chat workspace...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
