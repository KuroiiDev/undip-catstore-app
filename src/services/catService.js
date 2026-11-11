import { apiClient } from '../config/api.js';

export const DEFAULT_CAT_IMAGE =
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';

export function normalizeCat(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name || 'Tanpa Nama',
    breed: item.breed || 'Domestik',
    gender: item.gender === 'Betina' ? 'Betina' : 'Jantan',
    age_months: Number(item.age_months) || 0,
    color: item.color || '-',
    location: item.location || 'Indonesia',
    status: item.status || 'Tersedia',
    vaccinated: Boolean(item.vaccinated),
    sterilized: Boolean(item.sterilized),
    traits: Array.isArray(item.traits)
      ? item.traits
      : typeof item.traits === 'string' && item.traits.startsWith('{') && item.traits.endsWith('}')
      ? item.traits
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean)
      : [],
    description: item.description || '',
    contact: item.contact || '',
    image_url: item.image_url && item.image_url.trim() ? item.image_url : DEFAULT_CAT_IMAGE,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || null,
  };
}

class CatService {
  async getCats(params = {}) {
    const queryParts = ['select=*', 'order=created_at.desc'];

    if (params.q) {
      queryParts.push(`name=ilike.*${encodeURIComponent(params.q)}*`);
    }
    if (params.gender && params.gender !== 'Semua') {
      queryParts.push(`gender=eq.${encodeURIComponent(params.gender)}`);
    }
    if (params.status && params.status !== 'Semua') {
      queryParts.push(`status=eq.${encodeURIComponent(params.status)}`);
    }
    if (params.limit) {
      queryParts.push(`limit=${encodeURIComponent(params.limit)}`);
    }

    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    const response = await apiClient.get(`/rest/v1/cats${queryString}`);
    const normalized = Array.isArray(response) ? response.map(normalizeCat) : [];
    return { success: true, data: normalized };
  }

  async getCatById(id) {
    const encodedId = encodeURIComponent(id);
    const response = await apiClient.get(`/rest/v1/cats?id=eq.${encodedId}&select=*`);

    if (!Array.isArray(response) || response.length === 0) {
      throw { message: 'Data kucing tidak ditemukan.', status: 404, code: 'NOT_FOUND' };
    }

    return { success: true, data: normalizeCat(response[0]) };
  }

  async createCat(catData) {
    const payload = {
      name: catData.name,
      breed: catData.breed || 'Domestik',
      gender: catData.gender || 'Jantan',
      age_months: Number(catData.age_months) || 0,
      color: catData.color || '',
      location: catData.location || '',
      status: catData.status || 'Tersedia',
      vaccinated: Boolean(catData.vaccinated),
      sterilized: Boolean(catData.sterilized),
      traits: Array.isArray(catData.traits) ? catData.traits : [],
      description: catData.description || '',
      contact: catData.contact || '',
      image_url: catData.image_url || null,
    };

    const response = await apiClient.post('/rest/v1/cats', payload, {
      headers: {
        Prefer: 'return=representation',
      },
    });

    const created = Array.isArray(response) ? response[0] : response;
    return { success: true, data: normalizeCat(created) };
  }

  async updateCat(id, catData) {
    const encodedId = encodeURIComponent(id);
    const payload = {
      name: catData.name,
      breed: catData.breed,
      gender: catData.gender,
      age_months: Number(catData.age_months) || 0,
      color: catData.color,
      location: catData.location,
      status: catData.status,
      vaccinated: Boolean(catData.vaccinated),
      sterilized: Boolean(catData.sterilized),
      traits: Array.isArray(catData.traits) ? catData.traits : [],
      description: catData.description,
      contact: catData.contact,
      image_url: catData.image_url,
      updated_at: new Date().toISOString(),
    };

    const response = await apiClient.patch(`/rest/v1/cats?id=eq.${encodedId}`, payload, {
      headers: {
        Prefer: 'return=representation',
      },
    });

    const updated = Array.isArray(response) ? response[0] : response;
    return { success: true, data: normalizeCat(updated) };
  }

  async deleteCat(id) {
    const encodedId = encodeURIComponent(id);
    const response = await apiClient.delete(`/rest/v1/cats?id=eq.${encodedId}`);
    return { success: true, data: response };
  }
}

export default new CatService();
