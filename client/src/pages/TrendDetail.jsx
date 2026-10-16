import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Bookmark,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Target,
  Flame,
  UserCheck,
  Megaphone,
  BookOpen,
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { trendService } from '../services/trendService';
import { TrendSourceBadge } from '../components/trends/TrendSourceBadge';
import { TrendScore } from '../components/trends/TrendScore';
import { TrendEvidence } from '../components/trends/TrendEvidence';

export const TrendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTrend = async () => {
    setLoading(true);
    try {
      const data = await trendService.getTrendById(id);
      setTrend(data);
    } catch (err) {
      showToast(err.message || 'Failed to load trend details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend();
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const updated = await trendService.toggleSaveTrend(id);
      setTrend((prev) => ({ ...prev, isSaved: updated.isSaved }));
      showToast(updated.isSaved ? 'Trend saved to bookmarks' : 'Trend removed from bookmarks');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const updated = await trendService.analyzeTrend(id);
      setTrend(updated);
      showToast('Trend re-analyzed across all categories successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Loading detailed trend intelligence...
        </p>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">Trend not found</p>
        <button
          type="button"
          onClick={() => navigate('/market-trends')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Market Trends
        </button>
      </div>
    );
  }

  const aud = trend.audienceAnalysis || {};
  const opp = trend.contentOpportunity || {};
  const mapping = trend.crossModuleMapping || {};

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white dark:bg-emerald-600'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-white" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trends</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              trend.isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${trend.isSaved ? 'fill-current' : ''}`} />
            <span>{trend.isSaved ? 'Bookmarked' : 'Save Trend'}</span>
          </button>

          <button
            type="button"
            onClick={handleReAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Re-Analyzing...' : 'Re-Analyze Cross-Module'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/master-prompt-generator?trendId=${trend._id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Master Prompt</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TrendSourceBadge source={trend.source} sourceUrl={trend.sourceUrl} size="sm" />
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
            {trend.industry}
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
            Lifecycle: {trend.lifecycle}
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Saturation: {trend.saturation}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {trend.name}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {trend.description}
        </p>

        {/* Timeline & Metadata row */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> First Observed: {new Date(trend.firstObservedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Last Verified: {new Date(trend.lastVerifiedAt).toLocaleString()}
          </span>
          <span>Region: <strong className="text-slate-700 dark:text-slate-300">{trend.region}</strong></span>
          <span>Platform: <strong className="text-slate-700 dark:text-slate-300">{trend.platform}</strong></span>
        </div>

        {/* Scores Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <TrendScore
            score={trend.opportunityScore}
            type="opportunity"
            label="Content Opportunity Score"
            explanation={trend.opportunityScoreExplanation}
          />
          <TrendScore
            score={trend.momentumScore}
            type="momentum"
            label="Market Momentum Score"
            explanation={trend.momentumScoreExplanation}
          />
        </div>
      </div>

      {/* Grid: Audience Psychology & Content Opportunity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Psychology Analysis */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Audience Psychology & Intent
            </h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                Target Audience Profile
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                {aud.targetAudience || 'Industry practitioners, clients, and active learners.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                Core Problem or Need
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                {aud.audienceProblem || 'Confused by outdated norms; seeking authentic modern solutions.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                Search Intent & Curiosity Gap
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                {aud.searchIntent || 'Looking for tactical guidance and direct expert clarification.'}
              </p>
            </div>

            {aud.commonQuestions && aud.commonQuestions.length > 0 && (
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                  Common Audience Questions
                </span>
                <ul className="space-y-1">
                  {aud.commonQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Content Opportunity & Angles */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Content Opportunity & Original Angles
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                opp.recommendedAction === 'Create Now'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              Action: {opp.recommendedAction || 'Create Now'}
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                Why This Trend Matters Right Now
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                {opp.whyItMatters || trend.description}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                What is Missing from Existing Creator Content
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                {opp.missingFromExistingContent || 'Transparent frameworks, verified numbers, and relatable case studies.'}
              </p>
            </div>

            {opp.originalAngles && opp.originalAngles.length > 0 && (
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                  Original Angles to Explore
                </span>
                <div className="space-y-1.5">
                  {opp.originalAngles.map((angle, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {angle}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Module Opportunity Mapping */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Cross-Module Opportunity Adaptations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Personal Branding */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Personal Branding
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Authority</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {mapping.personalBranding?.angle || 'Establish authority by demystifying complex industry questions without hard selling.'}
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Categories:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(mapping.personalBranding?.recommendedCategories || []).join(', ') || 'CA, Business Owner, Education'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/master-prompt-generator?trendId=${trend._id}&module=personal-branding`)}
              className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 transition-colors"
            >
              Generate Personal Branding Prompt
            </button>
          </div>

          {/* Meta Ads */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4" /> Meta Ads
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">Conversions</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {mapping.metaAds?.angle || 'Highlight before/after pain transformation with direct solution positioning.'}
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Ad Format:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {mapping.metaAds?.creativeFormat || 'Founder UGC Video / Lo-Fi'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/master-prompt-generator?trendId=${trend._id}&module=meta-ads`)}
              className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 transition-colors"
            >
              Generate Meta Ad Master Prompt
            </button>
          </div>

          {/* Story Marketing */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Story Marketing
              </span>
              <span className="text-[10px] text-purple-600 font-bold">DM Funnel</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {mapping.storyMarketing?.sequenceIdea || 'Curiosity Hook Slide → Poll Sticker → Insight Slide → DM Funnel CTA'}
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">Slide Sequence:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {mapping.storyMarketing?.suggestedSlideCount || 4} Slide Micro-Funnel
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/master-prompt-generator?trendId=${trend._id}&module=story-marketing`)}
              className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 transition-colors"
            >
              Generate Story Sequence Prompt
            </button>
          </div>
        </div>
      </div>

      {/* Verifiable Evidence & Supporting Links */}
      <TrendEvidence
        evidence={trend.researchEvidence}
        verifiedMetrics={trend.verifiedMetrics}
        lifecycleEvidence={trend.lifecycleEvidence}
        saturationEvidence={trend.saturationEvidence}
        dataFreshnessStatus={trend.dataFreshnessStatus}
      />
    </div>
  );
};
