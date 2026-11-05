import React, { useState } from 'react';
import { User } from '../types';
import {
  Globe,
  Plus,
  Layers,
  Users,
  ChevronDown,
  RotateCcw,
  Check,
  Shield,
  User as UserIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onNavigate: (view: 'dashboard' | 'create') => void;
  currentView: 'dashboard' | 'create' | 'edit' | 'live';
  onShowPrismaModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onNavigate,
  currentView,
  onShowPrismaModal,
  onResetData,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">PekitHost</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold uppercase tracking-wider">
                  Mini-CMS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Static HTML Hosting & URL Slugs
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-800">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentView === 'dashboard'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              Papan Pemuka
            </button>
            <button
              onClick={() => onNavigate('create')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                currentView === 'create'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Halaman Baharu</span>
            </button>
            <button
              onClick={onShowPrismaModal}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-850 transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blueprint Prisma</span>
            </button>
          </nav>
        </div>

        {/* Right Section: User switcher & Fast actions */}
        <div className="flex items-center gap-3">
          {/* Quick Create Button */}
          <button
            onClick={() => onNavigate('create')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Cipta</span>
          </button>

          {/* User Profile / Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  {currentUser.role === 'ADMIN' ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  ) : (
                    <span>Pengguna</span>
                  )}
                </span>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 py-2 animate-in fade-in text-slate-100">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Tukar Akaun Pengguna (Simulasi Multi-User)
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                          user.id === currentUser.id
                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === 'ADMIN' && (
                                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] rounded font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        {user.id === currentUser.id && (
                          <Check className="w-4 h-4 text-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Reset Seed Data */}
                  <div className="p-2 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        onResetData();
                        setShowUserMenu(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition border border-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Muat Semula Data Contoh (Reset)</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
