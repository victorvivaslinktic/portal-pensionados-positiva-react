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
  isHtmlDescription?: boolean;
  variant?: "success" | "error";
  gridContent?: React.ReactNode; // ✅ nueva prop
}

export const SuccessDialog = forwardRef<HTMLDivElement, SuccessDialogProps>(function SuccessDialog(
  {
    open,
    onOpenChange,
    title,
    description,
    isHtmlDescription = false,
    variant = "success",
    gridContent, // ✅ destructuramos aquí
  },
  ref
) {
  const getImageSrc = () => {
    return variant === "error" ? "/notfound.png" : "/success.png";
  };

  const getImageAlt = () => {
    return variant === "error" ? "No encontrado" : "Éxito";
  };

  const renderDescription = () => {
    if (!description) return null;

    if (isHtmlDescription) {
      return (
        <DialogDescription
          id="dialog-description"
          className="font-roboto mt-4 text-center leading-6 font-normal text-[var(--navy-primary)]"
        >
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </DialogDescription>
      );
    } else {
      return (
        <DialogDescription
          id="dialog-description"
          className="font-roboto mt-4 text-center leading-6 font-normal whitespace-pre-line text-[var(--navy-primary)]"
        >
          {description}
        </DialogDescription>
      );
    }
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

          <DialogTitle className="text-navy-primary font-poppins text-center text-3xl font-bold">
            {title}
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-orange-500"></div>
          </DialogTitle>

          {renderDescription()}

          {gridContent && <div className="mt-6 grid grid-cols-2 gap-4">{gridContent}</div>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
