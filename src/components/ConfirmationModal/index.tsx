import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
  isIrreversible?: boolean;
  loadingText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
  isIrreversible = true,
  loadingText = "Deleting...",
}: ConfirmationModalProps) {
  const getIconName = () => {
    switch (type) {
      case "danger":
        return "alert_triangle";
      case "warning":
        return "alert_circle";
      case "info":
        return "info";
      default:
        return "alert_triangle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "info":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-red-500 hover:bg-red-600 text-white";
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${getIconColor()}`}>
            <Icon name={getIconName()} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-t-primary">{title}</h3>
            {isIrreversible && <p className="text-sm text-t-secondary">This action cannot be undone</p>}
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-t-primary leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            isStroke
            disabled={isLoading}
            className="px-6"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 ${getConfirmButtonStyle()}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {loadingText}
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
