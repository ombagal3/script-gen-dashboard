import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { TrendSourceBadge } from './TrendSourceBadge';
import { TrendScore } from './TrendScore';

export const TrendCard = ({ trend, onToggleSave, isSaving = false }) => {
  const navigate = useNavigate();

  const getLifecycleColor = (status) => {
    switch (status) {
      case 'Emerging':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'Growing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Peak':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Declining':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    }
  };

  const getSaturationColor = (sat) => {
    switch (sat) {
      case 'Low Saturation':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30';
      case 'Moderate Saturation':
        return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30';
      case 'High Saturation':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30';
      default:
        return 'text-slate-500 bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div
      onClick={() => navigate(`/trends/${trend._id}`)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300/80 transition-all duration-200 cursor-pointer dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-indigo-700"
    >
      <div>
        {/* Top Header: Source, Lifecycle, Save Button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <TrendSourceBadge source={trend.source} sourceUrl={trend.sourceUrl} size="xs" />
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getLifecycleColor(
                trend.lifecycle
              )}`}
            >
              {trend.lifecycle}
            </span>
            <span
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md ${getSaturationColor(
                trend.saturation
              )}`}
            >
              {trend.saturation}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(trend._id);
            }}
            disabled={isSaving}
            className={`p-1.5 rounded-lg border transition-all ${
              trend.isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-400'
            }`}
            title={trend.isSaved ? 'Saved to bookmarks' : 'Save trend'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${trend.isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
          {trend.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {trend.description}
        </p>

        {/* Categories Pills */}
        {trend.relevantCategories && trend.relevantCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {trend.relevantCategories.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {cat}
              </span>
            ))}
            {trend.relevantCategories.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center font-semibold">
                +{trend.relevantCategories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Scores & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendScore
              score={trend.opportunityScore}
              type="opportunity"
              size="sm"
              explanation={trend.opportunityScoreExplanation}
            />
            <TrendScore
              score={trend.momentumScore}
              type="momentum"
              size="sm"
              explanation={trend.momentumScoreExplanation}
            />
          </div>

          <span className="text-[10px] text-slate-400 font-medium">
            {trend.region} • {trend.platform}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/master-prompt-generator?trendId=${trend._id}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Prompt</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trends/${trend._id}`);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
            title="View Deep Analysis"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
