import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw, FolderOpen } from 'lucide-react';

export default function StateBox({
  type = 'empty',
  title,
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
  onSecondary,
  secondaryLabel,
  children,
}) {
  if (type === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center my-6 bg-cyan-50/40 rounded-2xl border border-cyan-100">
        <Loader2 className="h-10 w-10 text-cyan-600 animate-spin mb-3" />
        <h4 className="text-base font-semibold text-slate-800">
          {title || 'Memuat Data...'}
        </h4>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          {message || 'Mohon tunggu sebentar, sedang mengambil informasi kucing.'}
        </p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center my-6 bg-rose-50/50 rounded-2xl border border-rose-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">
          {title || 'Terjadi Masalah'}
        </h4>
        <p className="mt-1 text-sm text-slate-500 max-w-md leading-relaxed">
          {message || 'Gagal memuat data dari server. Periksa koneksi atau konfigurasi Anda.'}
        </p>

        {(onRetry || onSecondary || children) && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <RefreshCw className="h-4 w-4" />
                {retryLabel}
              </button>
            )}
            {onSecondary && (
              <button
                type="button"
                onClick={onSecondary}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <FolderOpen className="h-4 w-4" />
                {secondaryLabel || 'Lihat Data Lokal'}
              </button>
            )}
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
        <Inbox className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">
        {title || 'Belum Ada Data'}
      </h4>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {message || 'Tidak ada data kucing yang cocok dengan kriteria pencarian.'}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
