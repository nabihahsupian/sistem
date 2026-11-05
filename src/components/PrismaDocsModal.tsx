import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Database,
  FileCode,
  Server,
  Terminal,
  FolderTree,
  Layout,
  Code2,
  ExternalLink,
  Download,
  Sparkles
} from 'lucide-react';

interface PrismaDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrismaDocsModal: React.FC<PrismaDocsModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadProjectBundle = () => {
    const bundle = FILES.reduce((acc, f) => {
      acc[f.path] = f.code;
      return acc;
    }, {} as Record<string, string>);

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nextjs15-prisma-project-bundle.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAllFiles = () => {
    const fullText = FILES.map((f) => `// ==========================================\n// FAIL: ${f.path}\n// ==========================================\n${f.code}\n\n`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const FILES = [
    {
      id: 'schema',
      path: 'prisma/schema.prisma',
      title: 'Skema Pangkalan Data (Prisma v6 + PostgreSQL)',
      category: 'Database',
      language: 'prisma',
      code: `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  pages     Page[]
  createdAt DateTime @default(now())
}

model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique // Contoh: "kempen-raya" untuk /p/kempen-raya
  htmlContent String   @db.Text
  isPublished Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([userId])
}`,
    },
    {
      id: 'prisma_client',
      path: 'lib/prisma.ts',
      title: 'Klien Prisma Singleton (lib/prisma.ts)',
      category: 'Database',
      language: 'typescript',
      code: `// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Mengelakkan limpahan sambungan DB (connection pool exhaustion) dalam pembangunan
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}`,
    },
    {
      id: 'page_public',
      path: 'app/p/[slug]/page.tsx',
      title: 'Halaman Paparan Awam (Server Component)',
      category: 'App Router',
      language: 'typescript',
      code: `// app/p/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

// SYARAT KETAT Next.js 15: params MESTI Promise
type PageProps = {
  params: Promise<{ slug: string }>;
};

// Jana metadata SEO secara dinamik
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, isPublished: true },
  });

  if (!page || !page.isPublished) {
    return { title: 'Halaman Tidak Ditemui' };
  }

  return {
    title: \`\${page.title} | PekitHost\`,
    description: 'Halaman web statik dihoskan pada PekitHost.',
  };
}

export default async function CustomHtmlPage(props: PageProps) {
  // Tunggu (await) params sebelum digunakan dalam Next.js 15
  const { slug } = await props.params;

  // Dapatkan data halaman terus dari PostgreSQL menggunakan Prisma
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  // Jika halaman tiada atau belum diterbitkan, paparkan 404
  if (!page || !page.isPublished) {
    notFound();
  }

  // Render HTML mentah secara penuh ke skrin
  return (
    <div 
      className="w-full min-h-screen"
      dangerouslySetInnerHTML={{ __html: page.htmlContent }} 
    />
  );
}`,
    },
    {
      id: 'api_pages_list',
      path: 'app/api/pages/route.ts',
      title: 'API Senarai & Cipta (app/api/pages/route.ts)',
      category: 'API Routes',
      language: 'typescript',
      code: `// app/api/pages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Senaraikan semua halaman disusun mengikut tarikh cipta terkini
export async function GET(req: Request) {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: pages }, { status: 200 });
  } catch (error: any) {
    console.error('Ralat GET /api/pages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat turun senarai halaman' },
      { status: 500 }
    );
  }
}

// POST: Cipta halaman baharu dengan semakan keunikan slug
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, htmlContent, isPublished, userId } = body;

    // Validasi input wajib
    if (!title?.trim() || !slug?.trim() || !htmlContent?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Sila lengkapkan tajuk, slug URL, dan kod HTML mentah.' },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    // Semak keunikan slug
    const existing = await prisma.page.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: \`Slug URL "\${cleanSlug}" telah digunakan. Sila pilih slug lain.\` },
        { status: 409 }
      );
    }

    // Cipta rekod baru
    const newPage = await prisma.page.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        htmlContent,
        isPublished: Boolean(isPublished),
        userId: userId || 'default_user_id',
      },
    });

    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error: any) {
    console.error('Ralat POST /api/pages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mencipta halaman baharu' },
      { status: 500 }
    );
  }
}`,
    },
    {
      id: 'api_pages_detail',
      path: 'app/api/pages/[id]/route.ts',
      title: 'API Detail, Update, & Delete (app/api/pages/[id]/route.ts)',
      category: 'API Routes',
      language: 'typescript',
      code: `// app/api/pages/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// SYARAT KETAT Next.js 15: params MESTI Promise
type RouteProps = {
  params: Promise<{ id: string }>;
};

// GET: Ambil data satu halaman mengikut ID
export async function GET(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Halaman tidak dijumpai' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Kemas kini data halaman
export async function PUT(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { title, slug, htmlContent, isPublished } = body;

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    // Semak jika slug bertembung dengan rekod lain
    const conflict = await prisma.page.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: \`Slug "\${cleanSlug}" telah digunakan oleh halaman lain.\` },
        { status: 409 }
      );
    }

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        htmlContent,
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Padam rekod halaman
export async function DELETE(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Halaman berjaya dipadam' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}`,
    },
    {
      id: 'dashboard_page',
      path: 'app/dashboard/page.tsx',
      title: 'Papan Pemuka (app/dashboard/page.tsx)',
      category: 'Client Pages',
      language: 'typescript',
      code: `"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Edit, 
  Trash2, 
  X,
  FileCode,
  Globe,
  Clock
} from 'lucide-react';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [qrModalItem, setQrModalItem] = useState<PageItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCopy = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = \`\${origin}/p/\${slug}\`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu memadam halaman ini?')) return;
    try {
      setDeletingId(id);
      const res = await fetch(\`/api/pages/\${id}\`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Gagal memadam halaman');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Papan Pemuka Halaman</h1>
          <p className="text-sm text-slate-400 mt-1">Urus semua halaman HTML statik anda dengan mudah.</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Cipta Halaman Baru</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="px-6 py-4">Tajuk Halaman</th>
                <th className="px-6 py-4">Slug URL</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tarikh Cipta</th>
                <th className="px-6 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Memuatkan data...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <FileCode className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">Tiada Halaman Dijumpai</p>
                    <p className="text-xs text-slate-500 mt-1">Klik "Cipta Halaman Baru" untuk bermula.</p>
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-6 py-4 font-semibold text-white">{p.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-indigo-400 text-[11px]">
                        /p/{p.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={\`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border \${
                        p.isPublished 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }\`}>
                        <span className={\`w-1.5 h-1.5 rounded-full \${p.isPublished ? 'bg-emerald-400' : 'bg-amber-400'}\`} />
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopy(p.slug)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Salin Pautan"
                        >
                          {copiedSlug === p.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={\`/p/\${p.slug}\`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                          title="Buka Pautan (/p/[slug])"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => setQrModalItem(p)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white transition"
                          title="Jana Kod QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={\`/dashboard/edit/\${p.id}\`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Kemaskini"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition"
                          title="Padam"
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

      {/* QR Code Modal (qrcode.react) */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 relative text-slate-100 shadow-2xl">
            <button
              onClick={() => setQrModalItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-4">
              <h3 className="font-bold text-white text-base">Kod QR Halaman</h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">{qrModalItem.title}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl flex items-center justify-center shadow-inner mx-auto w-fit">
              <QRCodeSVG
                value={\`\${typeof window !== 'undefined' ? window.location.origin : ''}/p/\${qrModalItem.slug}\`}
                size={200}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                /p/{qrModalItem.slug}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
    },
    {
      id: 'create_page',
      path: 'app/dashboard/create/page.tsx',
      title: 'Editor Cipta Halaman (app/dashboard/create/page.tsx)',
      category: 'Client Pages',
      language: 'typescript',
      code: `"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Globe, FileCode } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState(\`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Halaman Baharu</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center">
  <div class="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 max-w-md">
    <h1 class="text-2xl font-bold mb-2">Selamat Datang ke Halaman Saya</h1>
    <p class="text-slate-400 text-sm">Dihoskan dengan pantas di PekitHost.</p>
  </div>
</body>
</html>\`);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = async (publish: boolean) => {
    setErrorMsg(null);
    if (!title.trim() || !slug.trim() || !htmlContent.trim()) {
      setErrorMsg('Sila isi semua ruangan yang diperlukan.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          htmlContent,
          isPublished: publish,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Gagal menyimpan.');
        setSubmitting(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ralat penghantaran');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Cipta Halaman Baharu</h1>
            <p className="text-xs text-slate-400">Tampal kod HTML dan tetapkan pautan slug kustom.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Simpan Draf</span>
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Terbitkan (Publish)</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tajuk Halaman</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Kempen Raya Bergaya 2025"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom Slug URL</label>
          <div className="flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-indigo-500">
            <span className="px-3.5 py-2.5 bg-slate-900 border-r border-slate-800 text-xs text-slate-400 font-mono select-none">
              /p/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="kempen-raya"
              className="flex-1 px-4 py-2.5 bg-transparent text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kod HTML Mentah</label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={16}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}`,
    },
    {
      id: 'edit_page',
      path: 'app/dashboard/edit/[id]/page.tsx',
      title: 'Editor Kemaskini Halaman (app/dashboard/edit/[id]/page.tsx)',
      category: 'Client Pages',
      language: 'typescript',
      code: `"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Globe } from 'lucide-react';

// SYARAT KETAT Next.js 15: params MESTI Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditPage(props: PageProps) {
  const router = useRouter();
  const [pageId, setPageId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Tunggu (await) params Promise dalam Next.js 15
    props.params.then(async (resolved) => {
      setPageId(resolved.id);
      try {
        const res = await fetch(\`/api/pages/\${resolved.id}\`);
        const data = await res.json();
        if (data.success) {
          setTitle(data.data.title);
          setSlug(data.data.slug);
          setHtmlContent(data.data.htmlContent);
          setIsPublished(data.data.isPublished);
        } else {
          setErrorMsg(data.error);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    });
  }, [props.params]);

  const handleUpdate = async (publish: boolean) => {
    if (!title.trim() || !slug.trim()) return;

    try {
      const res = await fetch(\`/api/pages/\${pageId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          htmlContent,
          isPublished: publish,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Memuatkan data halaman...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Kemaskini Halaman</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
          >
            Simpan Draf
          </button>
          <button
            onClick={() => handleUpdate(true)}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white"
          >
            Terbitkan
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 mb-6 rounded-xl bg-rose-500/10 text-rose-400 text-xs">{errorMsg}</div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tajuk Halaman</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slug URL (/p/...)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kod HTML</label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={16}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-200 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}`,
    },
    {
      id: 'config_postcss',
      path: 'postcss.config.mjs',
      title: 'Konfigurasi Tailwind CSS v4 (postcss.config.mjs)',
      category: 'Config',
      language: 'javascript',
      code: `// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`,
    },
    {
      id: 'layout',
      path: 'app/layout.tsx',
      title: 'Root Layout (app/layout.tsx)',
      category: 'Config',
      language: 'typescript',
      code: `// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PekitHost - Mini-CMS & HTML Web Hosting',
  description: 'Pengehosan web statik kustom dengan penjanaan kod QR pantas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}`,
    },
    {
      id: 'globals_css',
      path: 'app/globals.css',
      title: 'Global Tailwind v4 Styles (app/globals.css)',
      category: 'Config',
      language: 'css',
      code: `/* app/globals.css */
@import "tailwindcss";

@layer base {
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}`,
    },
    {
      id: 'package_json',
      path: 'package.json',
      title: 'Fail Konfigurasi Pakej (package.json)',
      category: 'Config',
      language: 'json',
      code: `{
  "name": "pekithost-mini-cms",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "npx prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "lucide-react": "^0.475.0",
    "next": "^15.2.0",
    "qrcode.react": "^4.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.7",
    "@types/node": "^22.13.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "postcss": "^8.5.2",
    "prisma": "^6.19.3",
    "tailwindcss": "^4.0.7",
    "typescript": "^5.7.3"
  }
}`,
    },
    {
      id: 'api_tasks_detail',
      path: 'app/api/tasks/[id]/route.ts',
      title: 'API Tasks Dynamic Route Handlers (app/api/tasks/[id]/route.ts)',
      category: 'API Routes',
      language: 'typescript',
      code: `// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Syarat KETAT Next.js 15: params MESTI Promise
type RouteProps = {
  params: Promise<{ id: string }>;
};

// GET: Dapatkan rekod mengikut ID
export async function GET(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;

    const task = await prisma.page.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Rekod tidak dijumpai' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Padam rekod mengikut ID
export async function DELETE(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Rekod berjaya dipadam' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}`,
    },
  ];

  const currentFile = FILES.find((f) => f.id === selectedFileId) || FILES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pelan Kod Penuh Next.js 15 & Prisma v6</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  Zero-Mistake Architecture
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pilih fail di sebelah kiri untuk melihat dan menyalin kod sumber Next.js 15 App Router yang lengkap.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllFiles}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
              title="Salin semua fail ke clipboard"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedAll ? 'Semua Disalin!' : 'Salin Semua'}</span>
            </button>

            <button
              onClick={handleDownloadProjectBundle}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Muat turun manifest bundle JSON bagi semua fail"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Muat Turun Projek (.json)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explorer Workspace (Sidebar + Code View) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/90 border-r border-slate-800 p-3 overflow-y-auto space-y-1 text-xs">
            <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Struktur Direktori Fail
            </div>

            {FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-mono ${
                  selectedFileId === file.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.path}</span>
                </div>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-800/80 px-2">
              <span className="text-[10px] text-slate-500 block mb-1">Arahan Pemasangan:</span>
              <pre className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-indigo-300 font-mono whitespace-pre-wrap">
                npm install @prisma/client lucide-react qrcode.react
              </pre>
            </div>
          </div>

          {/* Active File Content Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-white block">{currentFile.path}</span>
                <span className="text-[11px] text-slate-400">{currentFile.title}</span>
              </div>
              <button
                onClick={() => copyCode(currentFile.code, currentFile.id)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
              >
                {copiedKey === currentFile.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Salin Fail Ini</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-indigo-200 leading-relaxed selection:bg-indigo-700 selection:text-white">
              <pre className="whitespace-pre">{currentFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mematuhi semua syarat KETAT Next.js 15: `params: Promise` di-`await`, Tailwind v4, & Prisma Singleton.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
