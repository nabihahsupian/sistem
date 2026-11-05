import { Template } from '../types';

export const STARTER_TEMPLATES: Template[] = [
  {
    id: 'kempen-raya',
    title: 'Kempen Raya Mega Sale & Promosi',
    description: 'Halaman promosi Aidilfitri dengan banner meriah, tawaran diskaun, kiraan detik, dan butang tempahan WhatsApp terus.',
    category: 'Promosi',
    tags: ['E-dagang', 'Raya', 'Promosi', 'WhatsApp'],
    htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kempen Raya Bergaya 2025 - Tawaran Istimewa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .glow-gold { text-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <!-- Top announcement banner -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-semibold tracking-wide">
    ✨ Tawaran Terhad Hari Raya: Diskaun Sehingga 50% + Penghantaran Percuma Semenanjung!
  </div>

  <!-- Hero Section -->
  <header class="relative overflow-hidden py-16 px-6 lg:px-12 text-center max-w-4xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
      🌙 Koleksi Eksklusif Syawal 1446H
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 font-serif">
      Koleksi Raya Bergaya <span class="text-amber-400 glow-gold block sm:inline">Anggun & Selesa</span>
    </h1>
    <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
      Sambut kemeriahan Aidilfitri dengan persalinan eksklusif tenunan premium. Tempah awal untuk menjamin saiz anda sebelum kehabisan stok!
    </p>

    <!-- Call to action button -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="https://wa.me/60123456789?text=Hai!%20Saya%20berminat%20dengan%20Koleksi%20Raya" target="_blank"
         class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition transform hover:-translate-y-0.5">
        💬 Tempah Sekarang di WhatsApp
      </a>
      <a href="#katalog" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition">
        Lihat Katalog
      </a>
    </div>
  </header>

  <!-- Product highlights -->
  <section id="katalog" class="max-w-6xl mx-auto px-6 py-12">
    <div class="text-center mb-10">
      <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Pilihan Paling Hangat</h2>
      <p class="text-slate-400 text-sm">Setiap rekaan dihasilkan dengan teliti demi keselesaan seisi keluarga</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition">
        <div class="h-48 rounded-xl bg-gradient-to-br from-emerald-900/60 to-slate-800 flex items-center justify-center text-4xl mb-4 border border-emerald-500/20">
          👗
        </div>
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-white">Kurung Mahsuri Sutera</h3>
          <span class="text-amber-400 font-bold">RM 169</span>
        </div>
        <p class="text-slate-400 text-xs mb-4">Material sutera jacquard sejuk, tidak mudah kedut, zip mesra wuduk.</p>
        <a href="https://wa.me/60123456789?text=Saya%20nak%20order%20Kurung%20Mahsuri" target="_blank"
           class="block w-full py-2.5 text-center text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition">
          Pesan Baju Ini
        </a>
      </div>

      <!-- Card 2 -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition">
        <div class="h-48 rounded-xl bg-gradient-to-br from-teal-900/60 to-slate-800 flex items-center justify-center text-4xl mb-4 border border-teal-500/20">
          👔
        </div>
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-white">Baju Melayu Tuah Cekak Musang</h3>
          <span class="text-amber-400 font-bold">RM 149</span>
        </div>
        <p class="text-slate-400 text-xs mb-4">Potongan moden slim-fit, percuma butang eksklusif & sampin songket mini.</p>
        <a href="https://wa.me/60123456789?text=Saya%20nak%20order%20Baju%20Melayu%20Tuah" target="_blank"
           class="block w-full py-2.5 text-center text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition">
          Pesan Baju Ini
        </a>
      </div>

      <!-- Card 3 -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition">
        <div class="h-48 rounded-xl bg-gradient-to-br from-amber-900/40 to-slate-800 flex items-center justify-center text-4xl mb-4 border border-amber-500/20">
          👨‍👩‍👧‍👦
        </div>
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-white">Pakej Sedondon Keluarga</h3>
          <span class="text-amber-400 font-bold">RM 380</span>
        </div>
        <p class="text-slate-400 text-xs mb-4">Lengkap untuk Ibu, Ayah & 2 Anak. Pilihan lebih 12 warna harmoni.</p>
        <a href="https://wa.me/60123456789?text=Saya%20nak%20order%20Pakej%20Sedondon" target="_blank"
           class="block w-full py-2.5 text-center text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition">
          Pesan Pakej Ini
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 mt-16 py-8 text-center text-xs text-slate-500">
    <p>© 2025 Butik Anggun Syawal. Dikuasakan oleh Mini-CMS PekitHost.</p>
  </footer>
</body>
</html>`
  },
  {
    id: 'bio-link',
    title: 'Bio Link & Kad Bisnes Digital',
    description: 'Halaman profil mudah alih elegan untuk meletakkan semua pautan sosial, nombor WhatsApp, portfolio dan pautan pembayaran.',
    category: 'Sosial',
    tags: ['Linktree', 'Profil', 'Sosial', 'Mobile-first'],
    htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nabihah Supian | Kad Profil Digital</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-slate-100 min-h-screen py-12 px-4 flex flex-col items-center">
  <div class="w-full max-w-md mx-auto text-center">
    <!-- Avatar -->
    <div class="relative inline-block mb-4">
      <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-1 mx-auto shadow-xl">
        <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-indigo-400">
          NS
        </div>
      </div>
      <span class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Boleh Dihubungi"></span>
    </div>

    <!-- Name & Title -->
    <h1 class="text-xl font-bold text-white mb-1">Nabihah Supian</h1>
    <p class="text-indigo-300 text-xs font-medium mb-3">Pereka Web & Pengasas Kreatif</p>
    <p class="text-slate-400 text-xs px-4 mb-6 leading-relaxed">
      Membantu perniagaan kecil & usahawan membina laman web pantas serta penjenamaan digital berkualiti tinggi.
    </p>

    <!-- Social links list -->
    <div class="space-y-3">
      <a href="https://wa.me/60123456789" target="_blank"
         class="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition group shadow-sm">
        <span class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">💬</span>
          <span>WhatsApp Khidmat Pantas</span>
        </span>
        <span class="text-slate-500 group-hover:translate-x-1 transition text-xs">→</span>
      </a>

      <a href="#" target="_blank"
         class="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition group shadow-sm">
        <span class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-base">🌐</span>
          <span>Lihat Portfolio Rasmi</span>
        </span>
        <span class="text-slate-500 group-hover:translate-x-1 transition text-xs">→</span>
      </a>

      <a href="#" target="_blank"
         class="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-pink-500 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition group shadow-sm">
        <span class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-base">📸</span>
          <span>Instagram (@nabihah.design)</span>
        </span>
        <span class="text-slate-500 group-hover:translate-x-1 transition text-xs">→</span>
      </a>

      <a href="#" target="_blank"
         class="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition group shadow-sm">
        <span class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-base">💼</span>
          <span>LinkedIn Connection</span>
        </span>
        <span class="text-slate-500 group-hover:translate-x-1 transition text-xs">→</span>
      </a>
    </div>

    <!-- Quick stats badge -->
    <div class="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
      <div class="p-2">
        <div class="text-lg font-bold text-white">50+</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Projek Siap</div>
      </div>
      <div class="p-2">
        <div class="text-lg font-bold text-indigo-400">100%</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Responsif</div>
      </div>
      <div class="p-2">
        <div class="text-lg font-bold text-emerald-400">5.0 ★</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Penilaian</div>
      </div>
    </div>

    <div class="mt-8 text-[11px] text-slate-500">
      Disimpan & Dihoskan di PekitHost
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'saas-landing',
    title: 'Landing Page SaaS & Perisian Moden',
    description: 'Halaman pelancaran produk teknologi moden dengan reka bentuk gelap, kad ciri utama, bukti sosial, dan borang langganan.',
    category: 'Bisnes',
    tags: ['SaaS', 'Startup', 'Moden', 'Tech'],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusAI - Automasi Pintar Untuk Pasukan Anda</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-black text-zinc-100 min-h-screen selection:bg-cyan-500 selection:text-black">
  <!-- Nav -->
  <nav class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
    <div class="flex items-center gap-2 font-bold text-xl text-white">
      <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-black">N</span>
      <span>NexusAI</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="#features" class="text-xs text-zinc-400 hover:text-white transition hidden sm:inline">Ciri-Ciri</a>
      <a href="#pricing" class="text-xs text-zinc-400 hover:text-white transition hidden sm:inline">Harga</a>
      <a href="#cta" class="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition">
        Cuba Percuma
      </a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-medium mb-6">
      🚀 NexusAI 2.0 kini dilancarkan secara rasmi
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
      Urus Kerja Digital Anda Dengan <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kepintaran AI Terpantas</span>
    </h1>
    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
      Satu platform serba lengkap untuk menjimatkan 15+ jam seminggu. Automasi e-mel, pengurusan dokumen, dan integrasi pangkalan data tanpa kod.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="#cta" class="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition">
        Mulakan 14 Hari Percubaan
      </a>
      <button class="w-full sm:w-auto px-7 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-850 transition">
        Tonton Video Demo (2 min)
      </button>
    </div>
  </section>

  <!-- Feature grid -->
  <section id="features" class="max-w-5xl mx-auto px-6 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
          ⚡
        </div>
        <h3 class="text-base font-bold text-white mb-2">Respons Segera 0.1s</h3>
        <p class="text-zinc-400 text-xs leading-relaxed">Enjin terpantas dengan latensi rendah untuk memproses data secara masa nyata.</p>
      </div>

      <div class="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
          🔒
        </div>
        <h3 class="text-base font-bold text-white mb-2">Privasi & Keselamatan Tinggi</h3>
        <p class="text-zinc-400 text-xs leading-relaxed">Data anda disulitkan hujung ke hujung mengikut piawaian keselamatan industri terkini.</p>
      </div>

      <div class="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
          📊
        </div>
        <h3 class="text-base font-bold text-white mb-2">Analitik Terbina</h3>
        <p class="text-zinc-400 text-xs leading-relaxed">Pantau pertumbuhan dan penjimatan masa pasukan anda dalam satu papan pemuka kemas.</p>
      </div>
    </div>
  </section>

  <!-- CTA Box -->
  <section id="cta" class="max-w-4xl mx-auto px-6 py-12">
    <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 text-center">
      <h2 class="text-2xl sm:text-3xl font-bold text-white mb-3">Bersedia Meningkatkan Produktiviti?</h2>
      <p class="text-zinc-400 text-xs sm:text-sm mb-6 max-w-lg mx-auto">Sertai lebih 2,500 profesional yang telah beralih ke NexusAI.</p>
      <form onsubmit="alert('Terima kasih! Kami akan hubungi anda sebentar lagi.'); return false;" class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input type="email" placeholder="Masukkan emel anda..." required
               class="flex-1 px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:outline-none focus:border-cyan-500">
        <button type="submit" class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition">
          Langgan Info
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="text-center py-8 text-xs text-zinc-600 border-t border-zinc-950">
    © 2025 NexusAI Inc. Halaman dihoskan pada PekitHost.
  </footer>
</body>
</html>`
  },
  {
    id: 'jemputan-majlis',
    title: 'Kad Jemputan Digital & RSVP',
    description: 'Kad jemputan majlis perkahwinan atau keraian dengan maklumat atur cara, butang lokasi Waze/Google Maps, dan pengesahan kehadiran.',
    category: 'Acara',
    tags: ['Kahwin', 'RSVP', 'Jemputan', 'Kad Digital'],
    htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Walimatul Urus Adam & Hawa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    .font-script { font-family: 'Alex Brush', cursive; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-stone-900 text-stone-200 min-h-screen py-10 px-4 flex justify-center">
  <div class="w-full max-w-lg bg-stone-950 border border-amber-900/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
    <!-- Top floral accent -->
    <div class="text-amber-500/70 text-2xl mb-2">❦ ❦ ❦</div>
    <div class="text-xs uppercase tracking-[0.25em] text-amber-400/80 mb-4 font-light">Undangan Walimatulurus</div>

    <div class="text-xl font-serif text-amber-200 mb-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>

    <p class="text-xs text-stone-400 mb-6 leading-relaxed">
      Dengan penuh rasa kesyukuran ke hadrat Ilahi, kami sekeluarga menjemput Dato' / Datin / Tuan / Puan / Encik / Cik ke majlis perkahwinan putera puteri kami:
    </p>

    <!-- Couple Names -->
    <div class="py-4 my-2 border-y border-amber-900/30">
      <div class="text-5xl sm:text-6xl text-amber-300 font-script mb-2">Adam Farhan</div>
      <div class="text-lg text-amber-500 font-serif italic mb-2">&</div>
      <div class="text-5xl sm:text-6xl text-amber-300 font-script">Nur Hawa Zulaikha</div>
    </div>

    <!-- Date & Venue -->
    <div class="my-6 space-y-2 text-xs">
      <div class="font-bold text-base text-white">Sabtu, 28 Jun 2025</div>
      <div class="text-stone-300">11.30 Pagi - 4.00 Petang</div>
      <div class="text-amber-400 font-medium pt-2">Dewan Perdana Felda, Jalan Maktab, Kuala Lumpur</div>
    </div>

    <!-- Navigation Buttons -->
    <div class="grid grid-cols-2 gap-3 my-6">
      <a href="https://maps.google.com" target="_blank"
         class="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition">
        📍 Google Maps
      </a>
      <a href="https://waze.com" target="_blank"
         class="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition">
        🚗 Pandu via Waze
      </a>
    </div>

    <!-- RSVP Section -->
    <div class="p-4 rounded-2xl bg-stone-900/80 border border-amber-900/30 text-left">
      <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 text-center">Pengesahan Kehadiran (RSVP)</h4>
      <form onsubmit="alert('Terima kasih atas pengesahan kehadiran anda!'); return false;" class="space-y-2">
        <input type="text" placeholder="Nama Anda" required class="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500">
        <div class="grid grid-cols-2 gap-2">
          <select class="w-full text-xs px-2 py-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 focus:outline-none">
            <option>Hadir (1 Orang)</option>
            <option>Hadir (2 Orang)</option>
            <option>Hadir Sekeluarga</option>
            <option>Tidak Dapat Hadir</option>
          </select>
          <button type="submit" class="py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition">
            Hantar RSVP
          </button>
        </div>
      </form>
    </div>

    <div class="mt-8 text-[10px] text-stone-500">
      #AdamHawaTillJannah • PekitHost Digital Invitation
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'blank-canvas',
    title: 'Halaman Kosong (Clean HTML5 Starter)',
    description: 'Templat HTML5 standard kosong yang sedia untuk anda bina atau tampal kod tersuai dari awal.',
    category: 'Asas',
    tags: ['Blank', 'HTML5', 'Custom'],
    htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaman Baharu Saya</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6">
  <div class="max-w-md w-full text-center p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
    <div class="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
      🚀
    </div>
    <h1 class="text-2xl font-bold text-white mb-2">Halaman Anda Berjaya Dibina!</h1>
    <p class="text-slate-400 text-sm mb-6">
      Tampal atau tulis sebarang kod HTML, CSS, dan JavaScript di dalam editor untuk menyesuaikan paparan ini.
    </p>
    <button onclick="alert('Tahniah! Butang interaktif anda berfungsi.')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition">
      Uji Interaksi JavaScript
    </button>
  </div>
</body>
</html>`
  }
];
