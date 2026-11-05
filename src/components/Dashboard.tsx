import React, { useState, useMemo } from 'react';
import { Page, User } from '../types';
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  QrCode,
  Globe,
  Clock,
  Eye,
  Filter,
  Sparkles,
  Layers,
  CheckCircle2,
  Shield,
  FileCode,
  ArrowUpRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface DashboardProps {
  pages: Page[];
  currentUser: User;
  onNewPage: () => void;
  onEditPage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onOpenLive: (slug: string) => void;
  onOpenQr: (page: Page) => void;
  onTogglePublish: (id: string) => void;
  onShowPrismaModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pages,
  currentUser,
  onNewPage,
  onEditPage,
  onDeletePage,
  onOpenLive,
  onOpenQr,
  onTogglePublish,
  onShowPrismaModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [adminViewAll, setAdminViewAll] = useState(true);

  // Filter pages according to user role and search
  const visiblePages = useMemo(() => {
    return pages.filter((page) => {
      // Role check: If Admin & adminViewAll is false, show only admin's pages.
      // If regular USER, show only their pages.
      if (currentUser.role !== 'ADMIN' || !adminViewAll) {
        if (page.userId !== currentUser.id) return false;
      }

      // Status filter
      if (statusFilter === 'published' && !page.isPublished) return false;
      if (statusFilter === 'draft' && page.isPublished) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          page.title.toLowerCase().includes(q) ||
          page.slug.toLowerCase().includes(q) ||
          (page.description && page.description.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [pages, currentUser, adminViewAll, statusFilter, searchQuery]);

  // Metric stats
  const userPages = useMemo(() => {
    return currentUser.role === 'ADMIN' && adminViewAll
      ? pages
      : pages.filter((p) => p.userId === currentUser.id);
  }, [pages, currentUser, adminViewAll]);

  const totalPages = userPages.length;
  const publishedCount = userPages.filter((p) => p.isPublished).length;
  const draftCount = userPages.filter((p) => !p.isPublished).length;
  const totalViews = userPages.reduce((acc, p) => acc + (p.views || 0), 0);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/#p/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      onDeletePage(pageToDelete.id);
      setPageToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Papan Pemuka Halaman
            </h1>
            {currentUser.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Shield className="w-3 h-3" />
                Pentadbir (Admin)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">
            Urus halaman web statik, pantau bilangan paparan, salin pautan kustom, dan jana kod QR.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onShowPrismaModal}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Skema Prisma & Next.js</span>
          </button>

          <button
            onClick={onNewPage}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Cipta Halaman Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Jumlah Halaman</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalPages}</div>
          <span className="text-[11px] text-slate-500">Semua rekod tersimpan</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Diterbitkan (Live)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{publishedCount}</div>
          <span className="text-[11px] text-emerald-500/80">Boleh diakses orang awam</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Draf (Private)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{draftCount}</div>
          <span className="text-[11px] text-slate-500">Dalam proses pembikinan</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Jumlah Paparan</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{totalViews}</div>
          <span className="text-[11px] text-slate-500">Kunjungan pelawat unik</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tajuk atau slug..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({userPages.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'published'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terbit ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'draft'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Draf ({draftCount})
            </button>
          </div>

          {/* Admin toggle if Admin */}
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setAdminViewAll(!adminViewAll)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                adminViewAll
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {adminViewAll ? 'Paparan: Semua Pengguna (Admin)' : 'Paparan: Halaman Saya Sahaja'}
            </button>
          )}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th scope="col" className="px-6 py-4">Tajuk Halaman & Info</th>
                <th scope="col" className="px-6 py-4">Slug URL (/p/...)</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Paparan</th>
                <th scope="col" className="px-6 py-4">Tarikh Cipta</th>
                <th scope="col" className="px-6 py-4 text-right">Tindakan (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {visiblePages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-200 mb-1">Tiada Halaman Dijumpai</p>
                      <p className="text-xs text-slate-500 max-w-sm mb-4">
                        {searchQuery
                          ? 'Tiada padanan untuk carian anda. Cuba kata kunci lain.'
                          : 'Anda belum mencipta sebarang halaman HTML statik lagi.'}
                      </p>
                      <button
                        onClick={onNewPage}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                      >
                        + Cipta Halaman Pertama Anda
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                visiblePages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-slate-850/50 transition-colors group"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                          {page.title}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {page.description || 'Halaman web statik'}
                        </span>
                        {currentUser.role === 'ADMIN' && page.authorName && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                            Oleh: <strong className="text-slate-400">{page.authorName}</strong>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slug URL */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 font-mono text-[11px]">
                        <span>/p/{page.slug}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onTogglePublish(page.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                          page.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20'
                        }`}
                        title="Klik untuk ubah status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            page.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        <span>{page.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Views Count */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold">{page.views || 0}</span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(page.createdAt).toLocaleDateString('ms-MY', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Open Link */}
                        <button
                          onClick={() => onOpenLive(page.slug)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                          title="Buka Pautan Live (/p/[slug])"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopyLink(page.slug)}
                          className={`p-1.5 rounded-lg transition ${
                            copiedSlug === page.slug
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title="Salin Pautan"
                        >
                          {copiedSlug === page.slug ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* QR Code Bonus UI */}
                        <button
                          onClick={() => onOpenQr(page)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white transition"
                          title="Jana Kod QR (qrcode.react)"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditPage(page.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Kemaskini Kod HTML"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setPageToDelete(page)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition"
                          title="Padam Halaman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-white mb-2">
              Padam Halaman Ini?
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
              Adakah anda pasti mahu memadam <strong className="text-white">"{pageToDelete.title}"</strong> (/p/{pageToDelete.slug})? Tindakan ini tidak boleh diundur.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPageToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
