import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Link,
  Plus,
  X,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCatMutations } from '../hooks/useCats.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function CatFormPage({ cat, onBack, onSuccess }) {
  const isEditMode = Boolean(cat && cat.id);
  const draftKey = isEditMode
    ? `cukingologi_draft_${cat.id}`
    : 'cukingologi_draft_create';

  const [name, setName] = useState(cat?.name || '');
  const [breed, setBreed] = useState(cat?.breed || '');
  const [gender, setGender] = useState(cat?.gender || 'Jantan');
  const [ageMonths, setAgeMonths] = useState(cat?.age_months ?? 0);
  const [color, setColor] = useState(cat?.color || '');
  const [location, setLocation] = useState(cat?.location || '');
  const [status, setStatus] = useState(cat?.status || 'Tersedia');
  const [contact, setContact] = useState(cat?.contact || '');
  const [vaccinated, setVaccinated] = useState(Boolean(cat?.vaccinated));
  const [sterilized, setSterilized] = useState(Boolean(cat?.sterilized));
  const [traits, setTraits] = useState(Array.isArray(cat?.traits) ? cat.traits : []);
  const [description, setDescription] = useState(cat?.description || '');
  const [imageUrl, setImageUrl] = useState(cat?.image_url || '');
  const [traitInput, setTraitInput] = useState('');

  const [errors, setErrors] = useState({});
  const [formFeedback, setFormFeedback] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [foundDraft, setFoundDraft] = useState(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  const { createCat, updateCat, loading: mutationLoading, error: mutationError } =
    useCatMutations();

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(draftKey);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && typeof parsed === 'object') {
          setFoundDraft(parsed);
          setShowDraftModal(true);
        }
      }
    } catch (e) {
      console.warn('Gagal membaca draft:', e);
    }
  }, [draftKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveDraftToStorage(false);
    }, 30000);

    return () => clearInterval(interval);
  });

  const saveDraftToStorage = (showNotification = true) => {
    try {
      const draftData = {
        name,
        breed,
        gender,
        ageMonths,
        color,
        location,
        status,
        contact,
        vaccinated,
        sterilized,
        traits,
        description,
        imageUrl,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      if (showNotification) {
        setDraftSavedNotice(true);
        setTimeout(() => setDraftSavedNotice(false), 3000);
      }
    } catch (e) {
      console.warn('Gagal menyimpan draft:', e);
    }
  };

  const applyDraft = () => {
    if (!foundDraft) return;
    setName(foundDraft.name || '');
    setBreed(foundDraft.breed || '');
    setGender(foundDraft.gender || 'Jantan');
    setAgeMonths(foundDraft.ageMonths ?? 0);
    setColor(foundDraft.color || '');
    setLocation(foundDraft.location || '');
    setStatus(foundDraft.status || 'Tersedia');
    setContact(foundDraft.contact || '');
    setVaccinated(Boolean(foundDraft.vaccinated));
    setSterilized(Boolean(foundDraft.sterilized));
    setTraits(Array.isArray(foundDraft.traits) ? foundDraft.traits : []);
    setDescription(foundDraft.description || '');
    setImageUrl(foundDraft.imageUrl || '');

    setShowDraftModal(false);
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {
      console.warn('Gagal membuang draft:', e);
    }
    setShowDraftModal(false);
  };

  const handleAddTrait = (e) => {
    if (e) e.preventDefault();
    const trimmed = traitInput.trim();
    if (trimmed && !traits.includes(trimmed)) {
      setTraits([...traits, trimmed]);
      setTraitInput('');
    }
  };

  const handleRemoveTrait = (indexToRemove) => {
    setTraits(traits.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nama kucing wajib diisi.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nama kucing minimal 3 karakter.';
    }

    if (ageMonths === '' || isNaN(Number(ageMonths)) || Number(ageMonths) < 0) {
      newErrors.ageMonths = 'Usia harus berupa angka 0 atau lebih.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setFormFeedback(null);
    const finalImageUrl = imageUrl.trim();

    const payload = {
      name: name.trim(),
      breed: breed.trim() || 'Domestik',
      gender,
      age_months: Number(ageMonths),
      color: color.trim(),
      location: location.trim(),
      status,
      contact: contact.trim(),
      vaccinated,
      sterilized,
      traits,
      description: description.trim(),
      image_url: finalImageUrl || null,
    };

    let result = null;
    if (isEditMode) {
      result = await updateCat(cat.id, payload);
    } else {
      result = await createCat(payload);
    }

    if (result) {
      try {
        localStorage.removeItem(draftKey);
      } catch (e) {
        // ignore
      }
      onSuccess(result, isEditMode ? 'Data kucing berhasil diperbarui!' : 'Kucing baru berhasil didaftarkan!');
    } else {
      setFormFeedback({
        type: 'error',
        message: mutationError?.message || 'Gagal menyimpan data kucing. Silakan coba lagi.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* Modal Lanjutkan Draft */}
      <ConfirmModal
        open={showDraftModal}
        title="Lanjutkan Draft?"
        message="Ditemukan draf formulir yang belum sempat tersimpan sebelumnya. Apakah Anda ingin melanjutkan pengisian dari draf tersebut?"
        confirmLabel="Muat Draft"
        cancelLabel="Buang Draft"
        onConfirm={applyDraft}
        onCancel={discardDraft}
      />

      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          {draftSavedNotice && (
            <span className="text-xs text-emerald-600 font-medium animate-fade-in flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Draft tersimpan
            </span>
          )}
          <button
            type="button"
            onClick={() => saveDraftToStorage(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Simpan Draft</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {isEditMode ? `Edit Data Kucing: ${cat.name}` : 'Tambah Kucing Baru'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? 'Perbarui detail data kucing untuk calon pengadopsi.'
              : 'Lengkapi formulir di bawah ini untuk mendaftarkan kucing yang membutuhkan rumah.'}
          </p>
        </div>

        {formFeedback && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm ${
              formFeedback.type === 'error'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {formFeedback.type === 'error' ? (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {formFeedback.type === 'error' ? 'Pemberitahuan' : 'Sukses'}
              </p>
              <p className="mt-0.5">{formFeedback.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setFormFeedback(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Nama */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Nama Kucing <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Contoh: Mochi, Simba, Luna"
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Section Ras & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Ras Kucing
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Domestik, Persia, Anggora, dll."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
              >
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>
          </div>

          {/* Section Usia & Warna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Usia (dalam bulan)
              </label>
              <input
                type="number"
                min="0"
                value={ageMonths}
                onChange={(e) => {
                  setAgeMonths(e.target.value);
                  if (errors.ageMonths) setErrors({ ...errors, ageMonths: null });
                }}
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.ageMonths
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20'
                }`}
              />
              {errors.ageMonths && (
                <p className="mt-1 text-xs text-rose-500">{errors.ageMonths}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Warna Bulu
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Putih abu, Oranye, Belang tiga"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          {/* Section Lokasi & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Lokasi / Kota
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Semarang, Solo, Jakarta..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Status Adopsi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-700"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Sudah Diadopsi">Sudah Diadopsi</option>
              </select>
            </div>
          </div>

          {/* Section Kontak */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Kontak Adopsi (Nomor WhatsApp / HP)
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Section Vaksin & Steril */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vaccinated}
                onChange={(e) => setVaccinated(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-700">Sudah Vaksin</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sterilized}
                onChange={(e) => setSterilized(e.target.checked)}
                className="h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-700">Sudah Steril</span>
            </label>
          </div>

          {/* Section Sifat */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Sifat & Karakter (Ketik lalu tekan Enter)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={traitInput}
                onChange={(e) => setTraitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTrait();
                  }
                }}
                placeholder="Contoh: Manja, Penurut, Aktif"
                className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="button"
                onClick={handleAddTrait}
                className="px-4 py-2 text-sm font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors border border-cyan-200 inline-flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Tambah
              </button>
            </div>

            {traits.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {traits.map((t, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrait(index)}
                      className="text-cyan-600 hover:text-cyan-900 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Cerita / Deskripsi Kucing
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan kebiasaan, sifat, atau keunikan kucing ini..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Section Foto Kucing */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Link className="h-4 w-4 text-cyan-600" />
              <span>Link URL Foto Kucing</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... atau link gambar langsung"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-800"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Masukkan link gambar (JPEG, PNG, WebP). Jika dikosongkan, gambar bawaan akan digunakan.
            </p>

            {imageUrl && imageUrl.trim() && (
              <div className="mt-4 flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200">
                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={imageUrl.trim()}
                    alt="Preview foto kucing"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Pratinjau Foto</p>
                  <p className="mt-0.5 line-clamp-2 break-all text-slate-400">{imageUrl}</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={mutationLoading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutationLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-xs hover:shadow-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50"
            >
              {mutationLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <span>
                {mutationLoading
                  ? 'Menyimpan...'
                  : isEditMode
                  ? 'Perbarui Data'
                  : 'Daftarkan Kucing'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
