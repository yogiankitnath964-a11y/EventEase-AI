import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Trash2, 
  Check, 
  Plus, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EventDetails } from '../../types/event';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SavedEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventDetails[];
  activeEventId: string | null;
  onSelectEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onOpenWizard: () => void;
  onResetSampleData: () => void;
}

export const SavedEventsDrawer: React.FC<SavedEventsDrawerProps> = ({
  isOpen,
  onClose,
  events,
  activeEventId,
  onSelectEvent,
  onDeleteEvent,
  onOpenWizard,
  onResetSampleData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-events-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-purple-100 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-purple-100 bg-surface-lavender/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Saved Event Vault</span>
            </div>
            <h2 id="saved-events-title" className="text-xl font-black text-slate-900 mt-1">
              Your Celebrations ({events.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close saved events drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event List Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {events.map((ev) => {
            const isActive = ev.id === activeEventId;

            return (
              <div
                key={ev.id}
                onClick={() => {
                  onSelectEvent(ev.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer relative group ${
                  isActive
                    ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-white px-2 py-0.5 rounded border border-purple-200 inline-block">
                      {ev.type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-900 transition">
                      {ev.name}
                    </h3>
                  </div>

                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-purple-50 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
                    <span className="truncate">{ev.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-600 shrink-0" />
                    <span>{formatDate(ev.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-brand-600 shrink-0" />
                    <span>{ev.guestCount} guests</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <DollarSign className="w-3 h-3 text-brand-600 shrink-0" />
                    <span>{formatCurrency(ev.totalBudget, ev.currency)}</span>
                  </div>
                </div>

                {/* Delete button (only show on hover or focus, cannot delete if only 1 event) */}
                {events.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete celebration "${ev.name}"?`)) {
                        onDeleteEvent(ev.id);
                      }
                    }}
                    aria-label={`Delete event ${ev.name}`}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Actions Footer */}
        <div className="p-6 border-t border-purple-100 bg-surface-lavender/30 space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenWizard();
            }}
            className="w-full py-3 rounded-2xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Celebration</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset to default preloaded sample events (Wedding, Birthday, Community Festival)?')) {
                onResetSampleData();
              }
            }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reload Evaluation Sample Archetypes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

