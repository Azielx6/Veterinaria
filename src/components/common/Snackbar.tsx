import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Snackbar: React.FC = () => {
  const { snackbar, closeSnackbar } = useApp();

  useEffect(() => {
    if (!snackbar) return;
    const timer = setTimeout(() => {
      closeSnackbar();
    }, 3500);
    return () => clearTimeout(timer);
  }, [snackbar, closeSnackbar]);

  if (!snackbar) return null;

  const bgStyles = {
    success: 'bg-neutral-900 text-white border-neutral-800',
    error: 'bg-red-900 text-red-50 border-red-800',
    info: 'bg-neutral-900 text-white border-neutral-800',
  }[snackbar.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[snackbar.type];

  const iconColor = {
    success: 'text-teal-400',
    error: 'text-red-300',
    info: 'text-neutral-300',
  }[snackbar.type];

  return (
    <div
      role="alert"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-md border ${bgStyles}`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
        <p className="text-xs font-medium flex-1 leading-snug">{snackbar.message}</p>
        <button
          onClick={closeSnackbar}
          className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
