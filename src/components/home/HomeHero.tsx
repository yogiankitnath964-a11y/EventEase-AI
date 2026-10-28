import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PieChart, 
  CalendarClock, 
  Users, 
  HeartHandshake, 
  Lightbulb, 
  CheckCircle2, 
  Gem,
  Cake,
  Trees,
  ShieldCheck,
  TrendingUp,
  MapPin,
  DollarSign
} from 'lucide-react';
import { EventDetails } from '../../types/event';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/formatters';

interface HomeHeroProps {
  onOpenWizard: () => void;
  onNavigateTab: (tab: string) => void;
  activeEvent: EventDetails | null;
  onSelectSampleEvent: (id: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpenWizard,
  onNavigateTab,
  activeEvent,
  onSelectSampleEvent,
}) => {
  return (
    <div className="space-y-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-900 via-brand-800 to-purple-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-purple-950/20 border border-purple-500/20">
        
        {/* Subtle Background Glow Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-purple-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Hack2Skill Challenge 5 • Generative Event AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Plan Smarter. <br />
            <span className="bg-gradient-to-r from-purple-200 via-brand-200 to-white bg-clip-text text-transparent">
              Celebrate Better.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed max-w-2xl font-normal">
            Effortlessly architect weddings, milestone birthdays, and community festivals. EventEase AI weaves generative blueprints, dynamic category budgets, date-aware timelines, and vendor trackers into one seamless canvas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenWizard}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white text-brand-950 hover:bg-brand-50 shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Launch Event Creator Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('planner')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all focus:outline-none"
            >
              <span>View Current Event Blueprint</span>
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-300 shrink-0" />
              <span className="text-purple-100">AI Concept & Theme</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-300 shrink-0" />
              <span className="text-purple-100">Dynamic Budget Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-300 shrink-0" />
              <span className="text-purple-100">Date-Aware Checklist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-300 shrink-0" />
              <span className="text-purple-100">Vendor Tracker Hub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Event Snapshot Card */}
      {activeEvent && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-soft-purple space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-50 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                Active Event in Focus
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {activeEvent.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {activeEvent.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <CalendarClock className="w-3.5 h-3.5 text-brand-600" />
                  {formatDate(activeEvent.date)} ({getDaysRemaining(activeEvent.date)} days away)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-brand-600" />
                  {activeEvent.guestCount} Guests
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-brand-800">
                  <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                  Budget: {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('planner')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
              >
                Inspect AI Blueprint
              </button>
              <button
                onClick={() => onNavigateTab('budget')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
              >
                Manage Budget
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => onNavigateTab('budget')}
              className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Budget Allocation</span>
                <PieChart className="w-4 h-4 text-brand-600 group-hover:scale-110 transition" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visualized with category donut breakdown & over-budget alerts.
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('timeline')}
              className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Preparation Timeline</span>
                <CalendarClock className="w-4 h-4 text-brand-600 group-hover:scale-110 transition" />
              </div>
              <div className="text-xl font-black text-slate-900">
                Date-Aware Tasks
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Automated due dates relative to {formatDate(activeEvent.date)}.
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('vendors')}
              className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Vendor Directory</span>
                <HeartHandshake className="w-4 h-4 text-brand-600 group-hover:scale-110 transition" />
              </div>
              <div className="text-xl font-black text-slate-900">
                Bookings & Status
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Track catering, venue, photo, and music quotes in one place.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Competition Showcase / Preloaded Sample Events */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Competition Evaluation Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Explore Preloaded Event Archetypes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Switch between complete, pre-configured events to test budgets, timelines, and AI recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Royal Garden Wedding */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-purple-100 shadow-soft-purple hover:shadow-lg hover:border-purple-300 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-700 flex items-center justify-center font-bold">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Wedding Celebration
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Aanya & Rohan's Royal Garden Wedding
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jaipur haveli hybrid ceremony with 180 guests, botanical lavender aesthetic, and $35,000 budget.
                </p>
              </div>

              <div className="pt-2 border-t border-purple-50 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-slate-800">$35,000 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guests:</span>
                  <span className="font-semibold text-slate-800">180 attendees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Setting:</span>
                  <span className="font-semibold text-slate-800">Hybrid Lawn & Courtyard</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectSampleEvent('event-wedding-royal-garden')}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-brand-900 bg-purple-50 group-hover:bg-brand-600 group-hover:text-white border border-purple-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Load & Explore Wedding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: 30th Birthday Loft */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-purple-100 shadow-soft-purple hover:shadow-lg hover:border-purple-300 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Cake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Birthday Milestone
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Liam's 30th Retro Neon Birthday
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Austin warehouse loft with 45 guests, 80s arcade tournament, neon glow decor, and $4,500 budget.
                </p>
              </div>

              <div className="pt-2 border-t border-purple-50 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-slate-800">$4,500 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guests:</span>
                  <span className="font-semibold text-slate-800">45 attendees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Setting:</span>
                  <span className="font-semibold text-slate-800">Indoor Warehouse Loft</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectSampleEvent('event-birthday-retro-neon')}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-rose-900 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white border border-rose-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Load & Explore Birthday</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Community Harvest Festival */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-purple-100 shadow-soft-purple hover:shadow-lg hover:border-purple-300 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Community Gathering
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Green Meadows Earth Day & Harvest Fair
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Portland outdoor park meadow with 350 attendees, solar sound stage, zero-waste food stalls, $12,500 budget.
                </p>
              </div>

              <div className="pt-2 border-t border-purple-50 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-slate-800">$12,500 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guests:</span>
                  <span className="font-semibold text-slate-800">350 attendees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Setting:</span>
                  <span className="font-semibold text-slate-800">Outdoor Meadow Pavilion</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectSampleEvent('event-comm-harvest-festival')}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Load & Explore Community Fair</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Feature Walkthrough Grid */}
      <section className="bg-surface-lavender/50 rounded-3xl p-8 sm:p-12 border border-purple-100 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            End-to-End Orchestration
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Engineered for Flawless Celebrations
          </h2>
          <p className="text-sm text-slate-500">
            Every feature connects intelligently: when your guest count or budget changes, your catering recommendations, timelines, and checklists adapt accordingly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">1. Generative AI Blueprint</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Produces bespoke design concepts, hex color swatches, venue requirements, entertainment roadmaps, and contingency plans.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">2. Real-Time Expense Ledger</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recharts donut and bar distributions with instant over-budget triggers and practical category-based cost savings suggestions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">3. AI Creative Studio</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates witty or heartfelt invitation wording, unique lighting setups, birthday party games, and sustainable zero-waste celebration hacks.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

