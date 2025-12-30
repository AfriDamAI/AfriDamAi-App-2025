"use client"

import { Bell, Check, Clock, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

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

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'routine',
        title: 'Morning Routine Reminder',
        message: 'Time for your morning skincare routine! Don\'t forget your vitamin C serum.',
        time: '2 min ago',
        read: false,
        icon: '🌅'
    },
    {
        id: '2',
        type: 'product',
        title: 'Product Running Low',
        message: 'Your Hyaluronic Acid serum is running low. Consider reordering soon.',
        time: '1 hour ago',
        read: false,
        icon: '📦'
    },
    {
        id: '3',
        type: 'reminder',
        title: 'Weekly Mask Reminder',
        message: 'It\'s time for your weekly hydrating face mask treatment.',
        time: '3 hours ago',
        read: false,
        icon: '✨'
    },
    {
        id: '4',
        type: 'routine',
        title: 'Evening Routine Coming Up',
        message: 'Don\'t forget your evening skincare routine at 9 PM.',
        time: '5 hours ago',
        read: true,
        icon: '🌙'
    },
    {
        id: '5',
        type: 'achievement',
        title: '7-Day Streak! 🎉',
        message: 'Congratulations! You\'ve maintained your routine for 7 days straight.',
        time: '1 day ago',
        read: true,
        icon: '🏆'
    },
    {
        id: '6',
        type: 'reminder',
        title: 'Sunscreen Application',
        message: 'Remember to reapply your sunscreen if you\'re going outside.',
        time: '2 days ago',
        read: true,
        icon: '☀️'
    }
];
const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

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
        };
    }, [isOpen]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationStyle = (type: NotificationType) => {
        switch (type) {
            case 'routine':
                return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
            case 'product':
                return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200';
            case 'reminder':
                return 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200';
            case 'achievement':
                return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getIconColor = (type: NotificationType) => {
        switch (type) {
            case 'routine':
                return 'text-blue-600';
            case 'product':
                return 'text-amber-600';
            case 'reminder':
                return 'text-purple-600';
            case 'achievement':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };


    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-rose-50 rounded-xl transition-colors duration-200"
            >
                <Bell className="w-6 h-6 text-slate-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-rose-100">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-rose-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-slate-600">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You&apos;re all caught up!'}
                        </p>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 text-rose-300" />
                                </div>
                                <p className="text-slate-600 text-center">No notifications yet</p>
                                <p className="text-sm text-slate-400 text-center mt-1">We&apos;ll notify you about your skincare routines and reminders</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-rose-50">
                                {notifications.map((notification: Notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-6 py-4 hover:bg-rose-50/50 transition-colors duration-150 ${!notification.read ? 'bg-rose-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${getNotificationStyle(notification.type)} border`}>
                                                <span className="text-lg">{notification.icon}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className={`text-sm ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        {notification.time}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-rose-600 hover:text-rose-700 transition-colors"
                                                            >
                                                                Mark read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="p-1 hover:bg-rose-100 rounded transition-colors"
                                                        >
                                                            <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-3 border-t border-rose-100">
                            <button className="w-full text-sm text-rose-600 hover:text-rose-700 transition-colors">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown