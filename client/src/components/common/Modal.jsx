import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 z-10 my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
