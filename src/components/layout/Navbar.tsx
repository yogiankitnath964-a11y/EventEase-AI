import React, { useState } from 'react';
import { Sparkles, Calendar, PlusCircle, FolderHeart, Menu, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { EventDetails } from '../../types/event';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEvent: EventDetails | null;
  onOpenWizard: () => void;
  onOpenSavedDrawer: () => void;
  isLiveAi: boolean;
  totalSavedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeEvent,
  onOpenWizard,
  onOpenSavedDrawer,
  isLiveAi,
  totalSavedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'planner', label: 'AI Blueprint' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'inspiration', label: 'Idea Studio' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-brand-900 via-brand-700 to-purple-600 bg-clip-text text-transparent">
                  EventEase<span className="text-brand-600 font-extrabold">.AI</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-brand-600">
                  Plan Smarter. Celebrate Better.
                </span>
              </div>
            </button>

            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center">
              {isLiveAi ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini AI Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-brand-700 border border-purple-200" title="Running in deterministic AI demo mode. Add GEMINI_API_KEY to enable live cloud calls.">
                  <ShieldCheck className="w-3 h-3 text-brand-500" />
                  Deterministic AI Demo
                </span>
              )}
            </div>
          </div>

          {/* Active Event Selector Pill */}
          {activeEvent && (
            <div className="hidden md:flex items-center">
              <button
                onClick={onOpenSavedDrawer}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/70 text-slate-700 transition group text-left max-w-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                title="Click to switch or manage saved events"
              >
                <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="truncate text-xs">
                  <span className="text-slate-400 font-normal block leading-none">Active Event:</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">
                    {activeEvent.name}
                  </span>
                </div>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-white text-brand-700 font-bold border border-purple-200 shrink-0">
                  {activeEvent.city}
                </span>
              </button>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                      : 'text-slate-600 hover:text-brand-900 hover:bg-purple-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSavedDrawer}
              aria-label="View saved events"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <FolderHeart className="w-3.5 h-3.5 text-brand-600" />
              <span>Saved</span>
              <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
                {totalSavedCount}
              </span>
            </button>

            <button
              onClick={onOpenWizard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-600/25 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {activeEvent && (
            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 mb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-bold block">Current Event</span>
                <span className="text-sm font-bold text-slate-800">{activeEvent.name}</span>
              </div>
              <button
                onClick={() => {
                  onOpenSavedDrawer();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-brand-700 font-bold underline"
              >
                Switch
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition ${
                  activeTab === item.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-purple-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onOpenSavedDrawer();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold rounded-xl border border-purple-200 text-brand-800 bg-purple-50 text-center"
            >
              Saved Events ({totalSavedCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

