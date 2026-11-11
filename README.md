# Cukingologi — Platform Adopsi Kucing

**Cukingologi** adalah Progressive Web App (PWA) modern untuk menghubungkan para pecinta kucing dengan kucing-kucing manis yang siap diadopsi. Aplikasi ini dibangun dengan standar arsitektur Modul Praktikum Pengembangan Perangkat Bergerak (PPB).

## Fitur Utama

1. **3 Halaman Utama Berbasis Navigasi State:**
   - **Home:** Hero section, keunggulan adopsi, 4 langkah adopsi, dan 3 kartu kucing terbaru.
   - **Katalog (CRUD Lengkap):**
     - **Create:** Pendaftaran kucing baru lengkap dengan validasi dan link gambar.
     - **Read:** Pencarian (*search*), filter gender & status, pengurutan (*sort*), serta tampilan detail lengkap.
     - **Update:** Edit data kucing dengan prefill data lengkap.
     - **Delete:** Hapus data aman dengan modal konfirmasi tunggal (*single source of truth*).
   - **About:** Misi platform, profil tim pengembang (4 kartu anggota), dan tech stack.
2. **Progressive Web App (PWA):**
   - Dapat diinstal di perangkat (Desktop & Mobile).
   - *Offline capability*: App shell di-precache oleh Workbox.
   - Fallback offline: Menyajikan data tersimpan dari `localStorage` atau data seed lokal saat server/koneksi tidak tersedia.
   - Banner notifikasi status offline dan prompt instalasi PWA.
3. **Penyimpanan Draft Otomatis:**
   - Draft form tersimpan otomatis di `localStorage` setiap 30 detik untuk mencegah kehilangan data.

## Tech Stack

- **UI & Bahasa:** React 19 (Hooks & Functional Components), JavaScript (ES Modules) + JSX
- **Styling:** Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/vite`), tema putih & cyan
- **Ikon:** `lucide-react`
- **HTTP Client:** Axios (instance dengan interceptors)
- **Backend / Database:** Supabase (PostgreSQL) via REST PostgREST (`/rest/v1/cats`) & Storage (`/storage/v1/object/cats/`)
- **PWA:** `vite-plugin-pwa` (Workbox, autoUpdate)
- **Build Tool:** Vite

## Cara Menjalankan

### 1. Prasyarat
- Node.js (versi 18+)
- npm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env)
Salin `.env.example` menjadi `.env`, lalu lengkapi kredensial Supabase Anda:
```bash
cp .env.example .env
```

Pastikan variabel berikut terisi di `.env`:
```env
VITE_API_BASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-or-publishable-key>
```

### 4. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser pada alamat yang muncul (biasanya `http://localhost:5173`).

### 5. Membangun untuk Produksi (Production Build) & Preview PWA
```bash
npm run build
npm run preview
```

## Struktur Database Supabase

Jalankan perintah SQL berikut di Supabase SQL Editor jika belum membuat tabel:

```sql
create table public.cats (
  id bigint generated always as identity primary key,
  name text not null,
  breed text,
  gender text check (gender in ('Jantan','Betina')),
  age_months int default 0,
  color text,
  location text,
  status text default 'Tersedia',
  vaccinated boolean default false,
  sterilized boolean default false,
  traits text[] default '{}',
  description text,
  contact text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

alter table public.cats enable row level security;

create policy "anon select" on public.cats for select to anon using (true);
create policy "anon insert" on public.cats for insert to anon with check (true);
create policy "anon update" on public.cats for update to anon using (true) with check (true);
create policy "anon delete" on public.cats for delete to anon using (true);
```