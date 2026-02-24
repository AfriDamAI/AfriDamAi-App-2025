import { create } from "zustand";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { SocketData } from "@/hooks/use-socket"; // Import SocketData

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
  initializeSocketListeners: (listen: (event: string, callback: (data: SocketData) => void) => void) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<Notification[]>("/notifications/me");
      const notifications = response.data;
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch notifications";
      set({ error: errorMessage, loading: false });
      toast.error("Notifications Error", { description: errorMessage });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        const newUnreadCount = updatedNotifications.filter((n) => !n.read).length;
        return { notifications: updatedNotifications, unreadCount: newUnreadCount };
      });
      toast.success("Notification marked as read");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark notification as read";
      set({ error: errorMessage });
      toast.error("Notifications Error", { description: errorMessage });
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.patch("/notifications/mark-all-read");
      set((state) => {
        const updatedNotifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
        return { notifications: updatedNotifications, unreadCount: 0 };
      });
      toast.success("All notifications marked as read");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark all notifications as read";
      set({ error: errorMessage });
      toast.error("Notifications Error", { description: errorMessage });
    }
  },

  clearError: () => set({ error: null }),

  initializeSocketListeners: (listen) => {
    listen("newNotification", (data) => {
        // console.log("New notification received via socket:", data);
        get().fetchNotifications(); // Re-fetch all notifications to update state
        toast.info("New Notification", { description: data.content });
    });
  },
}));