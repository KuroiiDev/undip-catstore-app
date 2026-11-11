import { useCallback, useState } from 'react';
import ConfirmModal from './components/ConfirmModal.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import PWABadge from './components/PWABadge.jsx';

import About from './pages/About.jsx';
import Catalog from './pages/Catalog.jsx';
import CatDetailPage from './pages/CatDetailPage.jsx';
import CatFormPage from './pages/CatFormPage.jsx';
import Home from './pages/Home.jsx';

import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCatMutations } from './hooks/useCats.js';

export default function App() {
  const [tab, setTab] = useState('Home');
  const [mode, setMode] = useState('list');

  const [selectedCat, setSelectedCat] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const { deleteCat, loading: deleteLoading } = useCatMutations();

  const handleNavigate = (target, payload = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (target === 'Create') {
      setTab('Catalog');
      setMode('create');
      setEditingCat(null);
      setSelectedCat(null);
      return;
    }

    if (target === 'Edit') {
      setTab('Catalog');
      setMode('edit');
      setEditingCat(payload);
      return;
    }

    if (target === 'Detail') {
      setTab('Catalog');
      setMode('detail');
      setSelectedCat(payload);
      return;
    }

    setTab(target);
    setMode('list');
    setSelectedCat(null);
    setEditingCat(null);
  };

  const handleOpenDelete = (cat) => {
    setDeleteTarget(cat);
  };

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const res = await deleteCat(deleteTarget.id);
    if (res !== null) {
      showToast('success', `Kucing "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
      setMode('list');
      setSelectedCat(null);
      setRefreshKey((prev) => prev + 1);
    } else {
      showToast('error', 'Gagal menghapus kucing. Pastikan koneksi internet aktif.');
      setDeleteTarget(null);
    }
  };

  const handleFormSuccess = (updatedCat, successMessage) => {
    showToast('success', successMessage);
    setMode('list');
    setEditingCat(null);
    setSelectedCat(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <Header
        activeTab={tab}
        currentMode={mode}
        onNavigate={handleNavigate}
      />

      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 max-w-sm w-full animate-slide-up"
        >
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50/95 text-rose-800 border-rose-200'
                : 'bg-emerald-50/95 text-emerald-800 border-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Hapus Kucing */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Data Kucing?"
        message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        danger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Main Content */}
      <main className="flex-1">
        {tab === 'Home' && mode === 'list' && (
          <Home
            onNavigate={handleNavigate}
            onSelectCat={(cat) => handleNavigate('Detail', cat)}
            onEditCat={(cat) => handleNavigate('Edit', cat)}
            onDeleteCat={handleOpenDelete}
          />
        )}

        {tab === 'Catalog' && mode === 'list' && (
          <Catalog
            onNavigate={handleNavigate}
            onSelectCat={(cat) => handleNavigate('Detail', cat)}
            onEditCat={(cat) => handleNavigate('Edit', cat)}
            onDeleteCat={handleOpenDelete}
            refreshKey={refreshKey}
          />
        )}

        {mode === 'detail' && selectedCat && (
          <CatDetailPage
            cat={selectedCat}
            onBack={() => handleNavigate('Catalog')}
            onEdit={(cat) => handleNavigate('Edit', cat)}
            onDelete={handleOpenDelete}
          />
        )}

        {mode === 'create' && (
          <CatFormPage
            onBack={() => handleNavigate('Catalog')}
            onSuccess={handleFormSuccess}
          />
        )}

        {mode === 'edit' && editingCat && (
          <CatFormPage
            cat={editingCat}
            onBack={() => handleNavigate('Catalog')}
            onSuccess={handleFormSuccess}
          />
        )}

        {tab === 'About' && mode === 'list' && <About />}
      </main>

      <Footer />
      <PWABadge />
    </div>
  );
}
