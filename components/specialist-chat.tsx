"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, User, PlusCircle, Search, MoreVertical, Paperclip, Smile, Phone, Video, Mic, Image as ImageIcon, X, Play, Pause, Download } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  initiateChat,
  getCurrentUserChats,
  getChatById,
  getChatMessages,
  sendUserChatMessage,
  markMessageAsRead,
  uploadFile,
} from "@/lib/api-client";
import { Chat, Message } from "@/lib/types";
import { useSocket } from "@/hooks/use-socket";
import { useCall } from "@/hooks/use-call";
import { environment } from "@/lib/environment";
import { IncomingCall } from "./specialist/live/incoming-call";
import { VoiceRecorder } from "./specialist/live/voice-recorder";
import { CallControls } from "./specialist/live/call-controls";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // Call States
  const [incomingCallData, setIncomingCallData] = useState<{from: string, type: 'voice' | 'video', offer: any, chatId: string} | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const socketUrl = environment.backendUrl.replace("/api", "");
  const { socket, listen, emit } = useSocket(socketUrl);

  const {
    isCalling,
    callType,
    remoteUserId,
    localStream,
    startCall,
    acceptCall,
    endCall,
    cleanup
  } = useCall({
    socket,
    currentUserId: CURRENT_USER_ID,
    onIncomingCall: (from, type, offer, chatId) => {
      setIncomingCallData({ from, type, offer, chatId });
    },
    onRemoteStream: (stream) => {
      setRemoteStream(stream);
    },
    onCallEnded: () => {
      setRemoteStream(null);
      setIncomingCallData(null);
    }
  });

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream && localVideoRef.current && callType === 'video') {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callType]);

  useEffect(() => {
    fetchUserChats();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg: Message) => {
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
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      setMessages(chatMessages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages.");
    }
  };

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

  const handleInitiateCall = (type: 'voice' | 'video') => {
    if (!selectedChat) return;
    const otherUserId = selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id;
    startCall(otherUserId, selectedChat.id, type);
  };

  const handleAcceptCall = () => {
    if (incomingCallData) {
      acceptCall(incomingCallData.from, incomingCallData.chatId, incomingCallData.type, incomingCallData.offer);
      setIncomingCallData(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCallData && socket) {
      socket.emit('call-end', { to: incomingCallData.from, chatId: incomingCallData.chatId });
      setIncomingCallData(null);
    }
  };

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
            <PhoneOff size={14} />
            Missed {msg.message}
          </div>
        );
      default:
        return <div>{msg.message}</div>;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}>
      <AnimatePresence>
        {incomingCallData && (
          <IncomingCall 
            fromName={incomingCallData.from}
            callType={incomingCallData.type}
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar: Chat List */}
      <div className={`w-80 flex flex-col ${isDark ? 'bg-[#151312] border-r border-white/5' : 'bg-white border-r border-gray-200'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <button onClick={() => router.push("/specialists-list")} className="p-2 rounded-full hover:bg-[#4DB6AC]/10 text-[#4DB6AC]">
              <PlusCircle size={22} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all ${
                isDark ? 'bg-white/5 border border-white/10 focus:border-[#4DB6AC]/50' : 'bg-gray-100 border border-gray-200 focus:border-[#4DB6AC]'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-6 text-center text-gray-500">Loading chats...</p>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-40">
              <MessageSquare size={48} className="mb-3" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherUserId = chat.participant1Id === CURRENT_USER_ID ? chat.participant2Id : chat.participant1Id;
              const isActive = selectedChat?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-4 w-full text-left transition-all ${
                    isActive ? 'bg-[#4DB6AC]/10 border-l-4 border-[#4DB6AC]' : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold">
                    {otherUserId[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isActive ? 'text-[#4DB6AC]' : ''}`}>{otherUserId}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.lastMessage?.type === 'TEXT' ? chat.lastMessage.message : `[${chat.lastMessage?.type || 'No message'}]`}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Call Overlay */}
            <AnimatePresence>
              {isCalling && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[150] bg-black flex flex-col items-center justify-center"
                >
                  {callType === 'video' ? (
                    <>
                      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute top-6 right-6 w-32 h-48 rounded-2xl border-2 border-white/20 overflow-hidden bg-gray-900 shadow-2xl">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-32 h-32 rounded-full bg-[#4DB6AC] flex items-center justify-center text-white text-4xl font-bold animate-pulse shadow-2xl shadow-[#4DB6AC]/20">
                        {remoteUserId?.[0].toUpperCase()}
                      </div>
                      <h2 className="text-2xl font-bold text-white">{remoteUserId}</h2>
                      <p className="text-[#4DB6AC] uppercase tracking-[0.4em] text-[10px] font-black">In Voice Call...</p>
                    </div>
                  )}
                  
                  <div className="absolute bottom-12">
                    <CallControls 
                      isMuted={false}
                      isVideoOff={callType === 'voice'}
                      onToggleMic={() => {}}
                      onToggleVideo={() => {}}
                      onHangUp={() => {
                         const otherId = selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id;
                         endCall(otherId, selectedChat.id);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold shadow-md">
                  {(selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id}</h3>
                  <p className="text-xs text-green-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleInitiateCall('voice')} className="p-2 rounded-full hover:bg-[#4DB6AC]/10 text-[#4DB6AC] transition-all">
                  <Phone size={20} />
                </button>
                <button onClick={() => handleInitiateCall('video')} className="p-2 rounded-full hover:bg-[#4DB6AC]/10 text-[#4DB6AC] transition-all">
                  <Video size={20} />
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
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isOwn ? 'bg-[#4DB6AC] text-white rounded-br-md' : (isDark ? 'bg-[#1F1E1D] text-gray-200 rounded-bl-md border border-white/5' : 'bg-white text-gray-800 rounded-bl-md border border-gray-200')
                      }`}>
                        {renderMessageContent(msg)}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'}`}>
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
                      {isUploading ? <Loader2 size={20} className="animate-spin text-[#4DB6AC]" /> : <Paperclip size={20} />}
                    </button>
                    
                    <div className={`flex-1 rounded-2xl border transition-all ${isDark ? 'bg-[#1F1E1D] border-white/10 focus-within:border-[#4DB6AC]/50' : 'bg-gray-50 border-gray-200 focus-within:border-[#4DB6AC]'}`}>
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                        placeholder="Type message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent outline-none resize-none text-sm"
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
              <MessageSquare size={80} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Select Consultation</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};