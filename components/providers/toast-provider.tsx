"use client";

import { useEffect, useRef } from "react";
import { toast as sonnerToast } from "sonner";
import { useToastStore } from "@/lib/stores/toast-store";
import Image from "next/image";
import IconSuccess from "@/public/success-icon.svg";
import IconError from "@/public/error-icon.svg";
import IconX from "@/public/equis.svg";
import IconWarning from "@/public/warning-icon.svg";

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
                  src={IconSuccess.src}
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
                    src={IconX.src}
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
                  src={IconError.src}
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
                    src={IconX.src}
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
                  src={IconWarning.src}
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
                    src={IconX.src}
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
                  src={IconWarning.src}
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
                    src={IconX.src}
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
