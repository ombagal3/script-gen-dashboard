import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { TrendSourceBadge } from './TrendSourceBadge';
import { TrendScore } from './TrendScore';

export const OpportunityTable = ({ trends = [], onToggleSave }) => {
  const navigate = useNavigate();

  if (!trends || trends.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
        <p className="text-sm text-slate-500">No trends matching the selected filters.</p>
      </div>
    );
  }

  const getLifecycleColor = (status) => {
    switch (status) {
      case 'Emerging':
        return 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300';
      case 'Growing':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'Peak':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300';
      case 'Declining':
        return 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300';
      default:
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300';
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400">
          <tr>
            <th className="py-3 px-4">Trend & Topic</th>
            <th className="py-3 px-3">Source</th>
            <th className="py-3 px-3">Lifecycle</th>
            <th className="py-3 px-3 text-center">Opportunity</th>
            <th className="py-3 px-3 text-center">Momentum</th>
            <th className="py-3 px-3">Saturation</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
          {trends.map((trend) => (
            <tr
              key={trend._id}
              onClick={() => navigate(`/trends/${trend._id}`)}
              className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
            >
              <td className="py-3 px-4 max-w-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 line-clamp-1">
                    {trend.name}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {trend.industry} • {trend.platform}
                  </span>
                </div>
              </td>

              <td className="py-3 px-3">
                <TrendSourceBadge source={trend.source} sourceUrl={trend.sourceUrl} size="xs" />
              </td>

              <td className="py-3 px-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${getLifecycleColor(
                    trend.lifecycle
                  )}`}
                >
                  {trend.lifecycle}
                </span>
              </td>

              <td className="py-3 px-3 text-center">
                <TrendScore score={trend.opportunityScore} type="opportunity" size="sm" showLabel={false} />
              </td>

              <td className="py-3 px-3 text-center">
                <TrendScore score={trend.momentumScore} type="momentum" size="sm" showLabel={false} />
              </td>

              <td className="py-3 px-3">
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {trend.saturation}
                </span>
              </td>

              <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleSave?.(trend._id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      trend.isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                    title={trend.isSaved ? 'Saved to bookmarks' : 'Save'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${trend.isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/master-prompt-generator?trendId=${trend._id}`)}
                    className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-2xs text-[11px] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span className="hidden sm:inline">Prompt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/trends/${trend._id}`)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="View Deep Analysis"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
