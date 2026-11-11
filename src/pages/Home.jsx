import { ArrowRight, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import CatCard from '../components/CatCard.jsx';
import StateBox from '../components/StateBox.jsx';
import { useCats } from '../hooks/useCats.js';

export default function Home({ onNavigate, onSelectCat, onEditCat, onDeleteCat }) {
  const { cats, loading, error, isFallback, refetch } = useCats({ limit: 3 });

  const reasons = [
    {
      icon: Heart,
      title: 'Menyelamatkan Nyawa',
      desc: 'Setiap adopsi memberi kesempatan kedua bagi kucing terlantar untuk mendapatkan rumah yang hangat dan penuh kasih sayang.',
    },
    {
      icon: Sparkles,
      title: 'Teman Setia Keluarga',
      desc: 'Kucing yang diadopsi sering kali menunjukkan rasa syukur mendalam dan menjadi sahabat paling setia di rumah.',
    },
    {
      icon: ShieldCheck,
      title: 'Sehat & Terpantau',
      desc: 'Kucing kami telah didata status vaksinasi dan sterilisasinya demi kesehatan terbaik mereka dan kenyamanan Anda.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Pilih Kucing',
      desc: 'Jelajahi katalog kami dan temukan kucing dengan karakter yang cocok untuk gaya hidup Anda.',
    },
    {
      number: '02',
      title: 'Hubungi Kontak',
      desc: 'Kontak langsung shelter atau pemilik via WhatsApp atau nomor telepon yang tertera.',
    },
    {
      number: '03',
      title: 'Temu & Kenalan',
      desc: 'Atur jadwal kunjungan untuk bertemu langsung dengan kucing calon sahabat barumu.',
    },
    {
      number: '04',
      title: 'Bawa Pulang',
      desc: 'Selesaikan proses adopsi sederhana dan sambut kebahagiaan baru di rumah Anda!',
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/70 via-white to-white py-16 sm:py-24 border-b border-cyan-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 max-w-3xl mx-auto leading-tight sm:leading-tight">
            Beri Rumah Penuh Kasih untuk <span className="text-cyan-600">Anomali</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Cukingologi menghubungkan pecinta kucing dengan ratusan kucing ajaib yang siap diadopsi. 
            Mulai langkah kebaikanmu hari ini.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('Catalog')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-2xl transition-all shadow-md hover:shadow-cyan-200/60 focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <span>Lihat Kucing</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('About')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <span>Tentang Kami</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section Kenapa Adopsi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Kenapa Memilih Adopsi?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Adopsi bukan sekadar memelihara hewan, tetapi memberikan masa depan baru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-cyan-200 transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Langkah Adopsi */}
      <section className="bg-cyan-50/50 py-16 border-y border-cyan-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Langkah Mudah Adopsi
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Empat langkah simpel untuk menjemput anggota keluarga barumu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
              >
                <span className="text-3xl font-black text-cyan-500/40 font-mono">
                  {step.number}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-2 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Kucing Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Kucing Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kucing manis yang baru saja bergabung dan mencari rumah idaman.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Catalog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
          >
            <span>Lihat Semua Kucing</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {isFallback && (
          <div className="mb-6 p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-800 flex items-center justify-between">
            <span>Menampilkan data tersimpan (offline/server tidak tersedia).</span>
            <button
              type="button"
              onClick={refetch}
              className="font-semibold underline ml-2 hover:text-cyan-900"
            >
              Coba lagi
            </button>
          </div>
        )}

        {loading ? (
          <StateBox type="loading" title="Memuat Kucing Terbaru..." />
        ) : error && cats.length === 0 ? (
          <StateBox
            type="error"
            title="Gagal Memuat Kucing"
            message={error.message}
            onRetry={refetch}
          />
        ) : cats.length === 0 ? (
          <StateBox
            type="empty"
            title="Belum Ada Kucing"
            message="Saat ini belum ada data kucing yang terdaftar."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
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
      </section>
    </div>
  );
}
