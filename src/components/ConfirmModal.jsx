import React, { useEffect } from 'react';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open && !loading) {
        onCancel();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      onClick={() => {
        if (!loading) onCancel();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              danger ? 'bg-rose-100 text-rose-600' : 'bg-cyan-100 text-cyan-700'
            }`}
          >
            {danger ? (
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Info className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1">
            <h3 id="modal-title" className="text-lg font-semibold text-slate-800">
              {title}
            </h3>
            <p id="modal-description" className="mt-2 text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-xs focus-visible:ring-2 disabled:opacity-50 ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500'
                : 'bg-cyan-600 hover:bg-cyan-700 focus-visible:ring-cyan-500'
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
