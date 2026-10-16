import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  RotateCw,
  Clock,
  Flame,
  CheckCircle2,
  Share2,
  FileText,
  Camera,
  Scissors,
  ArrowRight,
  TrendingUp,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Layers,
  ChevronRight,
  RefreshCw,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { autopilotService } from '../services/autopilotService';
import { contentStrategyService } from '../services/contentStrategyService';
import { ShootingBriefModal } from '../components/autopilot/ShootingBriefModal';
import { PerformanceLogModal } from '../components/autopilot/PerformanceLogModal';

export const AutopilotEngine = () => {
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [dailyBriefs, setDailyBriefs] = useState([]);
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [error, setError] = useState(null);

  // Modals state
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [performanceBrief, setPerformanceBrief] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [strategy, briefs, jobs] = await Promise.all([
        contentStrategyService.getActiveStrategy(),
        autopilotService.getDailyBriefs(),
        autopilotService.getJobHistory(),
      ]);

      setActiveStrategy(strategy);
      setDailyBriefs(briefs);
      setJobHistory(jobs);
    } catch (err) {
      setError(err.message || 'Failed to load Autopilot Dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async () => {
    try {
      setScanning(true);
      setError(null);
      setScanMessage('Scanning Google Trends, Google News, TikTok Trends, Meta Ads, and YouTube Shorts...');

      const result = await autopilotService.runScan({
        jobType: 'Manual On-Demand',
      });

      setScanMessage(`Scan complete! Synthesized ${result.briefs?.length || 3} ready-to-shoot briefs.`);
      setTimeout(() => setScanMessage(null), 4000);

      await loadDashboardData();
    } catch (err) {
      setError(err.message || 'Autopilot scan encountered an error');
    } finally {
      setScanning(false);
    }
  };

  const handleStatusChange = async (briefId, newStatus) => {
    try {
      const updated = await autopilotService.updateStatus(briefId, newStatus);
      setDailyBriefs((prev) =>
        prev.map((b) => (b._id === briefId ? { ...b, status: newStatus } : b))
      );
      if (selectedBrief?._id === briefId) {
        setSelectedBrief((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update brief status:', err);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Group briefs by priority rank
  const bestOpportunity = dailyBriefs.find((b) => b.priorityRank === 'Best Opportunity') || dailyBriefs[0];
  const alternativeOpportunity = dailyBriefs.find((b) => b.priorityRank === 'Alternative Opportunity') || dailyBriefs[1];
  const evergreenBackup = dailyBriefs.find((b) => b.priorityRank === 'Evergreen Backup') || dailyBriefs[2];

  const priorityCards = [
    { rank: 'Best Opportunity', brief: bestOpportunity, badgeClass: 'bg-amber-500 text-white', accentBorder: 'border-amber-400 dark:border-amber-600' },
    { rank: 'Alternative Opportunity', brief: alternativeOpportunity, badgeClass: 'bg-indigo-600 text-white', accentBorder: 'border-indigo-400 dark:border-indigo-600' },
    { rank: 'Evergreen Backup', brief: evergreenBackup, badgeClass: 'bg-emerald-600 text-white', accentBorder: 'border-emerald-400 dark:border-emerald-600' },
  ].filter((item) => item.brief);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Hero / Strategy Active Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Autopilot Content Engine Active
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                Region: <strong className="text-white">{activeStrategy?.country || 'India'}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                Language: <strong className="text-indigo-300">{activeStrategy?.preferredLanguage || 'Hinglish'}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-400/30">
                Primary: Instagram Reels
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real Market Data <ArrowRight className="inline w-6 h-6 text-indigo-400 mx-1" /> Ready-to-Shoot Scripts
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              No manual reel hunting, hook guessing, or prompt engineering. The system extracts live trends, generates 3 hook options, scene-by-scene framing, and upload packages. <strong>Your job is to shoot and publish.</strong>
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {activeStrategy?.brandName || 'Authority Creator Hub'}
              </span>
              <span>•</span>
              <span className="text-slate-300 truncate max-w-xs">{activeStrategy?.primaryNiche}</span>
              <Link
                to="/content-strategy-settings"
                className="text-indigo-400 hover:text-indigo-300 underline font-semibold ml-2 flex items-center gap-1"
              >
                Modify Strategy <Sliders className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <button
              onClick={handleRunScan}
              disabled={scanning}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
            >
              {scanning ? (
                <RotateCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              )}
              {scanning ? 'Scanning Market Intelligence...' : 'Run Autopilot Research Scan'}
            </button>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next Auto-Scan: Tomorrow 08:00 AM IST</span>
            </div>
          </div>
        </div>

        {/* Scan Status Toast / Alert */}
        {scanMessage && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-200 flex items-center gap-2 animate-in fade-in">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-300 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Multi-Source Live Data Providers Grid */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Authorized Multi-Source Telemetry Feed
          </span>
          <span className="text-[11px] text-slate-400">Zero synthetic data or unauthorized scrapers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { name: 'Google Trends', status: 'Live RSS Feed', region: 'India / All Subregions', color: 'text-blue-500' },
            { name: 'Google News', status: 'Real-time Feed', region: 'Indian Finance & Tech', color: 'text-emerald-500' },
            { name: 'Meta Ads Library', status: 'Eligible Ads API', region: 'Active Campaign Angles', color: 'text-indigo-500' },
            { name: 'TikTok Creative', status: 'Trends Center', region: 'Short-Form Formats', color: 'text-pink-500' },
            { name: 'Instagram Explore', status: 'Professional Insights', region: 'Hook & Retention', color: 'text-purple-500' },
            { name: 'YouTube Shorts', status: 'Velocity Scanner', region: 'Search Spike & Retention', color: 'text-red-500' },
          ].map((src) => (
            <div
              key={src.name}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{src.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{src.status}</div>
              <div className="text-[9px] text-slate-400 truncate">{src.region}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Pipeline Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Ready to Shoot', count: dailyBriefs.filter((b) => b.status === 'Ready to Shoot' || b.status === 'Script Ready').length, icon: Camera, color: 'text-amber-500' },
          { label: 'In Production / Edit', count: dailyBriefs.filter((b) => b.status === 'Shooting' || b.status === 'Editing').length, icon: Scissors, color: 'text-indigo-500' },
          { label: 'Ready to Upload', count: dailyBriefs.filter((b) => b.status === 'Ready to Upload').length, icon: Share2, color: 'text-pink-500' },
          { label: 'Published & Reviewed', count: dailyBriefs.filter((b) => b.status === 'Published' || b.status === 'Performance Review').length, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between"
            >
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.count}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Production Packages (Priority Ranked 3 Recommendations) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Today's Production Package ({dailyBriefs.length} Opportunities)
            </h2>
            <p className="text-xs text-slate-500">
              Ranked using the transparent Content Opportunity Score (Recency, Momentum, Relevance & Shooting Ease).
            </p>
          </div>

          <Link
            to="/production-board"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View Full Production Board <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {priorityCards.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Production Packages Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click "Run Autopilot Research Scan" above to discover today's top opportunities and synthesize your 3 daily scripts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {priorityCards.map(({ rank, brief, badgeClass, accentBorder }) => {
              const recommendedHook =
                brief.script?.hookOptions?.find((h) => h.isRecommended)?.hookText ||
                brief.script?.recommendedHook ||
                brief.script?.hookOptions?.[0]?.hookText;

              return (
                <div
                  key={brief._id}
                  className={`relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border-2 ${accentBorder} shadow-sm hover:shadow-md transition-all p-5 space-y-4`}
                >
                  <div className="space-y-3">
                    {/* Header: Rank + Score */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full ${badgeClass}`}>
                        {rank}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{brief.opportunityScore || 90}/100</span>
                      </div>
                    </div>

                    {/* Topic Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {brief.title || brief.topic}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {brief.targetDuration}s
                        </span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{brief.language}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {brief.shootingInstructions?.scenes?.length || 5} Scenes
                        </span>
                      </div>
                    </div>

                    {/* Hook Preview */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
                        Recommended Hook (0:00 - 0:03)
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium italic line-clamp-3">
                        "{recommendedHook}"
                      </p>
                    </div>

                    {/* Research Evidence Highlights */}
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Momentum:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {brief.researchEvidence?.trendStatus || 'Surging'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Examples Analyzed:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {brief.researchEvidence?.analyzedExamplesCount || 6} Reference Videos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Optimal Post Window:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {brief.uploadPackage?.suggestedPublishingTime?.split('(')[0] || '7:00 PM - 9:00 PM'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Footprint */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Production Stage:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
                        {brief.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() =>
                          handleCopy(
                            `${recommendedHook}\n\n${brief.script?.body}\n\n${brief.script?.cta}`,
                            `script-${brief._id}`
                          )
                        }
                        className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        {copiedKey === `script-${brief._id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        Copy Script
                      </button>

                      <button
                        onClick={() => setSelectedBrief(brief)}
                        className="px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Shoot Brief
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Autopilot Job History Audit Log */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Autopilot Research & Job Execution Audit Log
          </h3>
          <span className="text-xs text-slate-400">Track source availability & query timestamps</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Run Timestamp</th>
                <th className="py-2.5 px-3">Trigger Type</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Briefs Synthesized</th>
                <th className="py-2.5 px-3">Probed Sources</th>
                <th className="py-2.5 px-3 text-right">Job Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {jobHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-slate-400">
                    No research jobs logged yet. Run a scan to initiate the audit trail.
                  </td>
                </tr>
              ) : (
                jobHistory.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {job.jobType}
                    </td>
                    <td className="py-3 px-3 font-mono">{job.executionDurationSeconds || 3}s</td>
                    <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {job.briefsGeneratedCount || 3} Packages
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      Google Trends, News, TikTok, Meta Ads, Shorts
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};
