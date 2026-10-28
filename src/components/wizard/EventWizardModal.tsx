import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Palette, 
  Utensils, 
  Check, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { CurrencyCode, EventDetails, EventType, SettingType } from '../../types/event';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: EventDetails) => Promise<void>;
  isGenerating: boolean;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('wedding');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(15000);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [theme, setTheme] = useState('Elegant Botanical Lavender');
  const [setting, setSetting] = useState<SettingType>('hybrid');
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>(['Vegetarian Options']);
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const eventTypes: { type: EventType; label: string; icon: string; desc: string }[] = [
    { type: 'wedding', label: 'Wedding', icon: '💍', desc: 'Ceremonies, banquets, and floral romance' },
    { type: 'birthday', label: 'Birthday', icon: '🎂', desc: 'Milestones, theme parties, and dynamic dance floors' },
    { type: 'community', label: 'Community', icon: '🌿', desc: 'Festivals, charity galas, and local fairs' },
    { type: 'corporate', label: 'Corporate', icon: '👔', desc: 'Conferences, networking mixers, and retreats' },
    { type: 'custom', label: 'Custom', icon: '✨', desc: 'Anniversaries, graduations, and reunions' },
  ];

  const dietaryOptions = [
    'Vegetarian Options',
    'Vegan Stalls',
    'Gluten-Free',
    'Nut-Free Safe',
    'Halal Friendly',
    'Kosher Friendly',
    'Dairy-Free',
    'Organic / Farm-to-Table',
  ];

  const themePresets: Record<EventType, string[]> = {
    wedding: ['Regal Heritage & Botanical Lavender', 'Minimalist Modern Chic', 'Rustic Tuscan Sunset', 'Fairytale Starlit Romance'],
    birthday: ['80s Synthwave & Neon Glow', 'Vintage Speakeasy Jazz', 'Tropical Sunset Oasis', 'Glamorous Hollywood Premiere'],
    community: ['Zero-Waste Harvest & Earth Fair', 'Cultural Heritage Mosaic', 'Summer Music & Food Truck Fest', 'Spring Blossom Carnival'],
    corporate: ['Future Tech & Luminary Summit', 'Nordic Minimalist Executive Forum', 'Black-Tie Innovation Gala'],
    custom: ['Golden Milestone Jubilee', 'Bohemian Sunset Gathering', 'Artisanal Wine & Tapas Soirée'],
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) errs.name = 'Please provide an event name.';
      else if (name.trim().length < 3) errs.name = 'Name should be at least 3 characters.';
    }

    if (currentStep === 2) {
      if (!date) errs.date = 'Event date is required.';
      if (!city.trim()) errs.city = 'City or location is required.';
      if (!guestCount || guestCount <= 0) errs.guestCount = 'Guest count must be at least 1.';
    }

    if (currentStep === 3) {
      if (!totalBudget || totalBudget <= 0) errs.totalBudget = 'Total budget must be greater than zero.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const toggleDietary = (opt: string) => {
    setDietaryRequirements((prev) =>
      prev.includes(opt) ? prev.filter((d) => d !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    const newEvent: EventDetails = {
      id: `event-${Date.now()}`,
      name: name.trim(),
      type,
      date,
      city: city.trim(),
      guestCount: Number(guestCount),
      totalBudget: Number(totalBudget),
      currency,
      theme: theme.trim() || 'Curated Celebration',
      setting,
      dietaryRequirements,
      additionalInstructions: additionalInstructions.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSubmit(newEvent);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close wizard"
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI Event Creator Wizard</span>
          </div>

          <h2 id="wizard-title" className="text-2xl font-black text-white mt-1">
            Design Your Celebration
          </h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Step {step} of {totalSteps}: {step === 1 && 'Event Archetype'} {step === 2 && 'Date, Location & Guests'} {step === 3 && 'Budget & Setting'} {step === 4 && 'Theme & AI Customization'}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/15 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-brand-300 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: Event Type & Name */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Event Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventTypes.map((item) => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => {
                        setType(item.type);
                        setTheme(themePresets[item.type][0] || 'Curated Celebration');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        type === item.type
                          ? 'border-brand-600 bg-brand-50/70 text-brand-950 shadow-sm ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{item.icon}</span>
                      <span className="text-sm font-bold block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="event-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Event Title or Couple/Celebrant Names *
                </label>
                <input
                  id="event-name-input"
                  type="text"
                  placeholder="e.g. Maya & Kabir's Heritage Wedding, or Alex's 25th Birthday Bash"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
                  }`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Date, City & Guest Count */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <div className="relative">
                    <input
                      id="event-date-input"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.date
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
                      }`}
                    />
                  </div>
                  {errors.date && (
                    <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="event-city-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Host City / Destination *
                  </label>
                  <div className="relative">
                    <input
                      id="event-city-input"
                      type="text"
                      placeholder="e.g. Udaipur, San Francisco, London"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="event-guest-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Estimated Guest Count *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="event-guest-input"
                    type="number"
                    min="1"
                    max="10000"
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(parseInt(e.target.value) || 0);
                      if (errors.guestCount) setErrors({ ...errors, guestCount: '' });
                    }}
                    className="w-36 px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <div className="flex gap-2">
                    {[25, 50, 100, 200, 350].map((count) => (
                      <button
                        type="button"
                        key={count}
                        onClick={() => setGuestCount(count)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          guestCount === count
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-purple-50 text-slate-700 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {count} pax
                      </button>
                    ))}
                  </div>
                </div>
                {errors.guestCount && (
                  <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.guestCount}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Budget, Currency & Setting */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="event-currency-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    id="event-currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="USD">USD ($) United States</option>
                    <option value="INR">INR (₹) Indian Rupee</option>
                    <option value="EUR">EUR (€) Euro</option>
                    <option value="GBP">GBP (£) British Pound</option>
                    <option value="CAD">CAD (CA$) Canadian Dollar</option>
                    <option value="AUD">AUD (AU$) Australian Dollar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="event-budget-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Total Event Budget ({CURRENCY_SYMBOLS[currency]}) *
                  </label>
                  <div className="relative">
                    <input
                      id="event-budget-input"
                      type="number"
                      min="100"
                      step="500"
                      value={totalBudget}
                      onChange={(e) => {
                        setTotalBudget(parseFloat(e.target.value) || 0);
                        if (errors.totalBudget) setErrors({ ...errors, totalBudget: '' });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  {errors.totalBudget && (
                    <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.totalBudget}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Atmospheric Setting
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'indoor' as SettingType, label: 'Indoor Hall/Ballroom', icon: '🏛️' },
                    { val: 'outdoor' as SettingType, label: 'Open-Air Lawn/Garden', icon: '🌳' },
                    { val: 'hybrid' as SettingType, label: 'Hybrid Courtyard/Patio', icon: '🏰' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.val}
                      onClick={() => setSetting(s.val)}
                      className={`p-3 rounded-xl border text-center transition ${
                        setting === s.val
                          ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-purple-200 text-slate-600'
                      }`}
                    >
                      <span className="text-xl block mb-1">{s.icon}</span>
                      <span className="text-xs font-bold block">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Theme, Dietary & Additional Prompt */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label htmlFor="event-theme-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Theme & Aesthetic Preference
                </label>
                <input
                  id="event-theme-input"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Royal Botanical Lavender, 80s Retro Neon, Rustic Chic"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {themePresets[type]?.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setTheme(preset)}
                      className="px-2.5 py-1 rounded-md text-[11px] bg-purple-50 hover:bg-purple-100 text-brand-800 border border-purple-200 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Food Preferences & Dietary Accommodations
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dietaryOptions.map((opt) => {
                    const isSelected = dietaryRequirements.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleDietary(opt)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="event-instructions-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Special Wishes / Instructions for AI Architect (Optional)
                </label>
                <textarea
                  id="event-instructions-input"
                  rows={2}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Include zero-waste compostable cutlery, sunset ceremony lighting, live fusion saxophone during dinner..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 focus:outline-none"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white gradient-brand hover:opacity-95 shadow-lg shadow-brand-600/30 transition active:scale-95 disabled:opacity-50 focus:outline-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing Blueprint...' : 'Generate AI Blueprint'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

