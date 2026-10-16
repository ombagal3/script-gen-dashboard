import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  UserCheck,
  Megaphone,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Filter,
  Flame,
  Target,
  RefreshCw,
} from 'lucide-react';
import { trendService } from '../services/trendService';
import { TrendSourceBadge } from '../components/trends/TrendSourceBadge';
import { TrendScore } from '../components/trends/TrendScore';
import {
  PERSONAL_BRANDING_CATEGORIES,
  META_ADS_CATEGORIES,
  STORY_MARKETING_CATEGORIES,
} from '../utils/constants';

export const TrendAnalysis = () => {
  const navigate = useNavigate();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal-branding'); // 'personal-branding' | 'meta-ads' | 'story-marketing' | 'script-definition'
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await trendService.getTrends({
        limit: 50,
        sortBy: 'opportunityScore',
      });
      setTrends(res.data?.trends || []);
    } catch (err) {
      console.warn('Trend fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const getFilteredTrends = () => {
    return trends.filter((t) => {
      if (selectedIndustry !== 'All' && t.industry !== selectedIndustry) return false;
      if (activeTab === 'personal-branding' && !t.relevantModules?.includes('personal-branding'))
        return false;
      if (activeTab === 'meta-ads' && !t.relevantModules?.includes('meta-ads')) return false;
      if (activeTab === 'story-marketing' && !t.relevantModules?.includes('story-marketing'))
        return false;
      if (selectedCategory !== 'All' && !t.relevantCategories?.includes(selectedCategory))
        return false;
      return true;
    });
  };

  const filtered = getFilteredTrends();

  const getCategoriesForCurrentTab = () => {
    switch (activeTab) {
      case 'personal-branding':
        return PERSONAL_BRANDING_CATEGORIES;
      case 'meta-ads':
        return META_ADS_CATEGORIES;
      case 'story-marketing':
        return STORY_MARKETING_CATEGORIES;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <TrendingUp className="h-3.5 w-3.5" /> Comprehensive Category Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cross-Category Trend Analysis Engine
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            Evaluate how live market trends translate into specific Personal Branding authority hooks,
            Meta Ads conversion angles, and Story Marketing engagement funnels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/master-prompt-generator')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Launch Master Prompt Generator</span>
        </button>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveTab('personal-branding');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'personal-branding'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>1. Personal Branding (CA, Doctor, Founder, etc.)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('meta-ads');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'meta-ads'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>2. Meta Ads (10 Ad Categories)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('story-marketing');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'story-marketing'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. Story Marketing & DM Funnels</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('script-definition');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'script-definition'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Writing Frameworks & Methods</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      {activeTab !== 'script-definition' && (
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categories:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {getCategoriesForCurrentTab().map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Synthesizing category relevance scores...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
          <p className="text-sm text-slate-500">No trend mappings found for this active filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((trend) => {
            const mapping = trend.crossModuleMapping || {};
            const pbMap = mapping.personalBranding || {};
            const adMap = mapping.metaAds || {};
            const storyMap = mapping.storyMarketing || {};
            const scriptMap = mapping.scriptDefinition || {};

            return (
              <div
                key={trend._id}
                className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-indigo-700 space-y-4"
              >
                <div>
                  {/* Trend Top Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <TrendSourceBadge source={trend.source} sourceUrl={trend.sourceUrl} size="xs" />
                    <div className="flex items-center gap-1.5">
                      <TrendScore
                        score={trend.opportunityScore}
                        type="opportunity"
                        size="sm"
                        showLabel={false}
                      />
                      <span className="text-[10px] text-slate-400 font-medium">
                        {trend.lifecycle}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {trend.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {trend.description}
                  </p>

                  {/* Section-Specific Analytical Breakdown */}
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800 space-y-2.5 text-xs">
                    {activeTab === 'personal-branding' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
                            Personal Branding Analysis
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Authority & Reach Focus
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">Recommended Angle:</strong>{' '}
                          {pbMap.angle || trend.contentOpportunity?.whyItMatters}
                        </p>
                        {pbMap.hookIdea && (
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                              Sample Hook Angle:
                            </span>
                            <span className="text-xs italic text-slate-800 dark:text-slate-200">
                              "{pbMap.hookIdea}"
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>Categories: {(pbMap.recommendedCategories || []).join(', ') || 'Informative, Education'}</span>
                          <span>CTA: {pbMap.ctaStyle || 'Save & Follow'}</span>
                        </div>
                      </>
                    )}

                    {activeTab === 'meta-ads' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
                            Meta Ads Conversion Blueprint
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            Direct-Response ROI
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">Ad Angle:</strong>{' '}
                          {adMap.angle || 'Position transparent solution with strong before/after contrast.'}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold block">Creative Format:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                              {adMap.creativeFormat || 'Founder UGC / Lo-Fi'}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold block">Suggested CTA:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                              {adMap.suggestedCta || 'Learn More / Book Now'}
                            </span>
                          </div>
                        </div>
                        {adMap.complianceNote && (
                          <p className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg">
                            <strong>Compliance Note:</strong> {adMap.complianceNote}
                          </p>
                        )}
                      </>
                    )}

                    {activeTab === 'story-marketing' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
                            Instagram Story Sequence & DM Funnel
                          </span>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                            {storyMap.suggestedSlideCount || 4} Slides
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">Sequence Flow:</strong>{' '}
                          {storyMap.sequenceIdea || 'Curiosity Slide → Poll Sticker → Value Slide → DM Funnel CTA'}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 text-[11px]">
                          <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                            Interactive Sticker Strategy:
                          </span>
                          <span className="text-slate-800 dark:text-slate-200">
                            {storyMap.stickerStrategy || 'Poll sticker on Slide 2; DM trigger keyword on Slide 4'}
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === 'script-definition' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
                            Frameworks & Saved Methods
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            Structure Match
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          <strong className="text-slate-900 dark:text-white">Recommended Method:</strong>{' '}
                          {scriptMap.recommendedMethodName || 'Hook → Problem → Explanation → Solution → CTA'}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                          <strong>Hook Style:</strong> {scriptMap.hookStyle || 'Curiosity Gap / Contrarian Truth'} •{' '}
                          <strong>CTA Type:</strong> {scriptMap.ctaType || 'Save & Comment'}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/master-prompt-generator?trendId=${trend._id}&module=${activeTab === 'script-definition' ? 'personal-branding' : activeTab}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Master Prompt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/trends/${trend._id}`)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="View Full Trend Overview"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
