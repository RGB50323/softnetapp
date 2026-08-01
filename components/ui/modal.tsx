"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function Modal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <p className="text-sm text-slate-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 shadow-red-600/20"
          >
            {loading ? "..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}