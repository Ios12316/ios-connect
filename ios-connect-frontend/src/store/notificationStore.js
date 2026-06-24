import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    set((state) => ({
      notifications: [...state.notifications, { id, message, type, duration }],
    }));

    // Auto-remove alert after timeout duration
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// Export a drop-in replacement helper for legacy toast imports
export const toast = {
  success: (message, duration = 4000) => 
    useNotificationStore.getState().addNotification(message, "success", duration),
  error: (message, duration = 4000) => 
    useNotificationStore.getState().addNotification(message, "error", duration),
  info: (message, duration = 4000) => 
    useNotificationStore.getState().addNotification(message, "info", duration),
  warning: (message, duration = 4000) => 
    useNotificationStore.getState().addNotification(message, "warning", duration),
};
