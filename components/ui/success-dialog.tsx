"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { forwardRef } from "react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: "success" | "error";
}

export const SuccessDialog = forwardRef<HTMLDivElement, SuccessDialogProps>(function SuccessDialog(
  { open, onOpenChange, title, description, variant = "success" },
  ref
) {
  const getImageSrc = () => {
    if (variant === "error") {
      return "/notfound.png";
    }
    return "/success.png";
  };

  const getImageAlt = () => {
    if (variant === "error") {
      return "No encontrado";
    }
    return "Éxito";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={ref}
        className="max-w-md px-6 py-8"
        aria-describedby={description ? "dialog-description" : undefined}
      >
        <DialogHeader className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <Image
              src={getImageSrc()}
              alt={getImageAlt()}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          <DialogTitle className="text-navy-primary text-center text-3xl font-extrabold">
            {title}
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-orange-500"></div>
          </DialogTitle>

          {description && (
            <DialogDescription
              id="dialog-description"
              className="mt-4 text-center leading-relaxed whitespace-pre-line text-gray-600"
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
