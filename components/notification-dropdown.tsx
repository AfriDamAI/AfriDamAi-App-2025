"use client"

import { Bell, Check, Clock, X, Trash2, ShieldCheck, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // 🛡️ SYNC LOGIC: Ready for API handshake
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // TODO: fetch logic
            } catch (error) {
                console.error("Failed to sync notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // 🛡️ RE-ENFORCED: Safe scroll locking
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset'; // Emergency cleanup
        };
    }, [isOpen]);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-[#E1784F]/10 rounded-2xl transition-all active:scale-95"
            >
                <Bell className={`w-6 h-6 transition-colors ${unreadCount > 0 ? 'text-[#E1784F]' : 'text-muted-foreground'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-[#E1784F] text-white text-[10px] font-black rounded-full border-2 border-background flex items-center justify-center">
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
                            className="fixed md:absolute right-4 left-4 md:left-auto md:right-0 mt-4 md:w-96 bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden z-50"
                        >
                            
                            {/* 🧬 HEADER: BOLD CLINICAL STYLE */}
                            <div className="px-8 py-6 border-b border-border bg-muted/20">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Clinical Activity</h3>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Protocol & System Updates</p>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="max-h-[60vh] md:max-h-[420px] overflow-y-auto no-scrollbar bg-card">
                                {notifications.length === 0 ? (
                                    <div className="py-20 px-10 text-center space-y-5">
                                        <div className="w-20 h-20 bg-muted/50 rounded-[1.8rem] flex items-center justify-center mx-auto border border-border">
                                            <ShieldCheck className="w-10 h-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <h4 className="text-foreground font-black italic uppercase tracking-tighter text-lg">Systems Quiet</h4>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 leading-relaxed">
                                                No active dermal alerts or clinical reminders at this time.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`px-8 py-6 transition-all hover:bg-muted/30 cursor-pointer ${!n.read ? 'bg-[#E1784F]/5' : 'bg-transparent'}`}
                                                onClick={() => markAsRead(n.id)}
                                            >
                                                <div className="flex gap-5">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-xl shadow-sm">
                                                        {n.icon || <Zap size={18} className="text-[#E1784F]" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className={`text-[11px] font-black uppercase tracking-tight italic truncate ${!n.read ? 'text-[#E1784F]' : 'text-muted-foreground'}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.read && <span className="w-2 h-2 bg-[#E1784F] rounded-full mt-1.5 animate-pulse" />}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-4">
                                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                                <Clock size={10} /> {n.time}
                                                            </span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                                className="p-1.5 text-muted-foreground/30 hover:text-red-500 transition-colors"
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

                            {/* FOOTER */}
                            {notifications.length > 0 && (
                                <div className="p-6 bg-muted/20 border-t border-border">
                                    <button 
                                        onClick={markAllAsRead}
                                        className="w-full py-4 bg-background border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:border-[#E1784F] hover:text-[#E1784F] transition-all"
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