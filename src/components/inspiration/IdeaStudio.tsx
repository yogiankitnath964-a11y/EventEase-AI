import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  RefreshCw, 
  MessageSquareQuote, 
  Palette, 
  Cake, 
  Gem, 
  Trees, 
  Leaf,
  Tag
} from 'lucide-react';
import { EventDetails } from '../../types/event';
import { GeneratedIdeaItem, IdeaCategory } from '../../types/ai';
import { generateIdeasApi } from '../../services/api';
import { generateDeterministicIdeas } from '../../services/deterministicAi';

interface IdeaStudioProps {
  event: EventDetails | null;
}

export const IdeaStudio: React.FC<IdeaStudioProps> = ({ event }) => {
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory>('invitation_text');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Initialize with deterministic ideas for the current category
  const [ideas, setIdeas] = useState<GeneratedIdeaItem[]>(() =>
    generateDeterministicIdeas(
      'invitation_text',
      event?.type || 'wedding',
      event?.theme || 'Curated Celebration'
    )
  );

  const categories: { id: IdeaCategory; label: string; icon: any; desc: string }[] = [
    { id: 'invitation_text', label: 'Invitation Wording', icon: MessageSquareQuote, desc: 'Formal, poetic & witty invites' },
    { id: 'decor_concepts', label: 'Decor & Lighting', icon: Palette, desc: 'Canopies, florals & LED schemes' },
    { id: 'birthday_themes', label: 'Birthday Themes & Games', icon: Cake, desc: 'Immersive themes & party play' },
    { id: 'wedding_elements', label: 'Wedding Concepts', icon: Gem, desc: 'Vows, audio guestbooks & surprises' },
    { id: 'community_activities', label: 'Community Activities', icon: Trees, desc: 'Murals, workshops & youth stages' },
    { id: 'sustainable_hacks', label: 'Zero-Waste Hacks', icon: Leaf, desc: 'Living centerpieces & compostable flow' },
  ];

  const handleSelectCategory = (cat: IdeaCategory) => {
    setSelectedCategory(cat);
    const initial = generateDeterministicIdeas(
      cat,
      event?.type || 'wedding',
      event?.theme || 'Curated Celebration'
    );
    setIdeas(initial);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await generateIdeasApi(
        selectedCategory,
        event?.type || 'celebration',
        event?.theme,
        event?.guestCount,
        event?.city,
        additionalPrompt
      );

      if (res && res.ideas && res.ideas.length > 0) {
        setIdeas(res.ideas);
      }
    } catch (err) {
      console.warn('Idea generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            AI Creative Inspiration Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Celebration Idea Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate invitation prose, experiential concepts, and eco-friendly celebration hacks adapted to your event.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectCategory(c.id)}
                className={`p-3 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/50 text-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block leading-tight">{c.label}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">{c.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input & Trigger */}
        <form onSubmit={handleGenerate} className="pt-2 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={`Custom prompt (e.g. "We want a retro 80s arcade theme with zero plastic cutlery in ${event?.city || 'the city'}")...`}
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGenerating ? 'Generating Concepts...' : 'Generate New Ideas'}</span>
          </button>
        </form>
      </div>

      {/* Generated Ideas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft-purple hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>

                <button
                  onClick={() => handleCopy(idea.content, idx)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-700 p-1.5 rounded-lg hover:bg-purple-50 transition"
                  title="Copy text to clipboard"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {idea.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100/70">
                "{idea.content}"
              </p>

              {idea.tips && (
                <div className="text-[11px] text-brand-900 bg-brand-50/60 p-2.5 rounded-xl border border-brand-100/80">
                  <span className="font-bold">Pro Tip: </span>
                  {idea.tips}
                </div>
              )}
            </div>

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="pt-2 border-t border-purple-50 flex flex-wrap gap-1">
                {idea.tags.map((t, ti) => (
                  <span
                    key={ti}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

