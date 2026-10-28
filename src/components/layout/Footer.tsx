import React from 'react';
import { Sparkles, Heart, Shield, Award, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-purple-100 bg-white/70 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                EventEase<span className="text-brand-600">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Plan Smarter. Celebrate Better. The modern, full-stack AI celebration planner designed for weddings, birthdays, and community gatherings. Built for Hack2Skill Challenge 5.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-brand-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                <Award className="w-3 h-3 text-brand-600" />
                Hack2Skill Challenge 5
              </span>
              <span>•</span>
              <span>Production Ready</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-brand-700 transition">AI Event Blueprint</li>
              <li className="hover:text-brand-700 transition">Budget Management & Charts</li>
              <li className="hover:text-brand-700 transition">Preparation Timeline</li>
              <li className="hover:text-brand-700 transition">Vendor Directory Tracker</li>
              <li className="hover:text-brand-700 transition">AI Creative Idea Studio</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Security & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero client API key exposure</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Deterministic offline fallback</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Strict input validation</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-purple-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} EventEase AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for celebratory excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

