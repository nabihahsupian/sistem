import { Page, User } from '../types';
import { STARTER_TEMPLATES } from './templates';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_nabihah',
    name: 'Nabihah Supian',
    email: 'nabihahsupian@gmail.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'user_khairul',
    name: 'Khairul Anwar',
    email: 'khairul.dev@gmail.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'admin_root',
    name: 'Super Admin',
    email: 'admin@pekithost.local',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  },
];

const INITIAL_PAGES: Page[] = [
  {
    id: 'page_1',
    title: 'Kempen Raya Bergaya 2025',
    slug: 'kempen-raya',
    htmlContent: STARTER_TEMPLATES[0].htmlContent,
    isPublished: true,
    userId: 'user_nabihah',
    authorName: 'Nabihah Supian',
    views: 342,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    description: 'Promosi jualan Aidilfitri baju melayu dan kurung moden dengan tempahan WhatsApp pantas.',
  },
  {
    id: 'page_2',
    title: 'Kad Profil Digital & Bio Links',
    slug: 'biodata-nabihah',
    htmlContent: STARTER_TEMPLATES[1].htmlContent,
    isPublished: true,
    userId: 'user_nabihah',
    authorName: 'Nabihah Supian',
    views: 189,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    description: 'Pautan bio mudah alih dengan rangkaian media sosial, portfolio dan WhatsApp.',
  },
  {
    id: 'page_3',
    title: 'NexusAI Smart Platform Launch',
    slug: 'nexus-ai',
    htmlContent: STARTER_TEMPLATES[2].htmlContent,
    isPublished: true,
    userId: 'user_khairul',
    authorName: 'Khairul Anwar',
    views: 520,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    description: 'Laman web pelancaran produk automasi pintar untuk usahawan moden.',
  },
  {
    id: 'page_4',
    title: 'Jemputan Walimatulurus Adam & Hawa',
    slug: 'jemputan-adam-hawa',
    htmlContent: STARTER_TEMPLATES[3].htmlContent,
    isPublished: false, // Draf
    userId: 'user_nabihah',
    authorName: 'Nabihah Supian',
    views: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    description: 'Kad jemputan kahwin digital dengan borang RSVP dan integrasi Google Maps/Waze.',
  },
];

const STORAGE_KEYS = {
  PAGES: 'pekithost_pages_v1',
  USERS: 'pekithost_users_v1',
  ACTIVE_USER_ID: 'pekithost_active_user_v1',
};

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function getActiveUser(): User {
  try {
    const users = getStoredUsers();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    const found = users.find((u) => u.id === activeId);
    if (found) return found;
    // Default to Nabihah
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, INITIAL_USERS[0].id);
    return INITIAL_USERS[0];
  } catch {
    return INITIAL_USERS[0];
  }
}

export function setActiveUser(userId: string): User {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  return getActiveUser();
}

export function getStoredPages(): Page[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_PAGES));
      return INITIAL_PAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PAGES;
  } catch {
    return INITIAL_PAGES;
  }
}

export function savePages(pages: Page[]): void {
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
}

export function getPageBySlug(slug: string): Page | undefined {
  const pages = getStoredPages();
  return pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getPageById(id: string): Page | undefined {
  const pages = getStoredPages();
  return pages.find((p) => p.id === id);
}

export function createPage(pageData: {
  title: string;
  slug: string;
  htmlContent: string;
  isPublished: boolean;
  description?: string;
}): { success: boolean; error?: string; page?: Page } {
  const cleanSlug = slugify(pageData.slug);
  if (!cleanSlug) {
    return { success: false, error: 'Slug URL tidak sah atau kosong.' };
  }

  const pages = getStoredPages();
  if (pages.some((p) => p.slug.toLowerCase() === cleanSlug.toLowerCase())) {
    return { success: false, error: `Slug "${cleanSlug}" telah digunakan. Sila pilih slug lain.` };
  }

  const currentUser = getActiveUser();
  const now = new Date().toISOString();

  const newPage: Page = {
    id: 'page_' + Math.random().toString(36).substring(2, 9),
    title: pageData.title.trim(),
    slug: cleanSlug,
    htmlContent: pageData.htmlContent,
    isPublished: pageData.isPublished,
    userId: currentUser.id,
    authorName: currentUser.name,
    views: 0,
    createdAt: now,
    updatedAt: now,
    description: pageData.description || 'Halaman kustom dihoskan di PekitHost',
  };

  const updatedPages = [newPage, ...pages];
  savePages(updatedPages);
  return { success: true, page: newPage };
}

export function updatePage(
  id: string,
  pageData: {
    title: string;
    slug: string;
    htmlContent: string;
    isPublished: boolean;
    description?: string;
  }
): { success: boolean; error?: string; page?: Page } {
  const cleanSlug = slugify(pageData.slug);
  if (!cleanSlug) {
    return { success: false, error: 'Slug URL tidak sah atau kosong.' };
  }

  const pages = getStoredPages();
  const existing = pages.find((p) => p.id === id);
  if (!existing) {
    return { success: false, error: 'Halaman tidak ditemui dalam pangkalan data.' };
  }

  // Check unique slug across other pages
  const slugConflict = pages.find(
    (p) => p.id !== id && p.slug.toLowerCase() === cleanSlug.toLowerCase()
  );
  if (slugConflict) {
    return { success: false, error: `Slug "${cleanSlug}" telah digunakan oleh halaman lain.` };
  }

  const now = new Date().toISOString();
  const updatedPage: Page = {
    ...existing,
    title: pageData.title.trim(),
    slug: cleanSlug,
    htmlContent: pageData.htmlContent,
    isPublished: pageData.isPublished,
    description: pageData.description || existing.description,
    updatedAt: now,
  };

  const updatedList = pages.map((p) => (p.id === id ? updatedPage : p));
  savePages(updatedList);
  return { success: true, page: updatedPage };
}

export function deletePage(id: string): boolean {
  const pages = getStoredPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length !== pages.length) {
    savePages(filtered);
    return true;
  }
  return false;
}

export function togglePagePublish(id: string): Page | null {
  const pages = getStoredPages();
  let updated: Page | null = null;
  const updatedList = pages.map((p) => {
    if (p.id === id) {
      updated = {
        ...p,
        isPublished: !p.isPublished,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }
    return p;
  });

  if (updated) {
    savePages(updatedList);
  }
  return updated;
}

export function incrementViews(slug: string): void {
  const pages = getStoredPages();
  const updatedList = pages.map((p) => {
    if (p.slug.toLowerCase() === slug.toLowerCase()) {
      return { ...p, views: (p.views || 0) + 1 };
    }
    return p;
  });
  savePages(updatedList);
}

export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_PAGES));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, INITIAL_USERS[0].id);
}
