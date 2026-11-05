import React, { useState } from 'react';
import { X, Copy, Check, Database, FileCode, Server, Terminal, Sparkles, BookOpen } from 'lucide-react';

interface PrismaDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrismaDocsModal: React.FC<PrismaDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'pageRoute' | 'apiRoute' | 'seed'>('prisma');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const prismaSchemaCode = `// prisma/schema.prisma
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
  password  String   // (Atau gunakan NextAuth / Clerk)
  role      Role     @default(USER)
  pages     Page[]
  createdAt DateTime @default(now())
}

model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique // Cth: "kempen-raya" untuk /p/kempen-raya
  htmlContent String   @db.Text // Menyimpan kod HTML mentah
  isPublished Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}`;

  const nextjs15PageRouteCode = `// app/p/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Syarat KETAT Next.js 15: params MESTI Promise
type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomHtmlPage(props: PageProps) {
  // Tunggu (await) params sebelum menggunakannya dalam Next.js 15
  const { slug } = await props.params;

  // Cari halaman dalam pangkalan data PostgreSQL berdasarkan slug unik
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  // Jika tiada atau belum dipublish, panggil 404
  if (!page || !page.isPublished) {
    notFound();
  }

  // Render HTML mentah dari pangkalan data
  return (
    <div 
      className="w-full min-h-screen"
      dangerouslySetInnerHTML={{ __html: page.htmlContent }} 
    />
  );
}`;

  const nextjsApiRouteCode = `// app/api/pages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Dapatkan semua halaman untuk user semasa
export async function GET(req: Request) {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true, role: true } } }
    });
    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Cipta halaman HTML baharu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, htmlContent, isPublished, userId } = body;

    // Semak jika slug sudah wujud
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug URL telah digunakan' }, { status: 400 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        htmlContent,
        isPublished: Boolean(isPublished),
        userId: userId || 'user_demo_id',
      },
    });

    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}`;

  const nextjsDynamicApiCode = `// app/api/pages/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteProps = {
  params: Promise<{ id: string }>;
};

// PUT: Kemaskini halaman mengikut ID
export async function PUT(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { title, slug, htmlContent, isPublished } = body;

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        htmlContent,
        isPublished,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Padam halaman
export async function DELETE(req: Request, props: RouteProps) {
  try {
    const { id } = await props.params;
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Halaman berjaya dipadam' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}`;

  const currentSnippet = {
    prisma: {
      code: prismaSchemaCode,
      title: 'Prisma Schema v6 (PostgreSQL)',
      lang: 'prisma',
    },
    pageRoute: {
      code: nextjs15PageRouteCode,
      title: 'Next.js 15 Dynamic Route (app/p/[slug]/page.tsx)',
      lang: 'typescript',
    },
    apiRoute: {
      code: `${nextjsApiRouteCode}\n\n${nextjsDynamicApiCode}`,
      title: 'Next.js 15 CRUD API Routes (app/api/pages/...)',
      lang: 'typescript',
    },
    seed: {
      code: `// Arahan Pasang Pakej (Next.js 15 + Prisma 6 + qrcode.react)
npm install @prisma/client lucide-react qrcode.react
npm install -D prisma @types/node

// Setup pangkalan data
npx prisma generate
npx prisma db push`,
      title: 'Pakej & Arahan Terminal',
      lang: 'bash',
    },
  }[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pelan Tindakan Prisma v6 & Next.js 15</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  Zero-Mistake Architecture
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Struktur kod tepat untuk pangkalan data PostgreSQL, route params Promise, dan CRUD API.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 pt-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`px-4 py-2 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'prisma'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Skema Prisma (PostgreSQL)</span>
          </button>
          <button
            onClick={() => setActiveTab('pageRoute')}
            className={`px-4 py-2 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'pageRoute'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>2. Paparan HTML (/p/[slug])</span>
          </button>
          <button
            onClick={() => setActiveTab('apiRoute')}
            className={`px-4 py-2 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'apiRoute'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. API Routes CRUD</span>
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`px-4 py-2 font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'seed'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>4. Arahan Pasang Pakej</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span className="font-sans font-semibold text-white">{currentSnippet.title}</span>
            <button
              onClick={() => copyCode(currentSnippet.code, activeTab)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-sans font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Salin Kod</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-indigo-200 leading-relaxed overflow-x-auto whitespace-pre selection:bg-indigo-700 selection:text-white">
            {currentSnippet.code}
          </pre>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sesuai untuk Next.js 15 App Router dengan Prisma ORM v6 dan TypeScript.</span>
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
