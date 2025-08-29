// Modal.tsx
"use client";

import * as React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string; // ✅ tambahkan
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Panel */}
      <Dialog.Panel
        className={clsx(
          "relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg z-50",
          className // ✅ bisa override
        )}
      >
        <Dialog.Title className="text-lg font-semibold mb-4 flex justify-between items-center">
          {title}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X />
          </Button>
        </Dialog.Title>

        <div>{children}</div>
      </Dialog.Panel>
    </Dialog>
  );
};
