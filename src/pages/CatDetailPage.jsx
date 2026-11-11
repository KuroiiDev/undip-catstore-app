import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Edit2,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { formatAge, statusColor, normalizeWaNumber } from '../utils/helpers.js';
import { DEFAULT_CAT_IMAGE } from '../services/catService.js';

export default function CatDetailPage({ cat, onBack, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(cat.image_url || DEFAULT_CAT_IMAGE);
  const statusInfo = statusColor(cat.status);
  const waNumber = normalizeWaNumber(cat.contact);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Foto Besar */}
        <div className="lg:col-span-6 relative aspect-4/3 lg:aspect-auto lg:min-h-[460px] bg-slate-100 overflow-hidden">
          <img
            src={imgSrc}
            alt={`Foto kucing ${cat.name}`}
            onError={() => setImgSrc(DEFAULT_CAT_IMAGE)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${statusInfo.badgeClass}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.text}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                cat.gender === 'Betina'
                  ? 'bg-pink-50/90 text-pink-700 border-pink-200'
                  : 'bg-blue-50/90 text-blue-700 border-blue-200'
              }`}
            >
              {cat.gender}
            </span>
          </div>
        </div>

        {/* Detail Informasi */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {cat.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {cat.breed || 'Kucing Domestik'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit(cat)}
                  aria-label="Edit kucing"
                  className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(cat)}
                  aria-label="Hapus kucing"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Atribut Utama */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Usia
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {formatAge(cat.age_months)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Warna Bulu
                </span>
                <span className="text-sm font-bold text-slate-800 truncate block">
                  {cat.color || '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Lokasi
                </span>
                <span className="text-sm font-bold text-slate-800 truncate block">
                  {cat.location || '-'}
                </span>
              </div>
            </div>

            {/* Status Kesehatan */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  cat.vaccinated
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {cat.vaccinated ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span>{cat.vaccinated ? 'Sudah Vaksin' : 'Belum Vaksin'}</span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  cat.sterilized
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {cat.sterilized ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span>{cat.sterilized ? 'Sudah Steril' : 'Belum Steril'}</span>
              </div>
            </div>

            {/* Sifat */}
            {Array.isArray(cat.traits) && cat.traits.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-cyan-600" />
                  Sifat & Karakter
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {cat.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deskripsi */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tentang {cat.name}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {cat.description || 'Belum ada deskripsi khusus untuk kucing ini.'}
              </p>
            </div>
          </div>

          {/* Kontak Adopsi */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Kontak Adopsi
            </h4>

            {cat.contact ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{cat.contact}</span>
                </div>

                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Halo, saya tertarik untuk mengadopsi kucing bernama ${cat.name} dari Cukingologi.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Kontak pemilik/shelter belum dicantumkan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
