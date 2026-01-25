"use client"

import { Bell, Check, Clock, X, Trash2, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from "@/lib/api-client"
import { useAuth } from "@/providers/auth-provider"

/**
 * 🛡️ AFRIDAM NOTIFICATION HUB (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Real-time Handshake & Mobile-First Alert Drawer.
 */

type NotificationType = 'routine' | 'product' | 'reminder' | 'achievement';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon?: string;
}

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    /** 🚀 THE NOTIFICATION HANDSHAKE */
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                // 🛡️ SYNC: Fetching from NestJS Notification Controller
                const response = await apiClient.get(`/notifications/user/${user.id}`);
                const data = response.data?.resultData || response.data || [];
                setNotifications(data);
            } catch (error) {
                console.log("Notification sync pending...");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchNotifications();
    }, [isOpen, user?.id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Lock background on mobile
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const markAsRead = async (id: string) => {
        try {
            setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
            // 🚀 PERSISTENCE HANDSHAKE
            await apiClient.patch(`/notifications/${id}/read`);
        } catch (err) {
            console.log("Read status update delayed");
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            await apiClient.patch(`/notifications/user/${user?.id}/read-all`);
        } catch (err) {
            console.log("Global read status pending...");
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            setNotifications(prev => prev.filter(n => n.id !== id));
            await apiClient.delete(`/notifications/${id}`);
        } catch (err) {
            console.log("Deletion pending sync");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-[#E1784F]/10 rounded-2xl transition-all active:scale-95"
            >
                <Bell className={`w-6 h-6 transition-colors ${unreadCount > 0 ? 'text-[#E1784F]' : 'text-gray-400'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-[#E1784F] text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#050505] flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" 
                            onClick={() => setIsOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed md:absolute right-4 left-4 md:left-auto md:right-0 mt-4 md:w-96 bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden z-50 text-left"
                        >
                            
                            {/* HEADER */}
                            <div className="px-8 py-6 border-b border-black/5 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-black dark:text-white leading-none">Activity Hub</h3>
                                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-1">Care & System Alerts</p>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* CONTENT AREA */}
                            <div className="max-h-[60vh] md:max-h-[420px] overflow-y-auto no-scrollbar">
                                {loading && notifications.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="animate-spin text-[#E1784F]" size={24} />
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Syncing Alerts</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="py-20 px-10 text-center space-y-5">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[1.8rem] flex items-center justify-center mx-auto border border-black/5 dark:border-white/5">
                                            <ShieldCheck className="w-10 h-10 opacity-20" />
                                        </div>
                                        <div>
                                            <h4 className="text-black dark:text-white font-black italic uppercase tracking-tighter text-lg">Systems Quiet</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">
                                                No active dermal alerts or specialist reminders at this time.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-black/5 dark:divide-white/5">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`px-8 py-6 transition-all hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-[#E1784F]/5' : 'bg-transparent'}`}
                                                onClick={() => markAsRead(n.id)}
                                            >
                                                <div className="flex gap-5">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-xl">
                                                        {n.icon || <Zap size={18} className="text-[#E1784F]" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className={`text-[11px] font-black uppercase tracking-tight italic truncate ${!n.read ? 'text-[#E1784F]' : 'opacity-40'}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.read && <span className="w-2 h-2 bg-[#E1784F] rounded-full mt-1.5 animate-pulse" />}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-4">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                <Clock size={10} /> {n.time}
                                                            </span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                                className="p-1.5 opacity-20 hover:opacity-100 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* FOOTER ACTION */}
                            {notifications.length > 0 && (
                                <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-black/5 dark:border-white/10">
                                    <button 
                                        onClick={markAllAsRead}
                                        className="w-full py-4 bg-white dark:bg-black border border-black/5 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#E1784F] transition-all"
                                    >
                                        Dismiss All
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default NotificationDropdown;