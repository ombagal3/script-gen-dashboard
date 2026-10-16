import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Camera,
  Scissors,
  Share2,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
  Flame,
  FileText,
  Search,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { autopilotService } from '../services/autopilotService';
import { ShootingBriefModal } from '../components/autopilot/ShootingBriefModal';
import { PerformanceLogModal } from '../components/autopilot/PerformanceLogModal';

export const ProductionBoard = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRank, setFilterRank] = useState('ALL');
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [performanceBrief, setPerformanceBrief] = useState(null);

  const PIPELINE_COLUMNS = [
    { id: 'Researching', label: '1. Researching', icon: Clock, color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40' },
    { id: 'Research Complete', label: '2. Research Done', icon: Sparkles, color: 'border-blue-300 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20' },
    { id: 'Script Ready', label: '3. Script Ready', icon: FileText, color: 'border-indigo-300 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20' },
    { id: 'Ready to Shoot', label: '4. Ready to Shoot', icon: Camera, color: 'border-amber-300 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20' },
    { id: 'Shooting', label: '5. Shooting', icon: Camera, color: 'border-orange-300 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20' },
    { id: 'Editing', label: '6. Editing', icon: Scissors, color: 'border-violet-300 dark:border-violet-900/50 bg-violet-50/40 dark:bg-violet-950/20' },
    { id: 'Ready to Upload', label: '7. Ready to Post', icon: Share2, color: 'border-pink-300 dark:border-pink-900/50 bg-pink-50/40 dark:bg-pink-950/20' },
    { id: 'Published', label: '8. Published', icon: CheckCircle2, color: 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20' },
    { id: 'Performance Review', label: '9. Feedback', icon: TrendingUp, color: 'border-cyan-300 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20' },
  ];

  useEffect(() => {
    loadBriefs();
  }, []);

  const loadBriefs = async () => {
    try {
      setLoading(true);
      const data = await autopilotService.getDailyBriefs();
      setBriefs(data);
    } catch (err) {
      setError(err.message || 'Failed to load production board briefs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (briefId, newStatus) => {
    try {
      const updated = await autopilotService.updateStatus(briefId, newStatus);
      setBriefs((prev) =>
        prev.map((b) => (b._id === briefId ? { ...b, status: newStatus } : b))
      );
      if (selectedBrief?._id === briefId) {
        setSelectedBrief((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const filteredBriefs = briefs.filter((b) => {
    if (filterRank !== 'ALL' && b.priorityRank !== filterRank) return false;
    return true;
  });

  const getRankBadge = (rank) => {
    switch (rank) {
      case 'Best Opportunity':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'Alternative Opportunity':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'Evergreen Backup':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-[100rem] mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Header & Responsibility Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Content Production Board
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            9-Stage shooting & publication pipeline. Move items with 1 click as you record, edit, and post.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Rank:</span>
            <select
              value={filterRank}
              onChange={(e) => setFilterRank(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden"
            >
              <option value="ALL">All Priorities</option>
              <option value="Best Opportunity">Best Opportunity</option>
              <option value="Alternative Opportunity">Alternative Opportunity</option>
              <option value="Evergreen Backup">Evergreen Backup</option>
            </select>
          </div>

          <button
            onClick={loadBriefs}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
            title="Refresh Board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clear Division of Responsibility Notice */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">SYSTEM ROLES:</span>
          <span>⚡ <strong>AI Engine:</strong> Market trends, hook synthesis, scene framing & upload package.</span>
          <span>🎬 <strong>Your Role:</strong> Shoot on camera, edit pacing, review factual claims & upload.</span>
        </div>
        <span className="text-[11px] text-slate-400 hidden lg:inline">Click any card to open the complete shooting package</span>
      </div>

      {/* 9-Column Kanban Board with Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin">
        {PIPELINE_COLUMNS.map((col, colIdx) => {
          const colBriefs = filteredBriefs.filter((b) => b.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              className={`w-72 shrink-0 rounded-2xl border ${col.color} p-3 flex flex-col max-h-[75vh]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {col.label}
                  </span>
                </div>
                <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  {colBriefs.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colBriefs.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No items in this stage
                  </div>
                ) : (
                  colBriefs.map((brief) => (
                    <div
                      key={brief._id}
                      onClick={() => setSelectedBrief(brief)}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${getRankBadge(
                            brief.priorityRank
                          )}`}
                        >
                          {brief.priorityRank}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          <span>{brief.opportunityScore || 90}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {brief.title || brief.topic}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{brief.targetDuration}s • {brief.language}</span>
                        <span>{brief.shootingInstructions?.scenes?.length || 5} Scenes</span>
                      </div>

                      {/* Quick Advance / Action button */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        {colIdx < PIPELINE_COLUMNS.length - 1 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(brief._id, PIPELINE_COLUMNS[colIdx + 1].id);
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                          >
                            Advance <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold">Done</span>
                        )}

                        {brief.status === 'Published' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPerformanceBrief(brief);
                            }}
                            className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                          >
                            Log Metrics
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Package Modal */}
      {selectedBrief && (
        <ShootingBriefModal
          brief={selectedBrief}
          onClose={() => setSelectedBrief(null)}
          onStatusChange={handleStatusChange}
          onOpenPerformanceModal={(b) => {
            setSelectedBrief(null);
            setPerformanceBrief(b);
          }}
        />
      )}

      {/* Performance Logging Modal */}
      {performanceBrief && (
        <PerformanceLogModal
          brief={performanceBrief}
          onClose={() => setPerformanceBrief(null)}
          onSuccess={() => {
            loadBriefs();
          }}
        />
      )}
    </div>
  );
};
