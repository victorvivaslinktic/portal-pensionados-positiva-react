"use client";

import { useEffect, useRef } from "react";
import { toast as sonnerToast } from "sonner";
import { useToastStore } from "@/lib/stores/toast-store";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();
  const processedToasts = useRef(new Set<string>());

  useEffect(() => {
    toasts.forEach((toast) => {
      const toastId = toast.id;

      if (!processedToasts.current.has(toastId)) {
        processedToasts.current.add(toastId);

        switch (toast.type) {
          case "success":
            sonnerToast.success(toast.title, {
              description: toast.description,
              duration: toast.duration,
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-success",
              action: {
                label: "✕",
                onClick: () => {
                  removeToast(toastId);
                  processedToasts.current.delete(toastId);
                },
              },
            });
            break;
          case "error":
            sonnerToast.error(toast.title, {
              description: toast.description,
              duration: toast.duration,
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-error",
              action: {
                label: "✕",
                onClick: () => {
                  removeToast(toastId);
                  processedToasts.current.delete(toastId);
                },
              },
            });
            break;
          case "warning":
            sonnerToast.warning(toast.title, {
              description: toast.description,
              duration: toast.duration,
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-warning",
              action: {
                label: "✕",
                onClick: () => {
                  removeToast(toastId);
                  processedToasts.current.delete(toastId);
                },
              },
            });
            break;
          case "info":
            sonnerToast.info(toast.title, {
              description: toast.description,
              duration: toast.duration,
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-info",
              action: {
                label: "✕",
                onClick: () => {
                  removeToast(toastId);
                  processedToasts.current.delete(toastId);
                },
              },
            });
            break;
        }
      }
    });
  }, [toasts, removeToast]);

  return null;
}
