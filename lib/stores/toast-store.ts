import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  lastToastTime: number;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  lastToastTime: 0,
  addToast: (toast) => {
    const now = Date.now();
    const { lastToastTime } = get();

    // Evitar spam: solo permitir un toast cada 500ms
    if (now - lastToastTime < 500) {
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
      lastToastTime: now,
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, newToast.duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "success",
      title,
      description,
      duration,
    });
  },
  error: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "error",
      title,
      description,
      duration,
    });
  },
  warning: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "warning",
      title,
      description,
      duration,
    });
  },
  info: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: "info",
      title,
      description,
      duration,
    });
  },
};
