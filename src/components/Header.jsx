import { Heart } from 'lucide-react';

export default function Header({ activeTab, currentMode, onNavigate }) {
  const isCatalogActive =
    activeTab === 'Catalog' || ['detail', 'create', 'edit'].includes(currentMode);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl p-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 group-hover:bg-cyan-100 transition-colors">
              <img src="/logo.svg" alt="Logo Cukingologi" className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                Cukingologi
                <Heart className="h-3.5 w-3.5 text-cyan-500 fill-cyan-500 inline" />
              </span>
              <p className="text-[11px] font-medium text-slate-400 -mt-1 hidden sm:block">
                Kucing Eksotis
              </p>
            </div>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigate('Home')}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                activeTab === 'Home' && currentMode === 'list'
                  ? 'bg-cyan-50 text-cyan-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Catalog')}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                isCatalogActive
                  ? 'bg-cyan-50 text-cyan-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => onNavigate('About')}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                activeTab === 'About' && currentMode === 'list'
                  ? 'bg-cyan-50 text-cyan-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
