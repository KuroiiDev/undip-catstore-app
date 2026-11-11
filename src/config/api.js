import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!BASE_URL || !SUPABASE_KEY) {
  console.warn('[Cukingologi] Kredensial Supabase belum terisi. Menggunakan mode fallback offline.');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (SUPABASE_KEY) {
      config.headers['apikey'] = SUPABASE_KEY;
      config.headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let normalizedError = {
      message: 'Terjadi kesalahan sistem.',
      status: null,
      code: null,
      raw: error,
    };

    if (error.response) {
      const data = error.response.data;
      const status = error.response.status;
      const msg =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.msg ||
        data?.error ||
        data?.error_description ||
        data?.hint ||
        data?.details ||
        `Server error (${status})`;

      normalizedError = {
        message: msg,
        status,
        code: data?.code || `HTTP_${status}`,
        raw: error,
      };
    } else if (error.request) {
      normalizedError = {
        message: 'Tidak dapat menjangkau server. Periksa koneksi Anda.',
        status: 0,
        code: 'NETWORK_ERROR',
        raw: error,
      };
    } else {
      normalizedError = {
        message: error.message || 'Terjadi kesalahan tak terduga.',
        status: null,
        code: 'CLIENT_ERROR',
        raw: error,
      };
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
