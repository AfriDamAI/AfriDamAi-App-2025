"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, PlusCircle, Search, MoreVertical, Paperclip, Smile, Phone, Video } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import {
  initiateChat,
  getCurrentUserChats,
  getChatById,
  getChatMessages,
  sendUserChatMessage,
  markMessageAsRead,
} from "@/lib/api-client";
import { Chat, Message } from "@/lib/types";

export const SpecialistChat = () => {
  const { user } = useAuth();
  const CURRENT_USER_ID = user?.id || "";
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUserChats();
    // Start polling for new chats every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchUserChats();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Auto-select the first chat if available after fetching
  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]); // Added selectedChat to dependencies to prevent re-selection if a chat is manually selected

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat.id);
      // Poll for new messages every 2 seconds when a chat is selected
      const messagePolling = setInterval(() => {
        fetchChatMessages(selectedChat.id);
      }, 2000);

      return () => clearInterval(messagePolling);
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
      // Mark unread messages from other participant as read
      chatMessages.forEach(async (msg) => {
        if (msg.senderId !== CURRENT_USER_ID && !msg.read) {
          await markMessageAsRead(msg.id);
        }
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages.");
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const messageToSend = inputMessage;
    setInputMessage(""); // Clear input immediately for better UX

    try {
      const newMessage = await sendUserChatMessage(
        selectedChat.id,
        CURRENT_USER_ID,
        messageToSend
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Refresh chat list to update last message
      fetchUserChats();
    } catch (err) {
      setError("Failed to send message.");
      console.error("Error sending message:", err);
      setInputMessage(messageToSend); // Restore message on error
    }
  };

  const handleNewChat = async (specialistId: string) => {
    try {
      const newChat = await initiateChat(CURRENT_USER_ID, specialistId);
      setChats((prevChats) => [...prevChats, newChat]);
      setSelectedChat(newChat);
      fetchUserChats();
    } catch (err) {
      setError("Failed to start new chat.");
      console.error("Error starting new chat:", err);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}>
      {/* Left Sidebar: Chat List */}
      <div className={`w-80 flex flex-col ${isDark ? 'bg-[#151312] border-r border-white/5' : 'bg-white border-r border-gray-200'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <button
              onClick={() => handleNewChat("specialist456")}
              className="p-2 rounded-full hover:bg-[#4DB6AC]/10 text-[#4DB6AC] transition-all"
              title="New Chat"
            >
              <PlusCircle size={22} />
            </button>
          </div>
          {/* Search Bar */}
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

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <p className="p-6 text-center text-gray-500">Loading chats...</p>}
          {error && <p className="p-6 text-center text-red-500">{error}</p>}
          {!isLoading && chats.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Start a new chat to begin</p>
            </div>
          )}
          {chats.map((chat) => {
            const otherUserId = chat.participant1Id === CURRENT_USER_ID ? chat.participant2Id : chat.participant1Id;
            const isActive = selectedChat?.id === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-4 w-full text-left transition-all ${
                  isActive 
                    ? (isDark ? 'bg-[#4DB6AC]/10 border-l-4 border-[#4DB6AC]' : 'bg-[#4DB6AC]/5 border-l-4 border-[#4DB6AC]')
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {otherUserId[0].toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#151312] rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold text-sm truncate ${isActive ? 'text-[#4DB6AC]' : ''}`}>
                      {otherUserId}
                    </p>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400">2m</span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage.message}
                    </p>
                  )}
                </div>
                {chat.lastMessage && chat.lastMessage.senderId !== CURRENT_USER_ID && !chat.lastMessage.read && (
                  <span className="w-5 h-5 bg-[#E1784F] text-white text-xs rounded-full flex items-center justify-center font-semibold">1</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white font-semibold shadow-md">
                    {(selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id)[0].toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#151312] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-base">
                    {selectedChat.participant1Id === CURRENT_USER_ID ? selectedChat.participant2Id : selectedChat.participant1Id}
                  </h3>
                  <p className="text-xs text-green-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <Phone size={20} className="text-[#4DB6AC]" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <Video size={20} className="text-[#4DB6AC]" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                    <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === CURRENT_USER_ID;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                  
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn && (
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white text-xs font-semibold shrink-0 ${
                          showAvatar ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {msg.senderId[0].toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-[65%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isOwn
                            ? 'bg-[#4DB6AC] text-white rounded-br-md'
                            : (isDark ? 'bg-[#1F1E1D] text-gray-200 rounded-bl-md' : 'bg-white text-gray-800 rounded-bl-md border border-gray-200')
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">12:34 PM</span>
                      </div>
                      {isOwn && (
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white text-xs font-semibold shrink-0 ${
                          showAvatar ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {msg.senderId[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              isDark ? 'bg-[#151312] border-white/5' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-end gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all mb-1">
                  <Paperclip size={20} className="text-gray-500" />
                </button>
                <div className={`flex-1 rounded-2xl border overflow-hidden ${
                  isDark ? 'bg-[#1F1E1D] border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-transparent outline-none resize-none text-sm"
                  />
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all mb-1">
                  <Smile size={20} className="text-gray-500" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-[#4DB6AC] text-white rounded-full hover:bg-[#4DB6AC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-1 shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={80} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
              <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
              <p className="text-gray-500 dark:text-gray-400">Select a conversation from the left or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};