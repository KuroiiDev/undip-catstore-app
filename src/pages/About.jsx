import { Code2, Users } from 'lucide-react';

const TEAM = [
  { nama: 'Maitsam Kadzim', nim: '21120124140161'},
  { nama: 'Rafi Nurulhuda', nim: '21120124130053'},
  { nama: 'Gotara Parasdya Abimanyu', nim: '21120124140157'},
  { nama: 'Faiz Alif Rahmawan', nim: '21120124130063'},
];

const TECH_STACK = [
  { name: 'React 19', role: 'UI Framework' },
  { name: 'Vite', role: 'Build Tool & Dev Server' },
  { name: 'Tailwind CSS v4', role: 'Utility-first Styling' },
  { name: 'Supabase REST', role: 'PostgreSQL Database & Storage' },
  { name: 'PWA (Workbox)', role: 'Offline & Installable Web App' },
  { name: 'Lucide Icons', role: 'Vector Iconography' },
];

export default function About() {
  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
      {/* Section Misi */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight sm:text-5xl">
          Tentang <span className="text-cyan-600">Cukingologi</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
          Cukingologi adalah platform Progressive Web App (PWA) modern yang didedikasikan untuk menjembatani
          proses adopsi kucing ajaib dengan para adopter yang rada-rada. Kami percaya bahwa
          setiap kucing berhak mendapatkan rumah yang aman, penuh kasih sayang, dan perhatian terbaik.
        </p>
      </section>

      {/* Section Tim */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-cyan-600 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-xs font-bold tracking-wider uppercase">Anggota Tim</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Kelompok 13
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Shift 02
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, index) => {
            const initials = getInitials(member.nama);
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-200 transition-all group"
              >
                <div className="h-20 w-20 rounded-full bg-cyan-100 text-cyan-700 border-2 border-cyan-200 flex items-center justify-center text-xl font-bold mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  {initials}
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">
                  {member.nama}
                </h3>
                <p className="text-xs font-mono font-medium text-slate-500 mt-1">
                  NIM: {member.nim}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Tech Stack */}
      <section className="bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-3xl p-8 border border-slate-200/80">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-cyan-600 mb-2">
            <Code2 className="h-5 w-5" />
            <span className="text-xs font-bold tracking-wider uppercase">Teknologi</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Tech Stack Aplikasi
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Dibangun dengan standar modern dan performa.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {TECH_STACK.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-medium text-slate-700"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              <strong className="text-slate-900">{tech.name}</strong>
              <span className="text-slate-400">({tech.role})</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
