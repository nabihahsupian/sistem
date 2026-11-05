import React, { useState, useEffect } from 'react';
import { Page, User } from '../types';
import { createPage, updatePage, slugify, getStoredPages } from '../lib/storage';
import { STARTER_TEMPLATES } from '../lib/templates';
import {
  Save,
  Globe,
  ArrowLeft,
  LayoutTemplate,
  Code2,
  Eye,
  Columns,
  Upload,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Wand2,
  FileCode,
  Layers,
  HelpCircle
} from 'lucide-react';

interface PageEditorProps {
  pageIdToEdit?: string | null;
  currentUser: User;
  onSaved: (slug: string) => void;
  onCancel: () => void;
  onOpenLive: (slug: string) => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  pageIdToEdit,
  currentUser,
  onSaved,
  onCancel,
  onOpenLive,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
  // UI states
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing page if editing
  useEffect(() => {
    if (pageIdToEdit) {
      const pages = getStoredPages();
      const existing = pages.find((p) => p.id === pageIdToEdit);
      if (existing) {
        setTitle(existing.title);
        setSlug(existing.slug);
        setDescription(existing.description || '');
        setHtmlContent(existing.htmlContent);
        setIsPublished(existing.isPublished);
        setIsSlugManuallyEdited(true);
      }
    } else {
      // Default to Kempen Raya starter template for exciting initial experience
      setHtmlContent(STARTER_TEMPLATES[0].htmlContent);
      setTitle('Kempen Raya Bergaya 2025');
      setSlug('kempen-raya-2025');
      setDescription('Halaman promosi jualan Aidilfitri dengan WhatsApp checkout');
      setIsPublished(true);
    }
  }, [pageIdToEdit]);

  // Handle Title change -> auto slug if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited && !pageIdToEdit) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(slugify(val));
  };

  const handleApplyTemplate = (templateContent: string, templateTitle: string) => {
    setHtmlContent(templateContent);
    if (!title || title === 'Kempen Raya Bergaya 2025') {
      setTitle(templateTitle);
      if (!isSlugManuallyEdited) {
        setSlug(slugify(templateTitle));
      }
    }
    setShowTemplateModal(false);
  };

  // Upload .html file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setHtmlContent(text);
        if (!title) {
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          setTitle(fileNameWithoutExt);
          if (!isSlugManuallyEdited) setSlug(slugify(fileNameWithoutExt));
        }
      }
    };
    reader.readAsText(file);
  };

  // Format HTML lightly
  const handleFormatCode = () => {
    try {
      // Basic indent formatter for cleaner reading
      let formatted = '';
      let indent = 0;
      const lines = htmlContent.split(/>\s*</);
      lines.forEach((line) => {
        if (line.match(/^\/\w/)) indent = Math.max(0, indent - 1);
        formatted += `${'  '.repeat(indent)}<${line}>\n`;
        if (line.match(/^<?\w[^>]*[^\/]$/) && !line.startsWith('input') && !line.startsWith('img') && !line.startsWith('br') && !line.startsWith('hr') && !line.startsWith('meta') && !line.startsWith('link')) {
          indent++;
        }
      });
      // If it looks valid, apply
      if (formatted.length > 50) {
        setHtmlContent(formatted.trim().replace(/^<</g, '<').replace(/>>$/g, '>'));
      }
    } catch {
      // Keep as-is if fail
    }
  };

  // Save handler
  const handleSave = (publishState: boolean) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('Sila masukkan Tajuk Halaman.');
      return;
    }

    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      setErrorMsg('Sila masukkan Slug URL yang sah.');
      return;
    }

    if (!htmlContent.trim()) {
      setErrorMsg('Kandungan kod HTML tidak boleh kosong.');
      return;
    }

    setIsSaving(true);

    try {
      if (pageIdToEdit) {
        const res = updatePage(pageIdToEdit, {
          title,
          slug: cleanSlug,
          htmlContent,
          isPublished: publishState,
          description,
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Gagal mengemaskini halaman.');
          setIsSaving(false);
          return;
        }

        setIsPublished(publishState);
        setSuccessMsg(publishState ? 'Halaman berjaya diterbitkan!' : 'Draf berjaya disimpan!');
        setTimeout(() => {
          onSaved(cleanSlug);
        }, 1200);
      } else {
        const res = createPage({
          title,
          slug: cleanSlug,
          htmlContent,
          isPublished: publishState,
          description,
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Gagal mencipta halaman baharu.');
          setIsSaving(false);
          return;
        }

        setIsPublished(publishState);
        setSuccessMsg(publishState ? 'Halaman baru berjaya diterbitkan!' : 'Draf baru berjaya disimpan!');
        setTimeout(() => {
          onSaved(cleanSlug);
        }, 1200);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Ralat semasa menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick code snippets injector
  const insertSnippet = (snippet: string) => {
    setHtmlContent((prev) => prev + '\n' + snippet);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top action bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              {pageIdToEdit ? 'Kemaskini Halaman HTML' : 'Cipta Halaman Baharu'}
            </h1>
            <p className="text-xs text-slate-400">
              {pageIdToEdit ? `Mengubah suai slug: /p/${slug}` : 'Tulis atau tampal kod HTML mentah anda'}
            </p>
          </div>
        </div>

        {/* View mode toggle (Split, Code, Preview) */}
        <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split (50/50)</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kod Sahaja</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratonton Sahaja</span>
          </button>
        </div>

        {/* Actions buttons */}
        <div className="flex items-center gap-2.5">
          {pageIdToEdit && slug && (
            <button
              onClick={() => onOpenLive(slug)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Lihat Live</span>
            </button>
          )}

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Simpan Draf</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{pageIdToEdit ? 'Kemaskini & Terbitkan' : 'Terbitkan (Publish)'}</span>
          </button>
        </div>
      </header>

      {/* Notifications */}
      {errorMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form configuration strip */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Title */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tajuk Halaman <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Kempen Raya Bergaya 2025"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Slug URL */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Custom Slug URL <span className="text-rose-400">*</span></span>
              <span className="text-[10px] text-slate-500 font-mono">/p/[slug]</span>
            </label>
            <div className="flex rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition overflow-hidden">
              <span className="px-3 py-2 bg-slate-900 border-r border-slate-800 text-[11px] text-slate-400 font-mono select-none flex items-center">
                /p/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="kempen-raya"
                className="flex-1 px-3 py-2 bg-transparent text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Publishing state badge */}
          <div className="md:col-span-3 flex items-end gap-2">
            <div className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-medium text-slate-300">
                  {isPublished ? 'Status: Terbit (Public)' : 'Status: Draf (Private)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Tukar
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar shortcuts */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5 transition"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pilih Templat Siap Pakai</span>
            </button>

            {/* Upload HTML file */}
            <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import Fail .html</span>
              <input
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Quick snippet buttons */}
            <div className="hidden md:flex items-center gap-1 pl-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-500 mr-1">Selit Kod:</span>
              <button
                onClick={() => insertSnippet(`\n<!-- Butang WhatsApp -->\n<a href="https://wa.me/60123456789" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition">💬 Hubungi Kami di WhatsApp</a>\n`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
              >
                + WhatsApp
              </button>
              <button
                onClick={() => insertSnippet(`\n<!-- Kad Tawaran -->\n<div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white"><h3 class="font-bold text-lg mb-2">Tawaran Khas</h3><p class="text-slate-400 text-xs">Penerangan tawaran anda di sini...</p></div>\n`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
              >
                + Kad Produk
              </button>
              <button
                onClick={() => insertSnippet(`\n<script src="https://cdn.tailwindcss.com"></script>\n`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
              >
                + Tailwind CDN
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>{htmlContent.length} aksara</span>
            <span>•</span>
            <span>{htmlContent.split('\n').length} baris</span>
          </div>
        </div>
      </div>

      {/* Main Workspace (Editor + Live Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Code Editor Panel */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`flex flex-col border-r border-slate-800 bg-slate-950 ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-[11px]">index.html (Kod Mentah)</span>
              </div>
              <button
                onClick={handleFormatCode}
                className="text-[11px] text-slate-400 hover:text-white transition flex items-center gap-1"
                title="Format teks"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Format HTML</span>
              </button>
            </div>

            <div className="flex-1 p-4 flex">
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Tampal atau tulis struktur kod HTML lengkap di sini (<!DOCTYPE html><html>...</html>)..."
                className="w-full h-full min-h-[480px] bg-slate-950 text-indigo-200 font-mono text-xs leading-relaxed p-4 rounded-xl border border-slate-800/80 focus:border-indigo-500 focus:outline-none resize-none selection:bg-indigo-600 selection:text-white"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`flex flex-col bg-slate-900/40 ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            {/* Preview Toolbar */}
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">Live Sandbox Preview</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Masa Nyata</span>
              </div>

              {/* Mobile / Desktop switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded text-xs transition ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  title="Desktop"
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded text-xs transition ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  title="Mudah Alih"
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Sandbox Container */}
            <div className="flex-1 p-4 flex items-center justify-center overflow-auto bg-slate-950/70">
              <div
                className={`transition-all duration-300 h-full min-h-[480px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 ${
                  previewDevice === 'mobile'
                    ? 'w-[375px] max-w-full my-auto rounded-[32px] border-4 border-slate-700'
                    : 'w-full'
                }`}
              >
                <iframe
                  srcDoc={htmlContent}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Starter Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pilih Templat HTML Siap Pakai</h3>
                  <p className="text-xs text-slate-400">Pilih rekaan profesional sedia ada dan suaikan kandungan mengikut keperluan anda.</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {STARTER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {tmpl.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-indigo-300 border border-slate-700">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tmpl.description}
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {tmpl.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyTemplate(tmpl.htmlContent, tmpl.title)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition shadow-sm"
                  >
                    Gunakan Templat Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
