import React from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'default' | 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in
            ${toast.type === 'success' ? 'bg-secondary text-secondary-foreground' : ''}
            ${toast.type === 'error' ? 'bg-destructive text-destructive-foreground' : ''}
            ${toast.type === 'info' ? 'bg-primary text-primary-foreground' : ''}
            ${toast.type === 'default' ? 'bg-card text-foreground border border-border' : ''}
          `}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
