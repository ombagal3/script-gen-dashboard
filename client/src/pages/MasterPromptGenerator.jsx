import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Compass,
  CheckCircle2,
  AlertCircle,
  FileCode,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  BookOpen,
  Megaphone,
  UserCheck,
} from 'lucide-react';
import { trendService } from '../services/trendService';
import { methodService } from '../services/methodService';
import { masterPromptService } from '../services/masterPromptService';
import { MasterPromptEditor } from '../components/trends/MasterPromptEditor';
import {
  TREND_INDUSTRIES,
  TREND_PLATFORMS,
  TREND_REGIONS,
  MODULES,
  PERSONAL_BRANDING_CATEGORIES,
  META_ADS_CATEGORIES,
  STORY_MARKETING_CATEGORIES,
  LANGUAGES,
  DURATIONS,
} from '../utils/constants';

export const MasterPromptGenerator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlTrendId = searchParams.get('trendId');
  const urlModule = searchParams.get('module');
  const urlCategory = searchParams.get('category');

  // Master Prompt Generation Form Configuration
  const [formData, setFormData] = useState({
    title: '',
    trendId: urlTrendId || '',
    customTopic: '',
    researchMode: urlTrendId ? 'Use Verified Trend Research' : 'Use My Custom Topic',
    industry: 'Finance and Taxation',
    module: urlModule || 'personal-branding',
    category: urlCategory || 'CA',
    objective: 'Authority',
    targetAudience: 'Entrepreneurs, founders, and professionals',
    region: 'India',
    platform: 'Instagram Reels',
    language: 'English',
    duration: 60,
    tone: 'Authoritative yet relatable',
    methodId: '',
    brandInfo: '',
    productOrServiceInfo: '',
    verifiedFacts: '',
    referenceUrls: '',
    restrictions: '',
    includeSources: true,
  });

  const [availableTrends, setAvailableTrends] = useState([]);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Trends and Methods
  useEffect(() => {
    const initData = async () => {
      try {
        const [trendsRes, methodsRes] = await Promise.all([
          trendService.getTrends({ limit: 40 }),
          methodService.getMethods(),
        ]);

        const tList = trendsRes.data?.trends || [];
        setAvailableTrends(tList);
        setAvailableMethods(methodsRes || []);

        if (urlTrendId) {
          const matched = tList.find((t) => t._id === urlTrendId);
          if (matched) {
            setSelectedTrend(matched);
            setFormData((prev) => ({
              ...prev,
              trendId: matched._id,
              industry: matched.industry || prev.industry,
              region: matched.region || prev.region,
              platform: matched.platform || prev.platform,
              title: `Master Prompt: ${matched.name}`,
              category:
                urlCategory ||
                matched.relevantCategories?.[0] ||
                (prev.module === 'personal-branding' ? 'CA' : 'Founder-Based Brand'),
            }));
          }
        }

        if (methodsRes?.length > 0 && !formData.methodId) {
          setFormData((prev) => ({ ...prev, methodId: methodsRes[0]._id || methodsRes[0].id }));
        }
      } catch (err) {
        console.warn('Initial load error:', err.message);
      }
    };

    initData();
  }, [urlTrendId]);

  // Handle Trend Selection
  const handleTrendSelect = (tId) => {
    if (!tId) {
      setSelectedTrend(null);
      setFormData((prev) => ({ ...prev, trendId: '' }));
      return;
    }
    const matched = availableTrends.find((t) => t._id === tId);
    if (matched) {
      setSelectedTrend(matched);
      setFormData((prev) => ({
        ...prev,
        trendId: matched._id,
        industry: matched.industry || prev.industry,
        region: matched.region || prev.region,
        category: matched.relevantCategories?.[0] || prev.category,
        title: `Master Prompt: ${matched.name}`,
      }));
    }
  };

  const getCategoriesForModule = () => {
    switch (formData.module) {
      case 'personal-branding':
        return PERSONAL_BRANDING_CATEGORIES;
      case 'meta-ads':
        return META_ADS_CATEGORIES;
      case 'story-marketing':
        return STORY_MARKETING_CATEGORIES;
      default:
        return [
          ...PERSONAL_BRANDING_CATEGORIES,
          ...META_ADS_CATEGORIES,
          ...STORY_MARKETING_CATEGORIES,
        ];
    }
  };

  // Generate Master Prompt
  const handleGeneratePrompt = async (e) => {
    if (e) e.preventDefault();

    if (formData.researchMode === 'Use My Custom Topic' && !formData.customTopic.trim()) {
      showToast('Please enter your custom topic or select an existing trend', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedMethodObj = availableMethods.find(
        (m) => (m._id || m.id) === formData.methodId
      );

      const payload = {
        ...formData,
        methodName: selectedMethodObj?.name || 'Hook → Problem → Explanation → Solution → CTA',
        referenceUrls: formData.referenceUrls
          ? formData.referenceUrls.split('\n').filter((u) => u.trim().length > 0)
          : [],
      };

      const result = await masterPromptService.generateMasterPrompt(payload);
      setGeneratedPrompt(result);
      showToast('Master prompt synthesized with all 12 sections successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to generate master prompt', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save prompt content update
  const handleSavePrompt = async (updatedContent) => {
    if (!generatedPrompt?._id) return;
    setIsSaving(true);
    try {
      const updated = await masterPromptService.updateMasterPrompt(generatedPrompt._id, {
        promptContent: updatedContent,
      });
      setGeneratedPrompt(updated);
      showToast('Master prompt updated and new version saved');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate Script Directly from this Master Prompt
  const handleGenerateScript = async (promptId) => {
    const idToUse = promptId || generatedPrompt?._id;
    if (!idToUse) {
      showToast('Please generate or save a master prompt first', 'error');
      return;
    }

    setIsGeneratingScript(true);
    try {
      const result = await masterPromptService.generateScriptFromPrompt(idToUse);
      showToast('Script successfully generated from prompt and saved to library!');
      // Navigate to saved scripts with highlight
      setTimeout(() => {
        navigate('/saved-scripts');
      }, 1200);
    } catch (err) {
      showToast(err.message || 'Script generation from prompt failed', 'error');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const categories = getCategoriesForModule();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-white dark:bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-white" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> 12-Section Strategic Prompt Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Master Prompt Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            Synthesize verified market trends, audience psychology, writing frameworks, and quality
            controls into a copy-ready master prompt to generate exceptional scripts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/saved-master-prompts')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-colors self-start md:self-auto"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>View Saved Master Prompts</span>
        </button>
      </div>

      {/* Configuration Form */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Input Configuration & Strategic Context
          </h2>
          <span className="text-xs text-slate-400">Customized by Category & Method</span>
        </div>

        <form onSubmit={handleGeneratePrompt} className="space-y-5 text-xs">
          {/* Research Mode Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Strategic Research Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Use Verified Trend Research', label: 'Use Verified Trend Research' },
                { id: 'Use My Custom Topic', label: 'Use My Custom Topic' },
                { id: 'Combine Research and Custom Topic', label: 'Combine Research & Custom Topic' },
              ].map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setFormData({ ...formData, researchMode: mode.id })}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                    formData.researchMode === mode.id
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-600 dark:text-indigo-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Discovered Trend OR Type Custom Topic */}
          {formData.researchMode !== 'Use My Custom Topic' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Researched Trend from Database:
              </label>
              <select
                value={formData.trendId}
                onChange={(e) => handleTrendSelect(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                <option value="">-- Choose a researched trend ({availableTrends.length} available) --</option>
                {availableTrends.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.industry} • Score: {t.opportunityScore}/100 • {t.source})
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.researchMode !== 'Use Verified Trend Research' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Custom Topic / Core Subject Angle: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Navigating Corporate Tax Audits Without Panic"
                value={formData.customTopic}
                onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              />
            </div>
          )}

          {/* Module, Category, Objective */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Script Module <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.module}
                onChange={(e) => {
                  const newMod = e.target.value;
                  const newCat =
                    newMod === 'personal-branding'
                      ? 'CA'
                      : newMod === 'meta-ads'
                      ? 'Founder-Based Brand'
                      : 'Story Default';
                  setFormData({ ...formData, module: newMod, category: newCat });
                }}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Content Objective <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Industry, Region, Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {TREND_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Region (Default: India)
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {TREND_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {TREND_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration, Language, Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Script Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Selected Script Method
              </label>
              <select
                value={formData.methodId}
                onChange={(e) => setFormData({ ...formData, methodId: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              >
                {availableMethods.map((m) => (
                  <option key={m._id || m.id} value={m._id || m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verified Facts & Reference URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Verified Facts & Evidence to Include
              </label>
              <textarea
                rows={2}
                placeholder="Include official statistics, case study metrics, or specific numbers to prove authenticity..."
                value={formData.verifiedFacts}
                onChange={(e) => setFormData({ ...formData, verifiedFacts: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reference URLs (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="https://...&#10;https://..."
                value={formData.referenceUrls}
                onChange={(e) => setFormData({ ...formData, referenceUrls: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Checkbox: Include Sources */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="includeSources"
              checked={formData.includeSources}
              onChange={(e) => setFormData({ ...formData, includeSources: e.target.checked })}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="includeSources" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Embed verified trend references, observed metrics, and source URLs directly in prompt brief
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'Synthesizing 12-Section Master Prompt...'
                  : 'Generate Category-Specific Master Prompt'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Master Prompt Output Editor */}
      {generatedPrompt && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Generated Master Prompt (12 Complete Sections)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Ready for AI Execution
            </span>
          </div>

          <MasterPromptEditor
            masterPrompt={generatedPrompt}
            onSave={handleSavePrompt}
            onRegenerate={handleGeneratePrompt}
            onGenerateScript={handleGenerateScript}
            isGeneratingScript={isGeneratingScript}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
};
