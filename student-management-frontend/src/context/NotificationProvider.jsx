import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { NotificationContext } from './notificationContext';

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const notifySuccess = useCallback((message, duration) => {
    addToast('success', message, duration);
  }, [addToast]);

  const notifyError = useCallback((message, duration) => {
    addToast('error', message, duration);
  }, [addToast]);

  const notifyInfo = useCallback((message, duration) => {
    addToast('info', message, duration);
  }, [addToast]);

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyInfo }}>
      {children}

      {/* Floating Toast Container */}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-top-2 ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isError
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <div className="shrink-0 mr-3 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 text-sm font-medium leading-5">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 ml-2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
