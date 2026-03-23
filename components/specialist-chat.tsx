"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, PlusCircle, Search, MoreVertical, Paperclip, Mic, Video, PanelLeftOpen, PanelLeftClose, ChevronLeft, Phone } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  getCurrentUserChats,
  getChatMessages,
  sendUserChatMessage,
  markMessageAsRead,
  uploadFile,
  getAllSpecialists,
  createMeetForAppointment,
} from "@/lib/api-client";
import { Chat, Message } from "@/lib/types";
import { useSocket } from "@/hooks/use-socket";
import { VoiceRecorder } from "./specialist/live/voice-recorder";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const SpecialistChat = () => {
  const { user } = useAuth();
  const router = useRouter();
  const CURRENT_USER_ID = user?.id || "";

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [isJoiningMeet, setIsJoiningMeet] = useState(false);
  const [currentMeetLink, setCurrentMeetLink] = useState<string | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "https://afridam-backend-prod-107032494605.us-central1.run.app";
  const { socket, listen, emit } = useSocket(socketUrl);

  useEffect(() => {
    fetchUserChats();
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const data = await getAllSpecialists();
      setSpecialists(data);
    } catch (err) {
      console.error("Error fetching specialists:", err);
    }
  };

  const getDisplayName = (id: string) => {
    const specialist = specialists.find(s => s.id === id);
    if (specialist) return `${specialist.firstName} ${specialist.lastName}`;
    return id === CURRENT_USER_ID ? "Me" : id;
  };

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg: Message) => {
        if (msg.type === 'SYSTEM') return;
        if (selectedChat && msg.chatId === selectedChat.id) {
          setMessages(prev => [...prev, msg]);
          markMessageAsRead(msg.id);
        }
        // Update chat list last message
        setChats(prev => prev.map(chat =>
          chat.id === msg.chatId ? { ...chat, lastMessage: msg } : chat
        ));
      };

      socket.on("newMessage", handleNewMessage);

      // Listen for meetingLinkCreated — updates button on both sides in real time
      const handleMeetingLinkCreated = (data: { meetLink: string }) => {
        if (data?.meetLink) {
          setCurrentMeetLink(data.meetLink);
          toast.success('Google Meet is ready! Click "Join Meeting" to enter.');
        }
      };
      socket.on('meetingLinkCreated', handleMeetingLinkCreated);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off('meetingLinkCreated', handleMeetingLinkCreated);
      };
    }
  }, [socket, selectedChat]);

  const fetchUserChats = async () => {
    try {
      const userChats = await getCurrentUserChats();
      setChats(userChats);
      setError(null);
    } catch (err) {
      setError("Failed to fetch chats.");
      console.error("Error fetching chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      const chatMessages = await getChatMessages(chatId);
      // Filter out SYSTEM messages from the UI
      const filteredMessages = chatMessages.filter((msg: any) => msg.type !== 'SYSTEM');
      setMessages(filteredMessages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages.");
    }
  };

  const handleCreateOrJoinMeet = async () => {
    if (!selectedChat) {
      toast.error('Please select a conversation first.');
      return;
    }
    if (!user?.id) {
      toast.error('You must be logged in.');
      return;
    }

    setIsJoiningMeet(true);
    try {
      // Determine the other participant (specialist)
      const otherUserId = selectedChat.participant1Id === user.id
        ? selectedChat.participant2Id
        : selectedChat.participant1Id;

      // createMeetForAppointment: finds the active appointment, re-uses or creates Meet link, broadcasts to both
      const result = await createMeetForAppointment(otherUserId);
      if (result?.meetLink) {
        setCurrentMeetLink(result.meetLink);
        window.open(result.meetLink, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Could not create meeting link. Please ensure the appointment is CONFIRMED.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error creating/joining the meeting.';
      toast.error(msg);
    } finally {
      setIsJoiningMeet(false);
    }
  };

  // Removed automatic selection of first chat on mobile to allow viewing list
  useEffect(() => {
    if (chats.length > 0 && !selectedChat && window.innerWidth > 768) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat.id);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // 🛡️ DURABLE SIGNALING SCAN (Legacy watcher removed, integrated into fetch)
  // This is now redundant but kept as a safety fallback with raw data access should be avoided
  // Removed to avoid duplicate processing.

  // 🔄 SILENT POLLING FALLBACK (Cross-instance sync)
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChat) fetchChatMessages(selectedChat.id);
      fetchUserChats();
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedChat, fetchUserChats, fetchChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string, type: string = 'TEXT', metadata: any = {}) => {
    const msgText = text || inputMessage;
    if (!msgText.trim() && type === 'TEXT') return;
    if (!selectedChat) return;

    setInputMessage("");
    setIsRecording(false);

    try {
      const newMessage = await sendUserChatMessage(
        selectedChat.id,
        CURRENT_USER_ID,
        msgText,
        type,
        metadata.url,
        metadata.mimeType,
        metadata.size,
        metadata.duration
      );
      // Socket will handle adding it to the UI via the 'newMessage' event if it's broad-casted
      // But usually, we add it immediately for responsiveness
      if (!messages.find(m => m.id === newMessage.id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } catch (err) {
      setError("Failed to send message.");
      if (type === 'TEXT') setInputMessage(msgText);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    setIsUploading(true);
    try {
      const { url, mimeType, size } = await uploadFile(file);
      let type: 'IMAGE' | 'VIDEO' | 'AUDIO' = 'IMAGE';
      if (mimeType.startsWith('video/')) type = 'VIDEO';
      if (mimeType.startsWith('audio/')) type = 'AUDIO';

      await handleSendMessage("", type, { url, mimeType, size });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVoiceNote = async (blob: Blob, duration: number) => {
    if (!selectedChat) return;
    setIsUploading(true);
    try {
      const file = new File([blob], "voice-note.webm", { type: 'audio/webm' });
      const { url, mimeType, size } = await uploadFile(file);
      await handleSendMessage("", 'AUDIO', { url, mimeType, size, duration });
    } catch (err) {
      console.error("Voice note upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatMessageTime = (msg: any) => {
    try {
      const dateSource = msg.timestamp || msg.createdAt || msg.created_at || msg.sentAt || msg.sent_at;
      if (!dateSource) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let date = new Date(dateSource);

      // Handle numeric timestamps (e.g., from some APIs or sockets)
      if (isNaN(date.getTime()) && (typeof dateSource === 'number' || !isNaN(Number(dateSource)))) {
        date = new Date(Number(dateSource));
      }

      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // WebRTC calls replaced by Google Meet — handleInitiateCall removed

  const renderMessageContent = (msg: Message) => {
    switch (msg.type) {
      case 'IMAGE':
        return (
          <div className="rounded-lg overflow-hidden border border-white/10 mt-1 max-w-sm">
            <img src={msg.attachmentUrl} alt="Sent image" className="w-full h-auto object-cover max-h-64" />
          </div>
        );
      case 'VIDEO':
        return (
          <div className="rounded-lg overflow-hidden border border-white/10 mt-1 max-w-sm">
            <video src={msg.attachmentUrl} controls className="w-full h-auto" />
          </div>
        );
      case 'AUDIO':
        return (
          <div className="flex items-center gap-3 p-2 bg-black/10 rounded-xl min-w-[200px]">
            <audio src={msg.attachmentUrl} controls className="h-8 w-full" />
          </div>
        );
      case 'MISSED_CALL':
        return (
          <div className="flex items-center gap-2 text-red-500 italic text-xs font-bold py-1">
            <Phone size={14} className="rotate-[135deg]" />
            Missed {msg.message}
          </div>
        );
      default:
        return <div>{msg.message}</div>;
    }
  };

  const toggleListCollapse = () => setIsListCollapsed(!isListCollapsed);

  return (
    <div className={`flex h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] overflow-hidden ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}>

      {/* Left Sidebar: Chat List */}
      <div className={`
        ${selectedChat ? 'hidden md:flex' : 'flex'} 
        ${isListCollapsed ? 'w-24' : 'w-80'} 
        flex-col transition-all duration-300 relative
        ${isDark ? 'bg-[#151312] border-r border-white/5' : 'bg-white border-r border-gray-200'}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            {!isListCollapsed && <h2 className="text-xl font-bold">Messages</h2>}
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push("/specialists-list")}
                className="p-2 rounded-full hover:bg-[#4DB6AC]/10 text-[#4DB6AC]"
              >
                <PlusCircle size={22} />
              </button>
              <button
                onClick={toggleListCollapse}
                className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
              >
                {isListCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
              </button>
            </div>
          </div>
          {!isListCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all ${isDark ? 'bg-white/5 border border-white/10 focus:border-[#4DB6AC]/50' : 'bg-gray-100 border border-gray-200 focus:border-[#4DB6AC]'
                  }`}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-6 text-center text-gray-500">Loading chats...</p>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-40">
              <MessageSquare size={48} className="mb-3" />
              {!isListCollapsed && <p className="text-sm">No conversations yet</p>}
            </div>
          ) : (
            chats.map((chat) => {
              const otherUserId = chat.participant1Id === CURRENT_USER_ID ? chat.participant2Id : chat.participant1Id;
              const isActive = selectedChat?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  title={isListCollapsed ? getDisplayName(otherUserId) : undefined}
                  className={`flex items-center gap-3 p-4 w-full text-left transition-all ${isActive ? 'bg-[#4DB6AC]/10 border-l-4 border-[#4DB6AC]' : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                    } ${isListCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                    {getDisplayName(otherUserId).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  {!isListCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isActive ? 'text-[#4DB6AC]' : ''}`}>
                        {getDisplayName(otherUserId)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage?.type === 'TEXT' ? chat.lastMessage.message : `[${chat.lastMessage?.type || 'No message'}]`}
                      </p>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                {/* Back Button for Mobile */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-[#4DB6AC]"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
                  {getDisplayName(selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{getDisplayName(selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id)}</h3>
                  <p className="text-xs text-green-500 font-medium">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Google Meet Join Button — replaces old WebRTC call buttons */}
                <button
                  onClick={handleCreateOrJoinMeet}
                  disabled={isJoiningMeet}
                  title={currentMeetLink ? 'Join Google Meet session' : 'Create a Google Meet for this session'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 shadow-sm ${
                    currentMeetLink ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Video size={16} />
                  {isJoiningMeet ? 'Opening...' : currentMeetLink ? 'Join Meeting' : 'Create Meeting'}
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}>
              {messages.map((msg, index) => {
                const isOwn = msg.senderId === CURRENT_USER_ID;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isOwn ? 'bg-[#4DB6AC] text-white rounded-br-md shadow-sm' : (isDark ? 'bg-[#1F1E1D] text-gray-200 rounded-bl-md border border-white/5' : 'bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-sm')
                        }`}>
                        {renderMessageContent(msg)}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                        {formatMessageTime(msg)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t pb-24 md:pb-4 ${isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-end gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                {isRecording ? (
                  <VoiceRecorder onSend={handleVoiceNote} onCancel={() => setIsRecording(false)} />
                ) : (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-all mb-1"
                    >
                      <Paperclip size={20} />
                    </button>

                    <div className={`flex-1 rounded-2xl border transition-all ${isDark ? 'bg-[#1F1E1D] border-white/10 focus-within:border-[#4DB6AC]/50' : 'bg-gray-50 border-gray-200 focus-within:border-[#4DB6AC]'}`}>
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder="Type message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent outline-none resize-none text-sm min-h-[44px]"
                      />
                    </div>

                    <button
                      onClick={() => setIsRecording(true)}
                      className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-all mb-1"
                    >
                      <Mic size={20} />
                    </button>

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim()}
                      className="p-3 bg-[#4DB6AC] text-white rounded-2xl hover:bg-[#4DB6AC]/90 disabled:opacity-50 transition-all mb-1 shadow-lg shadow-[#4DB6AC]/20"
                    >
                      <Send size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-30">
            <div className="text-center">
              <MessageSquare size={80} className="mx-auto mb-4 text-[#4DB6AC]" />
              <h3 className="text-xl font-bold uppercase tracking-widest italic">Select Consultation</h3>
              <p className="text-sm mt-2 font-medium">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};