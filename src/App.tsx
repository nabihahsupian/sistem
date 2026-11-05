/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Page, User } from './types';
import {
  getStoredPages,
  getStoredUsers,
  getActiveUser,
  setActiveUser,
  deletePage,
  togglePagePublish,
  resetToDefaults,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PageEditor } from './components/PageEditor';
import { LivePageViewer } from './components/LivePageViewer';
import { QrCodeModal } from './components/QrCodeModal';
import { PrismaDocsModal } from './components/PrismaDocsModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [pages, setPages] = useState<Page[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(getActiveUser());
  
  // Navigation views: 'dashboard' | 'create' | 'edit' | 'live'
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'edit' | 'live'>('dashboard');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Modals
  const [qrModalPage, setQrModalPage] = useState<Page | null>(null);
  const [showPrismaModal, setShowPrismaModal] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state from storage
  const refreshData = () => {
    const loadedPages = getStoredPages();
    const loadedUsers = getStoredUsers();
    setPages(loadedPages);
    setUsers(loadedUsers);
    setCurrentUser(getActiveUser());
  };

  useEffect(() => {
    refreshData();

    // Check initial hash for direct link navigation (e.g. #/p/kempen-raya, #/dashboard/create, #/dashboard/edit/:id)
    const handleHashChange = () => {
      const hash = window.location.hash;
      const matchLive = hash.match(/^#\/?p\/([^/?#]+)/);
      const matchEdit = hash.match(/^#\/?dashboard\/edit\/([^/?#]+)/);
      const matchCreate = hash.match(/^#\/?dashboard\/create/);

      if (matchLive && matchLive[1]) {
        setActiveSlug(matchLive[1]);
        setCurrentView('live');
      } else if (matchEdit && matchEdit[1]) {
        setEditingPageId(matchEdit[1]);
        setCurrentView('edit');
      } else if (matchCreate) {
        setEditingPageId(null);
        setCurrentView('create');
      } else {
        setCurrentView('dashboard');
        setActiveSlug(null);
        setEditingPageId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle switching user
  const handleSelectUser = (user: User) => {
    setActiveUser(user.id);
    setCurrentUser(user);
    showToast(`Beralih kepada akaun: ${user.name} (${user.role})`);
  };

  // Handle navigation
  const navigateTo = (view: 'dashboard' | 'create') => {
    if (view === 'dashboard') {
      window.location.hash = 'dashboard';
      setCurrentView('dashboard');
      setEditingPageId(null);
      setActiveSlug(null);
    } else {
      window.location.hash = 'dashboard/create';
      setEditingPageId(null);
      setCurrentView('create');
    }
    refreshData();
  };

  const handleEditPage = (id: string) => {
    window.location.hash = `dashboard/edit/${id}`;
    setEditingPageId(id);
    setCurrentView('edit');
  };

  const handleOpenLive = (slug: string) => {
    window.location.hash = `p/${slug}`;
    setActiveSlug(slug);
    setCurrentView('live');
  };

  const handleDeletePage = (id: string) => {
    const page = pages.find((p) => p.id === id);
    const success = deletePage(id);
    if (success) {
      refreshData();
      showToast(`Halaman "${page?.title || id}" berjaya dipadam.`);
    }
  };

  const handleTogglePublish = (id: string) => {
    const updated = togglePagePublish(id);
    if (updated) {
      refreshData();
      showToast(
        updated.isPublished
          ? `Halaman "${updated.title}" kini Diterbitkan secara umum!`
          : `Halaman "${updated.title}" kini disimpan sebagai Draf.`
      );
    }
  };

  const handleSavedPage = (slug: string) => {
    refreshData();
    showToast(`Halaman "${slug}" berjaya disimpan!`);
    window.location.hash = 'dashboard';
    setCurrentView('dashboard');
    setEditingPageId(null);
  };

  const handleResetData = () => {
    resetToDefaults();
    refreshData();
    showToast('Data contoh telah berjaya dimuatkan semula.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-indigo-500/30 text-white text-xs shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Conditionally render Navbar (hide in live view for clean iframe presentation) */}
      {currentView !== 'live' && (
        <Navbar
          currentUser={currentUser}
          allUsers={users}
          onSelectUser={handleSelectUser}
          onNavigate={navigateTo}
          currentView={currentView}
          onShowPrismaModal={() => setShowPrismaModal(true)}
          onResetData={handleResetData}
        />
      )}

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'dashboard' && (
          <Dashboard
            pages={pages}
            currentUser={currentUser}
            onNewPage={() => navigateTo('create')}
            onEditPage={handleEditPage}
            onDeletePage={handleDeletePage}
            onOpenLive={handleOpenLive}
            onOpenQr={(page) => setQrModalPage(page)}
            onTogglePublish={handleTogglePublish}
            onShowPrismaModal={() => setShowPrismaModal(true)}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <PageEditor
            pageIdToEdit={editingPageId}
            currentUser={currentUser}
            onSaved={handleSavedPage}
            onCancel={() => navigateTo('dashboard')}
            onOpenLive={handleOpenLive}
          />
        )}

        {currentView === 'live' && activeSlug && (
          <LivePageViewer
            slug={activeSlug}
            currentUser={currentUser}
            onBackToDashboard={() => navigateTo('dashboard')}
            onOpenQr={(page) => setQrModalPage(page)}
          />
        )}
      </main>

      {/* QR Code Modal */}
      <QrCodeModal
        page={qrModalPage}
        isOpen={Boolean(qrModalPage)}
        onClose={() => setQrModalPage(null)}
        onOpenLive={handleOpenLive}
      />

      {/* Prisma & Architecture Docs Modal */}
      <PrismaDocsModal
        isOpen={showPrismaModal}
        onClose={() => setShowPrismaModal(false)}
      />
    </div>
  );
}
