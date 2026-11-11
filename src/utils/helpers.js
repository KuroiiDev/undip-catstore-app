export function formatAge(months) {
  const m = Number(months);
  if (isNaN(m) || m <= 0) return '0 bln';
  if (m < 12) return `${m} bln`;

  const years = Math.floor(m / 12);
  const remainingMonths = m % 12;

  if (remainingMonths === 0) {
    return `${years} thn`;
  }
  return `${years} thn ${remainingMonths} bln`;
}

export function matchesSearch(item, q) {
  if (!q || !q.trim()) return true;
  const query = q.trim().toLowerCase();

  const nameMatch = item.name ? item.name.toLowerCase().includes(query) : false;
  const breedMatch = item.breed ? item.breed.toLowerCase().includes(query) : false;
  const locationMatch = item.location ? item.location.toLowerCase().includes(query) : false;
  const colorMatch = item.color ? item.color.toLowerCase().includes(query) : false;
  const traitsMatch = Array.isArray(item.traits)
    ? item.traits.some((t) => String(t).toLowerCase().includes(query))
    : false;

  return nameMatch || breedMatch || locationMatch || colorMatch || traitsMatch;
}

export function sortCats(items, key = 'newest') {
  if (!Array.isArray(items)) return [];
  const list = [...items];

  switch (key) {
    case 'name_asc':
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'age_asc':
      return list.sort((a, b) => (Number(a.age_months) || 0) - (Number(b.age_months) || 0));
    case 'age_desc':
      return list.sort((a, b) => (Number(b.age_months) || 0) - (Number(a.age_months) || 0));
    case 'newest':
    default:
      return list.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (timeA && timeB) return timeB - timeA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }
}

export function truncate(str, max = 100) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + '...';
}

export function statusColor(status) {
  const norm = (status || '').trim();
  switch (norm) {
    case 'Dalam Proses':
      return {
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
        text: 'Dalam Proses',
      };
    case 'Sudah Diadopsi':
      return {
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        dotClass: 'bg-slate-400',
        text: 'Sudah Diadopsi',
      };
    case 'Tersedia':
    default:
      return {
        badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dotClass: 'bg-cyan-500',
        text: 'Tersedia',
      };
  }
}

export function normalizeWaNumber(str) {
  if (!str) return '';
  let digits = String(str).replace(/\D/g, '');
  if (!digits || digits.length < 8) return '';

  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (!digits.startsWith('62')) {
    digits = '62' + digits;
  }
  return digits;
}
