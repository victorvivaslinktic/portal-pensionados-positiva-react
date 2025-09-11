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
  variant?: "success" | "error" | "login";
  gridContent?: React.ReactNode;
  className?: string;
}

export const SuccessDialog = forwardRef<HTMLDivElement, SuccessDialogProps>(function SuccessDialog(
  {
    open,
    onOpenChange,
    title,
    description,
    isHtmlDescription = false,
    variant = "success",
    gridContent,
  },
  ref
) {
  const getImageSrc = () => {
    return variant === "error"
      ? "/notfound.png"
      : variant === "login"
        ? "/login-modal.png"
        : "/success.png";
  };

  const getImageAlt = () => {
    return variant === "error"
      ? "No encontrado"
      : variant === "login"
        ? "Inicio de sesión"
        : "Éxito";
  };

  const renderDescription = () => {
    if (!description) return null;

    const loginPaddingClass = variant === "login" ? "pl-12 pr-12 pb-6 text-left " : "";

    if (isHtmlDescription) {
      return (
        <DialogDescription
          id="dialog-description"
          className={`font-roboto mt-4 text-center leading-6 font-normal text-[var(--navy-primary)] ${loginPaddingClass}`}
        >
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </DialogDescription>
      );
    } else {
      return (
        <DialogDescription
          id="dialog-description"
          className={`font-roboto mt-4 text-center leading-6 font-normal whitespace-pre-line text-[var(--navy-primary)] ${loginPaddingClass}`}
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
        className={`max-w-md px-6 py-8 ${
          variant === "login"
            ? "rounded-2xl border-0 bg-white pr-0 pb-0 pl-0 shadow-lg lg:min-w-[942px]"
            : ""
        }`}
        aria-describedby={description ? "dialog-description" : undefined}
      >
        <DialogHeader className="text-center">
          {variant === "login" ? (
            <div className="m-auto flex w-fit flex-row justify-center justify-items-center gap-5 pr-12 pl-12 align-middle">
              <div className="max-w-[60px]">
                <Image
                  src={getImageSrc()}
                  alt={getImageAlt()}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <DialogTitle className="text-navy-primary font-poppins h-12 w-fit text-2xl font-bold">
                {title}
                <div className="bg-primary-positiva mt-3 h-1 w-16 rounded-full"></div>
              </DialogTitle>
            </div>
          ) : (
            <>
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
                <div className="bg-primary-positiva mx-auto mt-3 h-1 w-16 rounded-full"></div>
              </DialogTitle>
            </>
          )}

          {renderDescription()}

          {gridContent && <div>{gridContent}</div>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
