import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Zap,
  Play,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Camera,
  Film,
  FileCode,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Video,
  Eye,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productAutoScriptService } from '../services/productAutoScriptService';
import { scriptService } from '../services/scriptService';
import { LANGUAGES } from '../utils/constants';

export const ProductAutoScript = () => {
  // Form State
  const [productName, setProductName] = useState('');
  const [autoScriptEnabled, setAutoScriptEnabled] = useState(true);
  const [module, setModule] = useState('personal-branding');
  const [platform, setPlatform] = useState('Instagram Reels');
  const [targetMarket, setTargetMarket] = useState('India');
  const [language, setLanguage] = useState('English');
  const [dateRange, setDateRange] = useState('Last 7 Days');

  // Optional Product Details
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [benefits, setBenefits] = useState('');
  const [painPoints, setPainPoints] = useState('');

  // Execution & Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationStepMessage, setGenerationStepMessage] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Result State
  const [activeTab, setActiveTab] = useState('script'); // 'script' | 'prompt' | 'research' | 'history'
  const [resultData, setResultData] = useState(null);
  const [selectedHookText, setSelectedHookText] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Clipboard & Saving State
  const [copiedKey, setCopiedKey] = useState(null);
  const [isSavingScript, setIsSavingScript] = useState(false);
  const [isRegeneratingHook, setIsRegeneratingHook] = useState(false);
  const [isGeneratingAltAngle, setIsGeneratingAltAngle] = useState(false);

  // Debounce ref
  const debounceTimerRef = useRef(null);
  const lastExecutedConfigRef = useRef('');

  // Load defaults from saved user strategy on mount
  useEffect(() => {
    loadDefaults();
    loadHistory();
  }, []);

  const loadDefaults = async () => {
    try {
      const defaults = await productAutoScriptService.getDefaults();
      if (defaults) {
        if (defaults.targetMarket) setTargetMarket(defaults.targetMarket);
        if (defaults.language) setLanguage(defaults.language);
        if (defaults.platform) setPlatform(defaults.platform);
      }
    } catch {
      // Non-fatal
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await productAutoScriptService.getHistory({ limit: 8 });
      setHistoryItems(res.items || []);
    } catch {
      // Non-fatal
    } finally {
      setLoadingHistory(false);
    }
  };

  // Debounced AutoScript trigger when switch is ON
  useEffect(() => {
    if (!autoScriptEnabled) return;
    if (!productName || productName.trim().length < 3) return;

    const currentConfig = `${productName.trim()}|${module}|${platform}|${targetMarket}|${language}`;
    if (currentConfig === lastExecutedConfigRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      handleExecuteGeneration();
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [productName, autoScriptEnabled, module, platform, targetMarket, language]);

  const handleExecuteGeneration = async (overridePayload = null) => {
    const nameToUse = overridePayload?.productName || productName;
    if (!nameToUse || !nameToUse.trim()) {
      setError('Please enter a valid product name');
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    setGenerationStep(1);
    setGenerationStepMessage('Formulating search queries across product, category, benefits, and objections...');

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev === 1) {
          setGenerationStepMessage('Polling real market signals (Google Trends, Web, Meta Ads, YouTube)...');
          return 2;
        }
        if (prev === 2) {
          setGenerationStepMessage('Analyzing relevant video hooks, formats, visual framing, and CTAs...');
          return 3;
        }
        if (prev === 3) {
          setGenerationStepMessage('Synthesizing original 12-section Master Prompt with verified context...');
          return 4;
        }
        if (prev === 4) {
          setGenerationStepMessage('Generating production script, scenes, camera angles, and B-roll via Gemini...');
          return 5;
        }
        return prev;
      });
    }, 1400);

    try {
      const payload = overridePayload || {
        productName: nameToUse.trim(),
        productUrl,
        description,
        price,
        benefits,
        painPoints,
        module,
        platform,
        targetMarket,
        language,
        dateRange,
        autoScriptEnabled,
      };

      const res = await productAutoScriptService.generateAutoScript(payload);

      clearInterval(stepInterval);
      setGenerationStep(5);
      setGenerationStepMessage('AutoScript generation completed successfully!');

      setResultData(res);
      setSelectedHookText(
        res.autoScript?.generatedScript?.recommendedHook ||
        res.autoScript?.generatedScript?.hookOptions?.[0]?.hookText ||
        ''
      );

      lastExecutedConfigRef.current = `${nameToUse.trim()}|${module}|${platform}|${targetMarket}|${language}`;
      setSuccessMessage(`AutoScript generated for "${nameToUse.trim()}" in ${language}!`);

      // Refresh history in background
      loadHistory();
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'AutoScript generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRegenerateHook = async () => {
    if (!resultData?.autoScript?._id) return;
    try {
      setIsRegeneratingHook(true);
      const res = await productAutoScriptService.regenerateHook(resultData.autoScript._id);
      if (res?.hookOptions) {
        setResultData((prev) => ({
          ...prev,
          autoScript: {
            ...prev.autoScript,
            generatedScript: {
              ...prev.autoScript.generatedScript,
              hookOptions: res.hookOptions,
              recommendedHook: res.recommendedHook,
            },
          },
        }));
        setSelectedHookText(res.recommendedHook);
        setSuccessMessage('Fresh hooks generated via AI!');
      }
    } catch (err) {
      setError(err.message || 'Failed to regenerate hooks');
    } finally {
      setIsRegeneratingHook(false);
    }
  };

  const handleGenerateAnotherAngle = async () => {
    if (!resultData?.autoScript?._id) return;
    try {
      setIsGeneratingAltAngle(true);
      const res = await productAutoScriptService.generateAlternativeAngle(resultData.autoScript._id);
      setResultData(res);
      setSelectedHookText(res.autoScript?.generatedScript?.recommendedHook || '');
      setSuccessMessage('Alternative angle & script generated!');
    } catch (err) {
      setError(err.message || 'Failed to generate alternative angle');
    } finally {
      setIsGeneratingAltAngle(false);
    }
  };

  const handleSaveScript = async () => {
    if (!resultData?.script?._id) return;
    try {
      setIsSavingScript(true);
      await scriptService.updateScript(resultData.script._id, {
        hook: selectedHookText,
        status: 'Ready',
      });
      setSuccessMessage('Script saved to your Saved Scripts library!');
    } catch (err) {
      setError(err.message || 'Failed to save script');
    } finally {
      setIsSavingScript(false);
    }
  };

  const handleExportText = () => {
    if (!resultData?.autoScript) return;
    const script = resultData.autoScript.generatedScript;
    const content = `================================================================================
PRODUCT AUTOSCRIPT: ${resultData.autoScript.productName.toUpperCase()}
MODULE: ${resultData.autoScript.module.toUpperCase()} | PLATFORM: ${resultData.autoScript.platform}
LANGUAGE: ${resultData.autoScript.language} | TARGET MARKET: ${resultData.autoScript.targetMarket}
================================================================================

--- HOOK OPTIONS ---
${(script.hookOptions || []).map((h, i) => `${i + 1}. [${h.type}] ${h.hookText}\n   Why it works: ${h.whyItWorks}`).join('\n\n')}

--- RECOMMENDED HOOK ---
${selectedHookText || script.recommendedHook}

--- SPOKEN SCRIPT ---
${script.spokenScript}

--- SCENE-BY-SCENE SHOOTING INSTRUCTIONS ---
Camera Framing: ${script.shootingInstructions?.cameraFraming || 'Vertical 9:16'}
Lighting: ${script.shootingInstructions?.lighting || 'Natural key light'}
Wardrobe: ${script.shootingInstructions?.wardrobe || 'Clean neutral attire'}

Scenes:
${(script.shootingInstructions?.scenes || [])
  .map(
    (s) =>
      `[Scene ${s.sceneNumber}] (${s.shotType} • ${s.durationSeconds}s)\n Action: ${s.visualAction}\n Dialogue: ${s.dialogue}`
  )
  .join('\n\n')}

--- VIDEO EDITING BLUEPRINT ---
Cuts & Pacing: ${script.editingInstructions?.cutsAndPacing || 'Fast tight cuts'}
Caption Style: ${script.editingInstructions?.captionStyle || 'Bold animated captions'}
On-Screen Text Overlays:
${(script.editingInstructions?.onScreenText || []).join('\n')}

--- UPLOAD PACKAGE ---
Caption:
${script.uploadPackage?.caption}

Hashtags: ${(script.uploadPackage?.hashtags || []).join(' ')}
Cover Title: ${script.uploadPackage?.coverTitle || resultData.autoScript.productName}
Best Publishing Time: ${script.uploadPackage?.suggestedPublishingTime || 'Peak vernacular window'}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resultData.autoScript.productName.replace(/\s+/g, '_')}_autoscript.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!resultData?.autoScript) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resultData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${resultData.autoScript.productName.replace(/\s+/g, '_')}_autoscript.json`);
    link.click();
  };

  const handleLoadDemoProduct = (name, mod, lang) => {
    setProductName(name);
    setModule(mod);
    setLanguage(lang);
    setPrice('₹1,499');
    setBenefits('Saves 4 hours weekly, premium build quality, 30-day money-back guarantee');
    setPainPoints('Cheap alternatives break within weeks, complicated setup, poor customer service');
    setDescription(`Top-tier ${name.toLowerCase()} built specifically for modern creators and busy professionals.`);
  };

  const scriptOutput = resultData?.autoScript?.generatedScript;
  const masterPromptOutput = resultData?.masterPrompt;
  const researchOutput = resultData?.autoScript;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white/80 px-4 py-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Product AutoScript
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="h-3 w-3" />
                    Auto Pipeline
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Product Name → Real Market Research → Trending Videos → Creative Analysis → Master Prompt → Shooting Instructions
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-right shadow-xs dark:border-slate-800 dark:bg-slate-900 md:block">
              <div className="text-[11px] font-medium text-slate-400">Gemini Generative Engine</div>
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                gemini-3.5-flash-lite Online
              </div>
            </div>
            <Link
              to="/production-board"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
            >
              <Camera className="h-3.5 w-3.5 text-indigo-500" />
              Production Board
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-xs font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-xs font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* SECTION 1: Product Input & AutoScript Switch Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 px-6 py-5 dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Product Configuration & Auto-Trigger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your product name below. Turn AutoScript ON to trigger full market research and script synthesis automatically.
              </p>
            </div>

            {/* AutoScript Switch Control */}
            <div className="flex items-center gap-3 self-start sm:self-auto bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xs">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      autoScriptEnabled ? 'bg-indigo-600 animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  AutoScript {autoScriptEnabled ? 'ON' : 'OFF'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {autoScriptEnabled ? 'Auto-triggers on input' : 'Manual generation only'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoScriptEnabled(!autoScriptEnabled)}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  autoScriptEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle AutoScript auto-triggering"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoScriptEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Primary Required Field: Product Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Product Name
                  <span className="text-rose-500">*</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    (e.g., brand, item name, or service package)
                  </span>
                </label>
                {/* Demo quick load buttons */}
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Try demo:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoProduct('Smart Posture Corrector', 'meta-ads', 'English')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Posture Corrector
                  </button>
                  <span className="text-slate-300">&bull;</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoProduct('Organic Ayurvedic Hair Oil', 'personal-branding', 'Hinglish')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Hair Oil (Hinglish)
                  </button>
                  <span className="text-slate-300">&bull;</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoProduct('Financial Planning Software', 'personal-branding', 'Gujarati')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Finance App (Gujarati)
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name (e.g., GlowBoost Vitamin C Serum, NoiseCancelling Earbuds Pro, Minimalist Leather Wallet)..."
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 pl-11 text-base font-medium text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
                />
                <ShoppingBag className="absolute left-3.5 top-4 h-5 w-5 text-slate-400" />
              </div>
            </div>

            {/* Core Configuration Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Content Module */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Content Module
                </label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="personal-branding">Personal Branding (Reach & Trust)</option>
                  <option value="meta-ads">Meta Ads (Direct Response ROI)</option>
                  <option value="story-marketing">Story Marketing (Transformation)</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  {module === 'meta-ads'
                    ? 'Generates punchy hooks & direct CTA'
                    : module === 'story-marketing'
                    ? 'Generates 4-part transformation sequence'
                    : 'Builds authority without hard selling'}
                </p>
              </div>

              {/* Target Platform */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Instagram Reels">Instagram Reels (9:16 Vertical)</option>
                  <option value="YouTube Shorts">YouTube Shorts (Under 60s Fast Pacing)</option>
                  <option value="Meta Feed Ads">Meta Feed Ads (Square / 4:5)</option>
                  <option value="Cross-Platform">Cross-Platform Short Video</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-400">Tailors camera framing and retention hooks</p>
              </div>

              {/* Target Market */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Target Market
                </label>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="India">India (Pan-India & Vernacular)</option>
                  <option value="United States">United States (Tier 1 Global)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Global">Global English Market</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-400">Pulls regional Google & YouTube trends</p>
              </div>

              {/* Language (English, Hinglish, Hindi, Marathi, Gujarati) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Language & Cadence
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === 'Gujarati'
                        ? 'Gujarati (ગુજરાતી)'
                        : lang === 'Marathi'
                        ? 'Marathi (मराठी)'
                        : lang === 'Hindi'
                        ? 'Hindi (हिंदी)'
                        : lang === 'Hinglish'
                        ? 'Hinglish (Hindi-English)'
                        : lang}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">All spoken dialogue will be in this language</p>
              </div>
            </div>

            {/* Optional Details Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                {showOptionalFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showOptionalFields ? 'Hide optional product details' : 'Add optional details (URL, Price, Benefits, Pain Points)'}
              </button>

              {showOptionalFields && (
                <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://example.com/product"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Price / Offer (Optional)
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹999, $29, 30% off today"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Research Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="Last 24 Hours">Last 24 Hours (Real-time Spikes)</option>
                      <option value="Last 7 Days">Last 7 Days (Recommended)</option>
                      <option value="Last 30 Days">Last 30 Days (Sustained Trends)</option>
                      <option value="Last 90 Days">Last 90 Days (Evergreen)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what the product does and why it stands out..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Key Benefits (1 per line or comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      placeholder="Fast absorption, no sticky residue, visible glow in 7 days..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Customer Pain Points Solved
                    </label>
                    <textarea
                      rows={2}
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      placeholder="Dry skin, dark spots, wasting money on chemical-heavy serums..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trigger Button Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {autoScriptEnabled ? (
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    Auto-generation active: updates automatically as you type
                  </span>
                ) : (
                  <span>Auto-generation is turned OFF. Click the button to generate manually.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {productName && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductName('');
                      setDescription('');
                      setPrice('');
                      setBenefits('');
                      setPainPoints('');
                      setProductUrl('');
                      setResultData(null);
                    }}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}

                <button
                  type="button"
                  disabled={isGenerating || !productName.trim()}
                  onClick={() => handleExecuteGeneration()}
                  className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                    isGenerating || !productName.trim()
                      ? 'bg-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 active:scale-98'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Generating AutoScript...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      {autoScriptEnabled ? 'Run AutoScript Now' : 'Generate Product Script'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Multi-Step Live Progress Card */}
        {isGenerating && (
          <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-white p-6 shadow-xl dark:border-indigo-900/60 dark:bg-slate-900 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white animate-pulse">
                  <RotateCw className="h-5 w-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    AutoScript Pipeline In Progress
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {generationStepMessage}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                Step {generationStep} of 5
              </span>
            </div>

            {/* 5-Stage Stepper Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-3">
              {[
                { step: 1, label: 'Market Research', desc: 'Queries & Angles' },
                { step: 2, label: 'Real Data', desc: 'Google, Meta, YouTube' },
                { step: 3, label: 'Video Analysis', desc: 'Hooks & Framing' },
                { step: 4, label: 'Master Prompt', desc: '12-Section Synthesis' },
                { step: 5, label: 'Gemini Script', desc: 'Scenes & Instructions' },
              ].map((s) => {
                const isPassed = generationStep > s.step;
                const isCurrent = generationStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`rounded-2xl border p-3 transition-all ${
                      isPassed
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                        : isCurrent
                        ? 'border-indigo-400 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200'
                        : 'border-slate-200 bg-slate-50/40 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Step {s.step}</span>
                      {isPassed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : isCurrent ? (
                        <RotateCw className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </div>
                    <div className="text-xs font-bold leading-tight">{s.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Output Results Area */}
        {resultData && !isGenerating && (
          <div className="space-y-6 animate-in fade-in">
            {/* Results Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('script')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    activeTab === 'script'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Film className="h-4 w-4" />
                  Script & Shooting Brief
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('prompt')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    activeTab === 'prompt'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="h-4 w-4" />
                  Master Prompt (12 Sections)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('research')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    activeTab === 'research'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Market Research & Evidence ({researchOutput?.sourcesSearched?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  History
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveScript}
                  disabled={isSavingScript}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
                >
                  {isSavingScript ? (
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <BookmarkCheck className="h-3.5 w-3.5" />
                  )}
                  Save Script
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateHook}
                  disabled={isRegeneratingHook}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                  title="Generate 3 fresh hook variations using Gemini"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRegeneratingHook ? 'animate-spin' : ''}`} />
                  Regenerate Hook
                </button>

                <button
                  type="button"
                  onClick={handleGenerateAnotherAngle}
                  disabled={isGeneratingAltAngle}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                  title="Create a fresh script with an alternative creative angle"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  Another Angle
                </button>

                <button
                  type="button"
                  onClick={handleExportText}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                  title="Download complete brief as .txt"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export .txt
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                  title="Export raw JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                  .json
                </button>
              </div>
            </div>

            {/* TAB 1: Script & Shooting Brief */}
            {activeTab === 'script' && scriptOutput && (
              <div className="space-y-6">
                {/* 1. Hook Selection Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        3 Original Hook Options
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Select a hook below to use as your primary scroll-stopper. Spoken in {resultData.autoScript?.language}.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                      Module: {resultData.autoScript?.module?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(scriptOutput.hookOptions || []).map((h, idx) => {
                      const isSelected = selectedHookText === h.hookText;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedHookText(h.hookText)}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block rounded-md bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {h.type || `Option ${idx + 1}`}
                            </span>
                            {h.estimatedRetentionLift && (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {h.estimatedRetentionLift}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                            "{h.hookText}"
                          </p>
                          {h.whyItWorks && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              {h.whyItWorks}
                            </p>
                          )}
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-medium">
                            <span className={isSelected ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
                              {isSelected ? '✓ Selected Hook' : 'Click to select'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(h.hookText, `hook_${idx}`);
                              }}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {copiedKey === `hook_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Complete Spoken Script Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Film className="h-4 w-4 text-indigo-600" />
                        Complete Spoken Script ({resultData.autoScript?.language})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Paced for 60 seconds (~140 words). Zero fabricated claims.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(scriptOutput.spokenScript, 'full_script')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                      >
                        {copiedKey === 'full_script' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy Spoken Script
                      </button>
                    </div>
                  </div>

                  {/* Script Sections breakdown */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/60 space-y-4 font-mono text-xs sm:text-sm">
                    {/* Hook Section */}
                    <div className="border-l-4 border-indigo-500 pl-4 py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                        [HOOK • 0:00 - 0:03]
                      </div>
                      <div className="text-slate-900 dark:text-slate-100 font-semibold font-sans text-base">
                        {selectedHookText || scriptOutput.recommendedHook}
                      </div>
                    </div>

                    {/* Body Section */}
                    <div className="border-l-4 border-violet-500 pl-4 py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
                        [BODY • 0:03 - 0:50]
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-sans whitespace-pre-line leading-relaxed">
                        {scriptOutput.body}
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                        [CALL TO ACTION • 0:50 - 1:00]
                      </div>
                      <div className="text-slate-900 dark:text-slate-100 font-semibold font-sans text-sm">
                        {scriptOutput.cta}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Scene-by-Scene Shooting Instructions */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Camera className="h-4 w-4 text-indigo-600" />
                        Scene-by-Scene Shooting Instructions
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Framing, lighting, B-roll suggestions, and visual actions.
                      </p>
                    </div>
                  </div>

                  {/* Equipment & Framing Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Framing: </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {scriptOutput.shootingInstructions?.cameraFraming || 'Vertical 9:16, medium close up'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Lighting: </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {scriptOutput.shootingInstructions?.lighting || '45-degree key light'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Wardrobe: </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {scriptOutput.shootingInstructions?.wardrobe || 'Clean neutral shirt'}
                      </span>
                    </div>
                  </div>

                  {/* Scenes Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3">Scene #</th>
                          <th className="px-4 py-3">Shot Type</th>
                          <th className="px-4 py-3">Visual Action & Product Cue</th>
                          <th className="px-4 py-3">Dialogue / Voiceover</th>
                          <th className="px-4 py-3 text-right">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(scriptOutput.shootingInstructions?.scenes || []).map((sc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                              Scene {sc.sceneNumber || idx + 1}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                              {sc.shotType}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                              {sc.visualAction}
                            </td>
                            <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">
                              "{sc.dialogue}"
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-500">
                              {sc.durationSeconds}s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* B-Roll Suggestions */}
                  {scriptOutput.shootingInstructions?.bRollSuggestions?.length > 0 && (
                    <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                        B-Roll & Cutaway Suggestions
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {scriptOutput.shootingInstructions.bRollSuggestions.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 4. Editing Instructions & Upload Package Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Editing Blueprint */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-violet-500" />
                      Video Editing Blueprint
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Cuts & Rhythm: </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {scriptOutput.editingInstructions?.cutsAndPacing || 'Cut on every punctuation mark'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Subtitle Style: </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {scriptOutput.editingInstructions?.captionStyle || 'Bold yellow accents on lower third'}
                        </span>
                      </div>

                      {scriptOutput.editingInstructions?.onScreenText?.length > 0 && (
                        <div className="mt-3">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            On-Screen Text Overlays:
                          </span>
                          <div className="space-y-1 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                            {scriptOutput.editingInstructions.onScreenText.map((t, i) => (
                              <div key={i}>{t}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Upload Package */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-indigo-500" />
                        Social Media Upload Package
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `${scriptOutput.uploadPackage?.caption}\n\n${(scriptOutput.uploadPackage?.hashtags || []).join(' ')}`,
                            'caption'
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        {copiedKey === 'caption' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy Caption
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Cover Title: </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {scriptOutput.uploadPackage?.coverTitle || resultData.autoScript?.productName}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Suggested Time: </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {scriptOutput.uploadPackage?.suggestedPublishingTime || '7:00 PM - 8:30 PM'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Caption:
                        </span>
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-xs">
                          {scriptOutput.uploadPackage?.caption}
                        </div>
                      </div>
                      {scriptOutput.uploadPackage?.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {scriptOutput.uploadPackage.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Master Prompt */}
            {activeTab === 'prompt' && masterPromptOutput && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-indigo-600" />
                      Original 12-Section Master Prompt
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Product context, verified market research, creative angles, and quality controls.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/saved-master-prompts"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                    >
                      <BookmarkCheck className="h-3.5 w-3.5 text-indigo-500" />
                      View in Saved Master Prompts
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCopy(masterPromptOutput.promptContent, 'master_prompt')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                      {copiedKey === 'master_prompt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy Master Prompt
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-950 p-5 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-[600px] overflow-y-auto">
                  {masterPromptOutput.promptContent}
                </div>
              </div>
            )}

            {/* TAB 3: Market Research & Real Evidence */}
            {activeTab === 'research' && researchOutput && (
              <div className="space-y-6">
                {/* 1. Real Sources Searched */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Research Sources Searched & Live Access Status
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Transparent reporting of connected APIs and public search explore fallback without fabricated metrics.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(researchOutput.sourcesSearched || []).map((src, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {src.sourceName}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              src.status === 'Connected'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            }`}
                          >
                            {src.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div>Query: <span className="font-mono text-slate-700 dark:text-slate-300">"{src.queryUsed}"</span></div>
                          <div>Results count: <span className="font-bold">{src.count}</span></div>
                          <div>Latency: <span>{src.latencyMs}ms</span></div>
                          {src.accessLimitations && (
                            <div className="text-[10px] text-slate-400 italic mt-1">
                              {src.accessLimitations}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Reference Videos & Ad Angles */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Video className="h-4 w-4 text-indigo-500" />
                      Relevant Reference Videos & Creative Angles
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Discovered short-form content patterns with genuine URLs and observed statistics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(researchOutput.referenceVideos || []).map((vid, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2 hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                            {vid.source}
                          </span>
                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Open reference video"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {vid.title}
                        </h5>
                        <div className="text-[11px] text-slate-500">
                          <div>Hook Style: <span className="font-medium text-slate-700 dark:text-slate-300">{vid.hookStyle}</span></div>
                          <div>Visual: <span className="font-medium text-slate-700 dark:text-slate-300">{vid.visualStructure}</span></div>
                          <div>Pacing: <span className="font-medium text-slate-700 dark:text-slate-300">{vid.pacing}</span></div>
                        </div>
                        {vid.metrics && (
                          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {Number(vid.metrics.views || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {Number(vid.metrics.likes || 0).toLocaleString()}
                            </span>
                            <span className="text-slate-400 ml-auto">
                              {vid.metrics.metricsSource}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Synthesized Creative Patterns */}
                {researchOutput.creativePatterns && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-500" />
                        Recurring Creative Patterns
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {(researchOutput.creativePatterns.recurringPatterns || []).map((pat, i) => (
                          <li key={i}>{pat}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        Differentiating Content Angles
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {(researchOutput.creativePatterns.differentiatingOpportunities || []).map((opp, i) => (
                          <li key={i}>{opp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: History */}
            {activeTab === 'history' && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recent Product AutoScript Runs
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quickly reload or review previous product scripts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadHistory}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <RefreshCw className={`h-3 w-3 ${loadingHistory ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {historyItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No past AutoScript runs found. Generate your first product script above!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {historyItems.map((item) => (
                      <div
                        key={item._id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-colors"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {item.productName}
                            <span className="text-[10px] font-bold uppercase rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                              {item.module}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{item.platform}</span>
                            <span>&bull;</span>
                            <span>{item.language}</span>
                            <span>&bull;</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const full = await productAutoScriptService.getById(item._id);
                                setResultData({
                                  autoScript: full,
                                  masterPrompt: full.masterPromptId,
                                  script: full.scriptId,
                                });
                                setSelectedHookText(full.generatedScript?.recommendedHook || '');
                                setActiveTab('script');
                              } catch (err) {
                                setError(err.message);
                              }
                            }}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                          >
                            Load Result
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
