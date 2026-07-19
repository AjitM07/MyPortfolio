import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Trash2, Info, X, Loader2 } from 'lucide-react';

const Modal = ({
  isOpen,
  type = 'info', // 'success' | 'danger' | 'info' | 'confirm'
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  showCancel = false,
  isLoading: isLoadingProp = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting && !isLoadingProp) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting, isLoadingProp]);

  if (!isOpen) return null;

  const isLoading = isLoadingProp || isSubmitting;

  const handleConfirmAction = async () => {
    if (onConfirm) {
      try {
        setIsSubmitting(true);
        await onConfirm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
    onClose();
  };

  const renderIcon = () => {
    switch (type) {
      case 'danger':
      case 'confirm':
        return (
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
            <Trash2 className="w-6 h-6 text-[#e8e3d9]" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#e8e3d9]" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#e8e3d9]" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
            <Info className="w-6 h-6 text-[#e8e3d9]" />
          </div>
        );
    }
  };

  const isDanger = type === 'danger' || type === 'confirm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-[#0d0d0d]/95 border border-white/10 rounded-lg p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-5 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with icon and close X */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {renderIcon()}
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {title || (isDanger ? 'Confirm Deletion' : 'Notice')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-500 hover:text-white p-1 rounded-lg transition-colors cursor-none disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {(showCancel || isDanger) && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-[#6b7280] hover:text-white hover:bg-white/5 transition-all cursor-none flex-1 sm:flex-initial justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}

          {isDanger ? (
            <button
              type="button"
              onClick={handleConfirmAction}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-accent/15 border border-accent/30 text-white hover:bg-accent/25 hover:border-accent/50 text-sm font-semibold transition-all cursor-none shadow-[0_0_20px_rgba(232,227,217,0.15)] flex-1 sm:flex-initial justify-center inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                  <span>Deleting...</span>
                </>
              ) : (
                confirmText || 'Delete'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmAction}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-[#e8e3d9] hover:text-white hover:bg-white/20 text-sm font-semibold transition-all cursor-none flex-1 sm:flex-initial justify-center inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                  <span>Processing...</span>
                </>
              ) : (
                confirmText || 'OK'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
