import { useState, useEffect, useCallback } from 'react';
import catService from '../services/catService.js';
import { SEED_CATS } from '../data/cats.js';

const CACHE_KEY = 'cukingologi_cats_cache';

function getCachedCats() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca cache kucing:', err);
    return [];
  }
}

function setCachedCats(cats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cats));
  } catch (err) {
    console.error('Gagal menyimpan cache kucing:', err);
  }
}

export function useCats(params = {}) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const paramKey = JSON.stringify(params);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const offlineStatus = !navigator.onLine;
    setIsOffline(offlineStatus);

    try {
      const res = await catService.getCats(params);
      setCats(res.data);
      setIsFallback(false);
      if (!params.q && !params.gender && !params.status) {
        setCachedCats(res.data);
      }
    } catch (err) {
      console.warn('[useCats] Fetch gagal, beralih ke cache/seed lokal:', err);
      setError(err);
      setIsFallback(true);

      const cached = getCachedCats();
      if (cached.length > 0) {
        setCats(cached);
      } else {
        setCats(SEED_CATS);
      }
    } finally {
      setLoading(false);
    }
  }, [paramKey]);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  return { cats, loading, error, isFallback, isOffline, refetch: fetchCats };
}

export function useCatById(id) {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchCat = useCallback(async () => {
    if (!id) {
      setCat(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await catService.getCatById(id);
      setCat(res.data);
      setIsFallback(false);
    } catch (err) {
      console.warn(`[useCatById] Gagal mengambil id ${id}, cari di cache:`, err);
      setError(err);
      setIsFallback(true);

      const cached = getCachedCats();
      const combined = [...cached, ...SEED_CATS];
      const found = combined.find((c) => String(c.id) === String(id));
      if (found) {
        setCat(found);
      } else {
        setCat(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCat();
  }, [fetchCat]);

  return { cat, loading, error, isFallback, refetch: fetchCat };
}

export function useCatMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCat = async (data) => {
    if (!navigator.onLine) {
      const err = { message: 'Anda sedang offline. Perubahan hanya bisa disimpan saat online.' };
      setError(err);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await catService.createCat(data);
      return res.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCat = async (id, data) => {
    if (!navigator.onLine) {
      const err = { message: 'Anda sedang offline. Perubahan hanya bisa disimpan saat online.' };
      setError(err);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await catService.updateCat(id, data);
      return res.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCat = async (id) => {
    if (!navigator.onLine) {
      const err = { message: 'Anda sedang offline. Perubahan hanya bisa disimpan saat online.' };
      setError(err);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await catService.deleteCat(id);
      return res.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCat,
    updateCat,
    deleteCat,
    loading,
    error,
  };
}
