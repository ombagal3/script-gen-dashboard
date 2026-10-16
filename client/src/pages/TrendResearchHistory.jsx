import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { trendService } from '../services/trendService';
import { TrendSourceBadge } from '../components/trends/TrendSourceBadge';
import { TREND_INDUSTRIES } from '../utils/constants';

export const TrendResearchHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await trendService.getResearchHistory({
        industry: selectedIndustry,
      });
      setHistory(res.data?.history || []);
    } catch (err) {
      console.warn('History fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedIndustry]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <History className="h-3.5 w-3.5" /> Research Audit Log
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Trend Research History ({history.length})
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Chronological archive of market intelligence scans, date ranges used, and source evidence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/market-trends')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>New Market Research Scan</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-500">Filter by Industry:</span>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Industries</option>
          {TREND_INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* History Items */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading research archive...
          </p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No research sessions recorded
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run a trend research query on the Market Trends page to record evidence.
          </p>
          <button
            type="button"
            onClick={() => navigate('/market-trends')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Launch Market Research
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all dark:bg-slate-900/60 dark:border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 uppercase">
                      {item.industry}
                    </span>
                    <span className="text-xs text-slate-400">
                      Region: <strong className="text-slate-700 dark:text-slate-300">{item.region}</strong>
                    </span>
                    <span className="text-xs text-slate-400">• {item.platform}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h3>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400">
                  <span className="flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleString()}
                  </span>
                  <span className="block mt-0.5 text-[11px] font-medium text-slate-500">
                    Range: {item.dateRangeUsed?.label || 'Last 7 Days'} (
                    {new Date(item.dateRangeUsed?.start || Date.now()).toLocaleDateString()} -{' '}
                    {new Date(item.dateRangeUsed?.end || Date.now()).toLocaleDateString()})
                  </span>
                </div>
              </div>

              {/* Analysis Summary */}
              {item.analysisSummary && (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  {item.analysisSummary}
                </p>
              )}

              {/* Source Execution Statuses */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 text-[11px]">Sources Polled:</span>
                {(item.sourceResults || []).map((src, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        src.status === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{src.sourceName}</span>
                    <span className="text-slate-400">({src.count || 0} trends)</span>
                  </span>
                ))}
              </div>

              {/* Discovered Trends Quick List */}
              {item.trendsDiscovered && item.trendsDiscovered.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Discovered Trend Opportunities ({item.trendsDiscovered.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {item.trendsDiscovered.slice(0, 6).map((trend) => (
                      <div
                        key={trend._id}
                        onClick={() => navigate(`/trends/${trend._id}`)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 hover:border-indigo-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-800 cursor-pointer transition-all text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                          {trend.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shrink-0">
                          {trend.opportunityScore || 75}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
