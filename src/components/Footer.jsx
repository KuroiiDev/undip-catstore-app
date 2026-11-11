import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>&copy; {currentYear} KuroiiDev. Dibuat dengan</span>
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
          <span>untuk pecinta kucing.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Sam</span>
          <span>•</span>
          <span>Progressive Web App II</span>
        </div>
      </div>
    </footer>
  );
}
