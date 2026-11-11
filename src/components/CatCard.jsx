import React, { useState } from 'react';
import { Edit2, Trash2, MapPin, Tag } from 'lucide-react';
import { formatAge, statusColor } from '../utils/helpers.js';
import { DEFAULT_CAT_IMAGE } from '../services/catService.js';

export default function CatCard({ cat, onSelect, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(cat.image_url || DEFAULT_CAT_IMAGE);
  const statusInfo = statusColor(cat.status);

  return (
    <article
      onClick={() => onSelect(cat)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={`Foto kucing ${cat.name}`}
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_CAT_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${statusInfo.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
            {statusInfo.text}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-md border ${
              cat.gender === 'Betina'
                ? 'bg-pink-50/90 text-pink-700 border-pink-200'
                : 'bg-blue-50/90 text-blue-700 border-blue-200'
            }`}
          >
            {cat.gender}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-cyan-700 transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 line-clamp-1">
              {cat.breed || 'Kucing Domestik'} • {formatAge(cat.age_months)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs text-slate-500">
          {cat.location && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
              <span className="truncate max-w-[120px]">{cat.location}</span>
            </span>
          )}

          {Array.isArray(cat.traits) && cat.traits.length > 0 && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Tag className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{cat.traits[0]}</span>
              {cat.traits.length > 1 && (
                <span className="text-[11px] text-slate-400">+{cat.traits.length - 1}</span>
              )}
            </span>
          )}
        </div>

        {cat.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {cat.description}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-600 group-hover:underline">
            Lihat Detail &rarr;
          </span>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cat);
                }}
                aria-label={`Edit ${cat.name}`}
                className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat);
                }}
                aria-label={`Hapus ${cat.name}`}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
