import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileText,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const TrendEvidence = ({
  evidence = {},
  verifiedMetrics = {},
  lifecycleEvidence = '',
  saturationEvidence = '',
  dataFreshnessStatus = 'Verified Fresh',
}) => {
  const {
    supportingLinks = [],
    verifiedMetricsSummary = '',
    inferredOpportunity = '',
    missingInformation = '',
    confidenceLevel = 'Moderate',
    confidenceJustification = '',
  } = evidence;

  const getConfidenceBadge = (level) => {
    switch (level) {
      case 'High':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Moderate':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Research Evidence & Verification</h4>
            <p className="text-xs text-slate-500">Transparent factual verification without fabricated assumptions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border ${getConfidenceBadge(
              confidenceLevel
            )}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confidence: {confidenceLevel}</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            {dataFreshnessStatus}
          </span>
        </div>
      </div>

      {/* Verified Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {verifiedMetrics.searchInterestChange && (
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Search Velocity</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {verifiedMetrics.searchInterestChange}
            </span>
          </div>
        )}

        {verifiedMetrics.hashtagViews && (
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Short-Form Volume</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {verifiedMetrics.hashtagViews}
            </span>
          </div>
        )}

        {verifiedMetrics.activeAdCount && (
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Ad Library Activity</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {verifiedMetrics.activeAdCount}
            </span>
          </div>
        )}

        {verifiedMetrics.searchVolumeEstimate && (
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Search Interest</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {verifiedMetrics.searchVolumeEstimate}
            </span>
          </div>
        )}
      </div>

      {/* Supporting Source Links */}
      {supportingLinks && supportingLinks.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" /> Primary Verifiable References ({supportingLinks.length})
          </span>
          <div className="space-y-2">
            {supportingLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 hover:border-indigo-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:hover:border-indigo-800 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 line-clamp-1">
                    {link.title || link.url}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </div>
                {link.snippet && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {link.snippet}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                  {link.source && <span className="font-semibold text-slate-600 dark:text-slate-300">{link.source}</span>}
                  {link.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> {new Date(link.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Justification & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {confidenceJustification && (
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">Confidence Rationale</span>
            <p className="text-indigo-800/90 dark:text-indigo-200/80">{confidenceJustification}</p>
          </div>
        )}

        {inferredOpportunity && (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">Inferred Content Angle</span>
            <p className="text-emerald-800/90 dark:text-emerald-200/80">{inferredOpportunity}</p>
          </div>
        )}
      </div>

      {(lifecycleEvidence || saturationEvidence) && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 dark:bg-slate-800/30 dark:border-slate-800 dark:text-slate-300 space-y-1">
          {lifecycleEvidence && (
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Lifecycle Assessment:</strong> {lifecycleEvidence}
            </p>
          )}
          {saturationEvidence && (
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Saturation Analysis:</strong> {saturationEvidence}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
