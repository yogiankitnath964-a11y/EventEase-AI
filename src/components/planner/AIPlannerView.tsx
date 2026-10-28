import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  MapPin, 
  Utensils, 
  Music, 
  PiggyBank, 
  ShieldAlert, 
  RefreshCw, 
  CheckCheck, 
  Copy, 
  Check, 
  Calendar,
  Users,
  DollarSign,
  Info,
  ArrowRight
} from 'lucide-react';
import { EventDetails, EventPlan } from '../../types/event';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AIPlannerViewProps {
  event: EventDetails;
  plan: EventPlan | null;
  onRegenerate: () => Promise<void>;
  onApplyBlueprint: () => void;
  isGenerating: boolean;
  onNavigateTab: (tab: string) => void;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({
  event,
  plan,
  onRegenerate,
  onApplyBlueprint,
  isGenerating,
  onNavigateTab,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [appliedRecently, setAppliedRecently] = useState(false);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleApply = () => {
    onApplyBlueprint();
    setAppliedRecently(true);
    setTimeout(() => setAppliedRecently(false), 3000);
  };

  if (!plan) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-purple-100 p-8 space-y-4 shadow-soft-purple">
        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-brand-700 flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Blueprint Generated Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Generate a personalized AI event blueprint for "{event.name}" tailored to {event.city}, {event.guestCount} guests, and your {formatCurrency(event.totalBudget, event.currency)} budget.
        </p>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing...' : 'Generate Blueprint Now'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              EventEase Generative Blueprint
            </span>

            {plan.isAiGenerated ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Gemini AI Plan
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-brand-700 border border-purple-200" title="Deterministic high-fidelity planning engine">
                Deterministic AI Demo Plan
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{event.city}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">{formatDate(event.date)}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">{event.guestCount} Guests</span>
            <span>•</span>
            <span className="font-bold text-brand-800">
              Budget: {formatCurrency(event.totalBudget, event.currency)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={handleApply}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md active:scale-95 ${
              appliedRecently
                ? 'bg-emerald-600 shadow-emerald-600/20'
                : 'gradient-brand shadow-brand-600/25 hover:opacity-95'
            }`}
          >
            {appliedRecently ? <CheckCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{appliedRecently ? 'Blueprint Applied!' : 'Apply to Live Event'}</span>
          </button>
        </div>
      </div>

      {/* Concept Narrative Card */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-purple-950 text-white p-8 rounded-3xl shadow-xl shadow-purple-950/15 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-200">
            Executive Concept & Narrative
          </span>
          <p className="text-lg sm:text-xl font-medium text-purple-100/95 leading-relaxed">
            "{plan.concept}"
          </p>
          <div className="pt-2 text-xs text-brand-300">
            <span className="font-bold text-white">Design Motif: </span>
            {plan.themeDescription}
          </div>
        </div>
      </section>

      {/* Grid: Color Palette & Catering Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Color Palette */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900">Curated Color Palette</h3>
            </div>
            <span className="text-xs text-slate-400">Click swatch to copy HEX</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {plan.colorPalette.map((col, idx) => (
              <button
                key={idx}
                onClick={() => copyHex(col.hex)}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-200 text-left transition group"
              >
                <div
                  className="w-full h-12 rounded-xl mb-2 shadow-inner border border-black/10 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {col.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center justify-between mt-0.5">
                  <span>{col.hex}</span>
                  {copiedHex === col.hex ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-300 group-hover:text-brand-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Catering & Menu Suggestions */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900">Culinary Direction</h3>
            </div>
            <span className="text-xs font-bold text-brand-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Est. ~{formatCurrency(plan.cateringSuggestions.perGuestEstimate, event.currency)} / guest
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-bold text-brand-900 block mb-0.5">Service Style</span>
              <p className="text-slate-700">{plan.cateringSuggestions.menuStyle}</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-bold text-brand-900 block mb-0.5">Dietary Accommodation</span>
              <p className="text-slate-700">{plan.cateringSuggestions.dietaryAccommodations}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Venue Recommendations & Entertainment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Venue Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Venue Architectural Profiles</h3>
          </div>

          <div className="space-y-3">
            {plan.venueRecommendations.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface-lavender/50 border border-purple-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{v.nameType}</span>
                  <span className="font-semibold text-brand-800 bg-white px-2 py-0.5 rounded border border-purple-200">
                    {v.estimatedCostRange}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{v.suitability}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entertainment and Activities */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Entertainment & Experience Roadmap</h3>
          </div>

          <ul className="space-y-2.5">
            {plan.entertainmentAndActivities.map((act, i) => (
              <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{act}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Grid: Budget Saving Alternatives & Contingency Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Budget Saving Alternatives */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Budget-Saving Alternatives</h3>
          </div>

          <div className="space-y-2.5">
            {plan.budgetSavingAlternatives.map((alt, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{alt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contingency Plans */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">Contingency Risk Mitigations</h3>
          </div>

          <div className="space-y-3">
            {plan.contingencyPlans.map((cp, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>Risk:</span>
                  <span>{cp.risk}</span>
                </div>
                <div className="text-slate-700 pl-3 border-l-2 border-amber-300">
                  <span className="font-semibold text-slate-900">Mitigation: </span>
                  {cp.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            AI recommendations are calculated planning estimates based on your parameters. Never treat estimated numbers as legally binding vendor quotations.
          </span>
        </div>
        <button
          onClick={() => onNavigateTab('budget')}
          className="shrink-0 text-brand-800 font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>Open Budget Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

