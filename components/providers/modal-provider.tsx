"use client";

import { useModalStore, type Modal } from "@/lib/stores/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import Image from "next/image";

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case "error":
      return <XCircle className="h-6 w-6 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case "info":
      return <Info className="h-6 w-6 text-blue-500" />;
    default:
      return null;
  }
};

export function ModalProvider() {
  const { modals, removeModal } = useModalStore();

  const handleClose = (modal: Modal) => {
    if (modal.onClose) {
      modal.onClose();
    }
    removeModal(modal.id);
  };

  return (
    <>
      {modals.map((modal: Modal) => (
        <Dialog key={modal.id} open={true} onOpenChange={() => handleClose(modal)}>
          <DialogContent className={modal.className || "sm:max-w-md"}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                {modal.image ? (
                  <Image
                    src={modal.image}
                    alt={modal.title}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  getIcon(modal.type)
                )}
                <DialogTitle className="text-left">{modal.title}</DialogTitle>
              </div>
              {modal.description && (
                <DialogDescription className="text-left">{modal.description}</DialogDescription>
              )}
            </DialogHeader>

            {modal.children && <div className="py-4">{modal.children}</div>}

            {modal.actions && (
              <DialogFooter className="flex-col gap-2 sm:flex-row">
                {modal.actions.secondary && (
                  <Button
                    variant={modal.actions.secondary.variant || "outline"}
                    onClick={() => {
                      modal.actions!.secondary!.action();
                      handleClose(modal);
                    }}
                    className="w-full sm:w-auto"
                  >
                    {modal.actions.secondary.label}
                  </Button>
                )}
                {modal.actions.primary && (
                  <Button
                    variant={modal.actions.primary.variant || "default"}
                    onClick={() => {
                      modal.actions!.primary!.action();
                      handleClose(modal);
                    }}
                    className="w-full sm:w-auto"
                  >
                    {modal.actions.primary.label}
                  </Button>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
