import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Page } from '../types';
import { Copy, Check, Download, ExternalLink, X, QrCode, Sparkles } from 'lucide-react';

interface QrCodeModalProps {
  page: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLive: (slug: string) => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  page,
  isOpen,
  onClose,
  onOpenLive,
}) => {
  const [copied, setCopied] = useState(false);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [size, setSize] = useState<number>(220);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !page) return null;

  // Build the full publicly accessible URL
  const origin = window.location.origin;
  const fullUrl = `${origin}/#p/${page.slug}`;
  const directPath = `/p/${page.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${page.slug}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${page.slug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Kod QR Halaman</h3>
            <p className="text-xs text-slate-400 truncate max-w-[240px]">
              {page.title}
            </p>
          </div>
        </div>

        {/* QR Preview Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center shadow-inner relative">
          <div 
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-md transition-all duration-200"
          >
            <QRCodeSVG
              value={fullUrl}
              size={size}
              fgColor={fgColor}
              bgColor="#ffffff"
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Color selector */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] text-slate-400">Warna Kod:</span>
            {[
              { label: 'Gelap', color: '#0f172a' },
              { label: 'Indigo', color: '#4f46e5' },
              { label: 'Emerald', color: '#059669' },
              { label: 'Rose', color: '#e11d48' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => setFgColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-5 h-5 rounded-full border-2 transition ${
                  fgColor === c.color ? 'border-white scale-110 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title={c.label}
              />
            ))}
          </div>

          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {directPath}
            </span>
          </div>
        </div>

        {/* URL Box */}
        <div className="mt-4 flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="flex-1 bg-transparent text-xs font-mono text-slate-300 focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Actions / Downloads */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDownloadPNG}
            className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition hover:border-slate-600"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Muat Turun PNG</span>
          </button>
          <button
            onClick={handleDownloadSVG}
            className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition hover:border-slate-600"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Muat Turun SVG</span>
          </button>
        </div>

        {/* Open Direct Live View */}
        <div className="mt-3">
          <button
            onClick={() => {
              onClose();
              onOpenLive(page.slug);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Halaman Live Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
