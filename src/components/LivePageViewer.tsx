import React, { useEffect, useState } from 'react';
import { Page, User } from '../types';
import { getPageBySlug, incrementViews } from '../lib/storage';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  ExternalLink,
  QrCode,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface LivePageViewerProps {
  slug: string;
  currentUser: User;
  onBackToDashboard: () => void;
  onOpenQr: (page: Page) => void;
}

export const LivePageViewer: React.FC<LivePageViewerProps> = ({
  slug,
  currentUser,
  onBackToDashboard,
  onOpenQr,
}) => {
  const [page, setPage] = useState<Page | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isTrueFullscreen, setIsTrueFullscreen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const found = getPageBySlug(slug);
    if (found) {
      setPage(found);
      // Increment views if published
      if (found.isPublished) {
        incrementViews(slug);
      }
    }
  }, [slug]);

  const fullUrl = `${window.location.origin}/#p/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // If page not found
  if (!page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mb-6 shadow-2xl">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono mb-4">
          Status 404 • Not Found
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Halaman Tidak Ditemui
        </h1>
        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
          Pautan <code className="text-indigo-400 font-mono">/p/{slug}</code> tidak wujud atau telah dipadamkan oleh pemilik.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>
    );
  }

  // If page is draft and user is not author or admin
  const isAuthor = page.userId === currentUser.id;
  const isAdmin = currentUser.role === 'ADMIN';
  const canViewDraft = isAuthor || isAdmin;

  if (!page.isPublished && !canViewDraft) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-6 shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono mb-4">
          Halaman Dalam Draf (Draft Mode)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Halaman Ini Belum Diterbitkan
        </h1>
        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
          Pemilik halaman belum menerbitkan halaman ini kepada tatapan umum. Sila hubungi pemilik atau log masuk sebagai pentadbir untuk pratonton.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-2 transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Papan Pemuka</span>
        </button>
      </div>
    );
  }

  // Device width constraint
  const viewportWidthClass = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[92vh] max-w-full my-auto rounded-2xl shadow-2xl border-4 border-slate-700',
    mobile: 'w-[390px] h-[844px] max-w-full my-auto rounded-[38px] shadow-2xl border-[6px] border-slate-700 overflow-hidden',
  }[viewMode];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Hosting Navigation Bar (Can be hidden in true fullscreen) */}
      {!isTrueFullscreen && (
        <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
          {/* Left: Back button & Page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white max-w-[180px] sm:max-w-xs truncate">
                {page.title}
              </span>
              {page.isPublished ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                  <Clock className="w-2.5 h-2.5" />
                  Pratonton Draf
                </span>
              )}
            </div>
          </div>

          {/* Center: Simulated URL Address Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
            <span className="text-slate-600 select-none">https://pekithost.app</span>
            <span className="text-indigo-400 font-mono font-medium">/p/{page.slug}</span>
            <button
              onClick={handleCopyLink}
              title="Salin Pautan"
              className="ml-auto text-slate-400 hover:text-slate-200 transition"
            >
              {copiedUrl ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Right: Responsive switchers & QR code & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Viewport switchers */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'desktop'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Paparan Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'tablet'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Paparan Tablet"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'mobile'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Paparan Telefon Mudah Alih"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* QR Code trigger */}
            <button
              onClick={() => onOpenQr(page)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Buka Kod QR"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Kod QR</span>
            </button>

            {/* True Fullscreen Toggle */}
            <button
              onClick={() => setIsTrueFullscreen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Paparan Penuh (Tanpa Bingkai)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>
      )}

      {/* Floating Exit Fullscreen button when in True Fullscreen */}
      {isTrueFullscreen && (
        <button
          onClick={() => setIsTrueFullscreen(false)}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-2xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-800 backdrop-blur-md transition group"
        >
          <Minimize2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
          <span>Keluar Paparan Penuh</span>
        </button>
      )}

      {/* Viewport Canvas Container */}
      <main
        className={`flex-1 flex items-center justify-center ${
          viewMode !== 'desktop' && !isTrueFullscreen
            ? 'p-6 bg-slate-900/50'
            : 'p-0'
        }`}
      >
        <div className={`transition-all duration-300 ${isTrueFullscreen ? 'w-full h-screen' : viewportWidthClass}`}>
          <iframe
            srcDoc={page.htmlContent}
            title={page.title}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
          />
        </div>
      </main>
    </div>
  );
};
