import { create } from "zustand";
import { ReactNode } from "react";

export interface Modal {
  id: string;
  type: "success" | "error" | "warning" | "info" | "custom";
  title: string;
  description?: string;
  image?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
  className?: string;
  onClose?: () => void;
  actions?: {
    primary?: {
      label: string;
      action: () => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    };
    secondary?: {
      label: string;
      action: () => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    };
  };
}

interface ModalStore {
  modals: Modal[];
  addModal: (modal: Omit<Modal, "id">) => string;
  removeModal: (id: string) => void;
  clearModals: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  addModal: (modal) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: Modal = {
      ...modal,
      id,
      showCloseButton: modal.showCloseButton !== false,
    };

    set((state) => ({
      modals: [...state.modals, newModal],
    }));

    return id;
  },
  removeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),
  clearModals: () => set({ modals: [] }),
}));

export const modal = {
  success: (title: string, description?: string, options?: Partial<Modal>) => {
    return useModalStore.getState().addModal({
      type: "success",
      title,
      description,
      ...options,
    });
  },
  error: (title: string, description?: string, options?: Partial<Modal>) => {
    return useModalStore.getState().addModal({
      type: "error",
      title,
      description,
      ...options,
    });
  },
  warning: (title: string, description?: string, options?: Partial<Modal>) => {
    return useModalStore.getState().addModal({
      type: "warning",
      title,
      description,
      ...options,
    });
  },
  info: (title: string, description?: string, options?: Partial<Modal>) => {
    return useModalStore.getState().addModal({
      type: "info",
      title,
      description,
      ...options,
    });
  },
  custom: (title: string, children?: ReactNode, options?: Partial<Modal>) => {
    return useModalStore.getState().addModal({
      type: "custom",
      title,
      children,
      ...options,
    });
  },
};
