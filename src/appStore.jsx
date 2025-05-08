import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store with state and actions
let appStore = (set) => ({
  // Sidebar state
  dopen: true,
  UpdateOpen: (dopen) => set({ dopen }),

  // Theme state
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // UI state
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Notification state
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), ...notification },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
});

// Add persistence to store
appStore = persist(appStore, {
  name: "app-storage",
  partialize: (state) => ({
    dopen: state.dopen,
    darkMode: state.darkMode,
  }),
});

// Create and export the store
export const useAppStore = create(appStore);
