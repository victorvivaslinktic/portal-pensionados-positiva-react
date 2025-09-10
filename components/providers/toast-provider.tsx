"use client";

import { useEffect, useRef } from "react";
import { toast as sonnerToast } from "sonner";
import { useToastStore } from "@/lib/stores/toast-store";
import Image from "next/image";

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
              icon: (
                <Image
                  src="/success-icon.svg"
                  width={22}
                  height={22}
                  alt="icono custom"
                  className="iconPosition"
                />
              ),
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-success toatsStyle",
              action: {
                label: (
                  <Image
                    src="/equis.svg"
                    width={18}
                    height={18}
                    alt="equis"
                    className="equisModal"
                  />
                ),
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
              icon: (
                <Image
                  src="/error-icon.svg"
                  width={24}
                  height={22}
                  alt="icono custom"
                  className="iconPosition"
                />
              ),
              onDismiss: () => {
                removeToast(toastId);
                processedToasts.current.delete(toastId);
              },
              className: "toast-error toatsStyle",
              action: {
                label: (
                  <Image
                    src="/equis.svg"
                    width={18}
                    height={18}
                    alt="equis"
                    className="equisModal"
                  />
                ),
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
              icon: (
                <Image
                  src="/warning-icon.svg"
                  width={24}
                  height={24}
                  alt="icono custom"
                  className="iconPosition"
                />
              ),
              className: "toast-warning toatsStyle",
              action: {
                label: (
                  <Image
                    src="/equis.svg"
                    width={18}
                    height={18}
                    alt="equis"
                    className="equisModal"
                  />
                ),
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
              icon: (
                <Image
                  src="/warning-icon.svg"
                  width={24}
                  height={24}
                  alt="icono custom"
                  className="iconPosition"
                />
              ),
              className: "toast-info toatsStyle",
              action: {
                label: (
                  <Image
                    src="/equis.svg"
                    width={18}
                    height={18}
                    alt="equis"
                    className="equisModal"
                  />
                ),
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
