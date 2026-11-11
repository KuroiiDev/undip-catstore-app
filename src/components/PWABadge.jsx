import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X } from 'lucide-react';

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissOffline, setDismissOffline] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setShowInstallBanner(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setDismissOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissOffline(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  return (
    <aside aria-label="Status PWA dan Jaringan" className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto flex flex-col gap-2.5 pointer-events-none">
      {/* Banner Offline */}
      {isOffline && !dismissOffline && (
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-amber-500 text-white rounded-2xl shadow-lg border border-amber-600 animate-slide-up">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <WifiOff className="h-5 w-5 shrink-0" />
            <span>Anda sedang offline. Data tersimpan tetap dapat dilihat.</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissOffline(true)}
            aria-label="Tutup notifikasi offline"
            className="p-1 rounded-lg hover:bg-amber-600 transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Banner Install PWA */}
      {showInstallBanner && (
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-slate-900/95 text-white rounded-2xl shadow-xl backdrop-blur-md border border-slate-800 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white font-bold">
              C
            </div>
            <div>
              <p className="text-sm font-semibold">Install Cukingologi</p>
              <p className="text-xs text-slate-300">Akses lebih cepat & offline di perangkat Anda</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </button>
            <button
              type="button"
              onClick={() => setShowInstallBanner(false)}
              aria-label="Tutup banner install"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
