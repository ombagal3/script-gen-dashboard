import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Flame,
  Target,
  Sparkles,
  RefreshCw,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Bookmark,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutGrid,
  List,
} from 'lucide-react';
import { trendService } from '../services/trendService';
import { TrendCard } from '../components/trends/TrendCard';
import { TrendFilters } from '../components/trends/TrendFilters';
import { OpportunityTable } from '../components/trends/OpportunityTable';
import { TrendSourceBadge } from '../components/trends/TrendSourceBadge';
import { Modal } from '../components/common/Modal';
import {
  TREND_INDUSTRIES,
  TREND_PLATFORMS,
  TREND_REGIONS,
  TREND_PERIODS,
  MODULES,
  PERSONAL_BRANDING_CATEGORIES,
  META_ADS_CATEGORIES,
  STORY_MARKETING_CATEGORIES,
} from '../utils/constants';

export const MarketTrends = () => {
  const navigate = useNavigate();

  // Overview Data States
  const [kpiData, setKpiData] = useState(null);
  const [sourceStatuses, setSourceStatuses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [totalTrends, setTotalTrends] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [toast, setToast] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    industry: 'All',
    platform: 'All',
    module: 'All',
    category: 'All',
    lifecycle: 'All',
    saturation: 'All',
    source: 'All',
    region: 'All',
    isSaved: 'false',
    search: '',
    sortBy: 'opportunityScore',
    page: 1,
    limit: 12,
  });

  // Research Form States
  const [researchForm, setResearchForm] = useState({
    title: '',
    industry: 'Finance and Taxation',
    customIndustry: '',
    brandOrCreator: '',
    targetAudience: 'Entrepreneurs, founders, and professionals',
    region: 'India',
    preferredLanguage: 'English',
    platform: 'Cross-Platform Research',
    period: 'Last 7 Days',
    targetModule: 'personal-branding',
    targetCategory: 'CA',
    contentObjective: 'Authority',
    competitorUrls: '',
    additionalInstructions: '',
  });

  // Manual Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importForm, setImportForm] = useState({
    name: '',
    description: '',
    industry: 'Finance and Taxation',
    platform: 'Cross-Platform',
    region: 'India',
    sourceUrl: '',
    searchInterestChange: '+80%',
    hashtagViews: '1.2M',
    activeAdCount: '10+',
    lifecycle: 'Growing',
    saturation: 'Moderate Saturation',
    opportunityNotes: '',
  });
  const [isImporting, setIsImporting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Dashboard KPIs & Curated Sections
  const fetchOverview = async () => {
    try {
      const [kpiRes, sourcesRes] = await Promise.all([
        trendService.getKPIs(),
        trendService.getSourceStatuses(),
      ]);
      setKpiData(kpiRes.data || null);
      setSourceStatuses(sourcesRes || []);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn('Overview fetch error:', err.message);
    }
  };

  // Fetch Filtered Trends
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await trendService.getTrends(filters);
      setTrends(res.data?.trends || []);
      setTotalTrends(res.data?.pagination?.total || 0);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [filters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOverview(), fetchTrends()]);
    setRefreshing(false);
    showToast('Market trends and sources refreshed successfully');
  };

  const handleToggleSave = async (id) => {
    try {
      const updated = await trendService.toggleSaveTrend(id);
      setTrends((prev) => prev.map((t) => (t._id === id ? { ...t, isSaved: updated.isSaved } : t)));
      showToast(updated.isSaved ? 'Trend saved to bookmarks' : 'Trend removed from bookmarks');
      fetchOverview();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleResearchSubmit = async (e) => {
    e.preventDefault();
    const finalIndustry =
      researchForm.industry === 'Other / Custom Industry' && researchForm.customIndustry.trim()
        ? researchForm.customIndustry.trim()
        : researchForm.industry;

    if (!finalIndustry) {
      showToast('Please select or specify an industry', 'error');
      return;
    }

    setIsResearching(true);
    try {
      const payload = {
        ...researchForm,
        industry: finalIndustry,
        competitorUrls: researchForm.competitorUrls
          ? researchForm.competitorUrls.split('\n').filter((u) => u.trim().length > 0)
          : [],
      };

      const res = await trendService.researchTrends(payload);
      showToast(
        `Discovered ${res.data?.trends?.length || 0} verified trends across sources!`,
        'success'
      );
      await Promise.all([fetchOverview(), fetchTrends()]);
    } catch (err) {
      showToast(err.message || 'Trend research execution failed', 'error');
    } finally {
      setIsResearching(false);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importForm.name || !importForm.industry) {
      showToast('Trend name and industry are required', 'error');
      return;
    }

    setIsImporting(true);
    try {
      await trendService.importTrend(importForm);
      showToast('Trend imported and evaluated across categories successfully');
      setShowImportModal(false);
      setImportForm({
        name: '',
        description: '',
        industry: 'Finance and Taxation',
        platform: 'Cross-Platform',
        region: 'India',
        sourceUrl: '',
        searchInterestChange: '+80%',
        hashtagViews: '1.2M',
        activeAdCount: '10+',
        lifecycle: 'Growing',
        saturation: 'Moderate Saturation',
        opportunityNotes: '',
      });
      await Promise.all([fetchOverview(), fetchTrends()]);
    } catch (err) {
      showToast(err.message || 'Import failed', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      industry: 'All',
      platform: 'All',
      module: 'All',
      category: 'All',
      lifecycle: 'All',
      saturation: 'All',
      source: 'All',
      region: 'All',
      isSaved: 'false',
      search: '',
      sortBy: 'opportunityScore',
      page: 1,
      limit: 12,
    });
  };

  const kpis = kpiData?.kpiCards || {
    totalTrends: 0,
    emergingTrends: 0,
    growingTrends: 0,
    highRelevanceTrends: 0,
    readyForScript: 0,
    masterPromptsCount: 0,
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-white dark:bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Compass className="h-3.5 w-3.5" /> Market Intelligence Suite
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated {lastRefreshedAt.toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Market Trends & Master Prompt Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            Live multi-source market trend discovery, cross-category audience psychology evaluation,
            and 12-section master prompt synthesis for viral and high-converting scripts.
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Import Trend</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Trends'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/master-prompt-generator')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Master Prompt</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (6 actual metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Discovered Trends
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {kpis.totalTrends}
            </span>
            <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">Total</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Emerging Trends
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {kpis.emergingTrends}
            </span>
            <span className="text-[10px] font-medium text-purple-500">Early-Stage</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Growing Trends
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {kpis.growingTrends}
            </span>
            <span className="text-[10px] font-medium text-emerald-500">Upward curve</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            High Relevance
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {kpis.highRelevanceTrends}
            </span>
            <span className="text-[10px] font-medium text-indigo-500">Score &gt; 80</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ready for Script
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {kpis.readyForScript}
            </span>
            <span className="text-[10px] font-medium text-amber-500">Create Now</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Master Prompts
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {kpis.masterPromptsCount}
            </span>
            <span className="text-[10px] font-medium text-rose-500">Synthesized</span>
          </div>
        </div>
      </div>

      {/* Multi-Source Live Status Strip */}
      <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Source Connection Adapters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sourceStatuses.map((src, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{src.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">({src.type})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Side Research Form + Right Side Insights Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Research Trends Form (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Live Market Trend Discovery Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target verified search spikes, active ad creative formats, and news across platforms
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              Default: India (Configurable)
            </span>
          </div>

          <form onSubmit={handleResearchSubmit} className="space-y-4">
            {/* Title & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Research Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Tax Regime Trends & CA Content Angles"
                  value={researchForm.title}
                  onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry / Niche <span className="text-rose-500">*</span>
                </label>
                <select
                  value={researchForm.industry}
                  onChange={(e) => setResearchForm({ ...researchForm, industry: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {TREND_INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Industry Input if selected */}
            {researchForm.industry === 'Other / Custom Industry' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Industry / Specialized Micro-Niche
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solar Installation for Commercial Warehouses"
                  value={researchForm.customIndustry}
                  onChange={(e) =>
                    setResearchForm({ ...researchForm, customIndustry: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                />
              </div>
            )}

            {/* Target Audience & Brand/Creator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience Profile
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salaried professionals, SMB owners, CFOs"
                  value={researchForm.targetAudience}
                  onChange={(e) =>
                    setResearchForm({ ...researchForm, targetAudience: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand or Creator Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rohan Mehta / TaxSmart India"
                  value={researchForm.brandOrCreator}
                  onChange={(e) =>
                    setResearchForm({ ...researchForm, brandOrCreator: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Region, Platform, Period */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Region (Default: India)
                </label>
                <select
                  value={researchForm.region}
                  onChange={(e) => setResearchForm({ ...researchForm, region: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {TREND_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Platform
                </label>
                <select
                  value={researchForm.platform}
                  onChange={(e) => setResearchForm({ ...researchForm, platform: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {TREND_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Research Period
                </label>
                <select
                  value={researchForm.period}
                  onChange={(e) => setResearchForm({ ...researchForm, period: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {TREND_PERIODS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Module & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Script Module
                </label>
                <select
                  value={researchForm.targetModule}
                  onChange={(e) =>
                    setResearchForm({
                      ...researchForm,
                      targetModule: e.target.value,
                      targetCategory:
                        e.target.value === 'personal-branding'
                          ? 'Business Owner'
                          : e.target.value === 'meta-ads'
                          ? 'Founder-Based Brand'
                          : 'Story Default',
                    })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Category
                </label>
                <select
                  value={researchForm.targetCategory}
                  onChange={(e) =>
                    setResearchForm({ ...researchForm, targetCategory: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                >
                  {(researchForm.targetModule === 'personal-branding'
                    ? PERSONAL_BRANDING_CATEGORIES
                    : researchForm.targetModule === 'meta-ads'
                    ? META_ADS_CATEGORIES
                    : STORY_MARKETING_CATEGORIES
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Authority, Reach, Conversions"
                  value={researchForm.contentObjective}
                  onChange={(e) =>
                    setResearchForm({ ...researchForm, contentObjective: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Additional Instructions / Search Focus */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specific Focus, Competitor URLs, or Search Keywords (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Focus on common misconceptions taxpayers have about the new tax regime, or paste reference links..."
                value={researchForm.additionalInstructions}
                onChange={(e) =>
                  setResearchForm({ ...researchForm, additionalInstructions: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isResearching}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Compass className={`w-4 h-4 ${isResearching ? 'animate-spin' : ''}`} />
                <span>
                  {isResearching
                    ? 'Executing Multi-Source Research & Evaluating Categories...'
                    : 'Research Market Trends Now'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Trending Now & Recommended Ideas (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Trending Now Widget */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trending Now</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">By Momentum</span>
            </div>

            <div className="space-y-2.5">
              {(kpiData?.trendingNow || trends.slice(0, 4)).map((t, i) => (
                <div
                  key={t._id || i}
                  onClick={() => navigate(`/trends/${t._id}`)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 hover:border-indigo-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 line-clamp-1">
                      {t.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold dark:bg-rose-950/40 dark:text-rose-300">
                      {t.momentumScore}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{t.industry}</span>
                    <span>•</span>
                    <span>{t.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Content Ideas */}
          {kpiData?.recommendedContentIdeas && kpiData.recommendedContentIdeas.length > 0 && (
            <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Content Opportunities
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Curated Angles</span>
              </div>

              <div className="space-y-2.5">
                {kpiData.recommendedContentIdeas.slice(0, 3).map((idea, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      navigate(
                        `/master-prompt-generator?trendId=${idea.trendId}&module=${idea.targetModule}&category=${idea.recommendedCategory}`
                      )
                    }
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 hover:border-indigo-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-800 transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                      {idea.headline}
                    </span>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {idea.recommendedCategory}
                      </span>
                      <span>Score: {idea.opportunityScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discovered Trends Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Discovered Trends Repository ({totalTrends})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filtered and ranked by opportunity score, lifecycle, and category compatibility
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <TrendFilters filters={filters} onChange={setFilters} onReset={handleResetFilters} />

        {/* Results */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Loading market trend signals...
            </p>
          </div>
        ) : trends.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No trends found matching criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keyword or run a new research session using the form above.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trends.map((trend) => (
              <TrendCard
                key={trend._id}
                trend={trend}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <OpportunityTable trends={trends} onToggleSave={handleToggleSave} />
        )}
      </div>

      {/* Manual Trend Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Market Trend Manually"
      >
        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Trend Name / Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Budget 2026 Indexation Benefit Removal"
              value={importForm.name}
              onChange={(e) => setImportForm({ ...importForm, name: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Context
            </label>
            <textarea
              rows={2}
              placeholder="What makes this topic significant for creators and audiences?"
              value={importForm.description}
              onChange={(e) => setImportForm({ ...importForm, description: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry <span className="text-rose-500">*</span>
              </label>
              <select
                value={importForm.industry}
                onChange={(e) => setImportForm({ ...importForm, industry: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {TREND_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Region
              </label>
              <select
                value={importForm.region}
                onChange={(e) => setImportForm({ ...importForm, region: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {TREND_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Source URL / Reference Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={importForm.sourceUrl}
              onChange={(e) => setImportForm({ ...importForm, sourceUrl: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lifecycle
              </label>
              <select
                value={importForm.lifecycle}
                onChange={(e) => setImportForm({ ...importForm, lifecycle: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {['Emerging', 'Growing', 'Peak', 'Evergreen'].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Saturation
              </label>
              <select
                value={importForm.saturation}
                onChange={(e) => setImportForm({ ...importForm, saturation: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {['Low Saturation', 'Moderate Saturation', 'High Saturation'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowImportModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isImporting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Save & Evaluate Trend'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
