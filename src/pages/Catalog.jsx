import React, { useState, useMemo, useEffect } from 'react';
import { Search, PlusCircle, RefreshCw, X } from 'lucide-react';
import { useCats } from '../hooks/useCats.js';
import CatCard from '../components/CatCard.jsx';
import StateBox from '../components/StateBox.jsx';
import { matchesSearch, sortCats } from '../utils/helpers.js';

export default function Catalog({
  onNavigate,
  onSelectCat,
  onEditCat,
  onDeleteCat,
  refreshKey,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedSort, setSelectedSort] = useState('newest');

  const { cats, loading, error, isFallback, refetch } = useCats();

  useEffect(() => {
    if (refreshKey) {
      refetch();
    }
  }, [refreshKey, refetch]);

  const filteredCats = useMemo(() => {
    let result = cats || [];

    if (searchQuery.trim()) {
      result = result.filter((cat) => matchesSearch(cat, searchQuery));
    }

    if (selectedGender !== 'Semua') {
      result = result.filter((cat) => cat.gender === selectedGender);
    }

    if (selectedStatus !== 'Semua') {
      result = result.filter((cat) => cat.status === selectedStatus);
    }

    result = sortCats(result, selectedSort);
    return result;
  }, [cats, searchQuery, selectedGender, selectedStatus, selectedSort]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGender !== 'Semua' ||
    selectedStatus !== 'Semua' ||
    selectedSort !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGender('Semua');
    setSelectedStatus('Semua');
    setSelectedSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Katalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Katalog Kucing
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Temukan calon anggota keluarga baru dari {cats.length} kucing terdaftar
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('Create')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-xs hover:shadow-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-500 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Kucing</span>
        </button>
      </div>

      {/* Fallback Offline Notice */}
      {isFallback && (
        <div className="mb-6 p-3.5 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs sm:text-sm text-cyan-800 flex items-center justify-between shadow-2xs">
          <span>Menampilkan data tersimpan (offline / server tidak tersedia).</span>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-1 font-semibold underline ml-3 hover:text-cyan-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba lagi
          </button>
        </div>
      )}

      {/* Bar Pencarian & Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, ras, kota..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Jantan">Jantan</option>
              <option value="Betina">Betina</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Sudah Diadopsi">Sudah Diadopsi</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
            >
              <option value="newest">Terbaru</option>
              <option value="name_asc">Nama (A - Z)</option>
              <option value="age_asc">Usia Termuda</option>
              <option value="age_desc">Usia Tertua</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Menampilkan <strong>{filteredCats.length}</strong> dari {cats.length} kucing
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Grid Kucing */}
      {loading ? (
        <StateBox type="loading" title="Memuat Katalog..." />
      ) : error && cats.length === 0 ? (
        <StateBox
          type="error"
          title="Gagal Memuat Data"
          message={error.message}
          onRetry={refetch}
          onSecondary={() => refetch()}
          secondaryLabel="Lihat Cache Lokal"
        />
      ) : filteredCats.length === 0 ? (
        <StateBox
          type="empty"
          title="Tidak Ada Kucing yang Cocok"
          message="Coba ubah kata kunci pencarian atau reset filter yang dipilih."
        >
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </StateBox>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCats.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              onSelect={onSelectCat}
              onEdit={onEditCat}
              onDelete={onDeleteCat}
            />
          ))}
        </div>
      )}
    </div>
  );
}
