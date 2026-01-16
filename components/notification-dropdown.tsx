"use client"

import { Bell, Check, Clock, X, Trash2, ShieldCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

// 🛡️ TYPE DEFINITION (Matches Backend Entity)
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
    // 🛡️ FIXED: Starting with an empty array to remove hardcoded placeholders
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // 🛡️ SYNC LOGIC: This is where we will fetch real data from your API
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // TODO: const response = await api.get('/notifications/me');
                // setNotifications(response.data);
            } catch (error) {
                console.error("Failed to sync notifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
        // TODO: api.patch(`/notifications/${id}/read`);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        // TODO: api.patch('/notifications/read-all');
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        // TODO: api.delete(`/notifications/${id}`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            {isOpen && (
                <div className="fixed md:absolute right-4 left-4 md:left-auto md:right-0 mt-3 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-rose-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {/* Header */}
                    <div className="bg-white px-7 py-6 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Activity</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Stay updated with your skincare journey</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full md:hidden">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto overscroll-contain bg-white">
                        {notifications.length === 0 ? (
                            <div className="py-20 px-8 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <ShieldCheck className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-slate-900 font-bold text-lg">Secure & Quiet</h4>
                                <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto">
                                    When we have updates on your skin analysis or routines, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`px-7 py-6 transition-colors cursor-pointer ${!n.read ? 'bg-rose-50/10' : 'bg-white'}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                                                {n.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className={`text-sm font-bold truncate ${!n.read ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.read && <span className="w-2 h-2 bg-rose-500 rounded-full mt-1.5" />}
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" /> {n.time}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {notifications.length > 0 && (
                        <div className="p-5 bg-slate-50/30 border-t border-slate-50 flex gap-3">
                            <button 
                                onClick={markAllAsRead}
                                className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-rose-200 hover:text-rose-500 transition-all"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;