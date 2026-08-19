import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        
        return (
          <div 
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border flex items-center justify-between gap-3 text-xs font-semibold transition-all transform translate-y-0 ${
              isSuccess 
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' 
                : isError 
                ? 'bg-slate-900 text-rose-400 border-rose-500/30' 
                : 'bg-slate-900 text-blue-400 border-blue-500/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span className="text-slate-100 font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
