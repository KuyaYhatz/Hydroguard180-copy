import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Trash2, Archive, LogOut, Info, X } from 'lucide-react';
import { Button } from './ui/button';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'logout';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  /** Optional extra detail line (e.g. the item name) */
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

const variantConfig: Record<
  ConfirmVariant,
  { icon: typeof AlertTriangle; iconBg: string; iconColor: string; btnClass: string }
> = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: Archive,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  logout: {
    icon: LogOut,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  detail,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center`}>
                  <Icon size={24} className={config.iconColor} />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
                {detail && (
                  <div className="mt-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-[#1F2937] break-words">{detail}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`flex-1 ${config.btnClass}`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
