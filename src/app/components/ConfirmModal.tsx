import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'info',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-orange-500 hover:bg-orange-600',
    info: 'bg-[#1B5E4B] hover:bg-[#15523f]',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 animate-scale-in">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-2 ${variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-orange-100' : 'bg-green-100'}`}>
              <AlertCircle className={`size-6 ${variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-6">
                {description}
              </Dialog.Description>
              <div className="flex gap-3 justify-end">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    {cancelText}
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${variantColors[variant]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}