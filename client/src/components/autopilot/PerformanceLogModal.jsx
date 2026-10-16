import React, { useState } from 'react';
import { X, TrendingUp, CheckCircle, BarChart2, ShieldAlert } from 'lucide-react';
import { autopilotService } from '../../services/autopilotService';

export const PerformanceLogModal = ({ brief, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    publicationAgeDays: brief.performanceFeedback?.publicationAgeDays || 1,
    views: brief.performanceFeedback?.views || '',
    reach: brief.performanceFeedback?.reach || '',
    watchTimeSeconds: brief.performanceFeedback?.watchTimeSeconds || '',
    averageRetentionPct: brief.performanceFeedback?.averageRetentionPct || '',
    shares: brief.performanceFeedback?.shares || '',
    saves: brief.performanceFeedback?.saves || '',
    comments: brief.performanceFeedback?.comments || '',
    followsGained: brief.performanceFeedback?.followsGained || '',
    creatorNotes: brief.performanceFeedback?.creatorNotes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        publicationAgeDays: Number(formData.publicationAgeDays) || 1,
        views: Number(formData.views) || 0,
        reach: Number(formData.reach) || 0,
        watchTimeSeconds: Number(formData.watchTimeSeconds) || 0,
        averageRetentionPct: Number(formData.averageRetentionPct) || 0,
        shares: Number(formData.shares) || 0,
        saves: Number(formData.saves) || 0,
        comments: Number(formData.comments) || 0,
        followsGained: Number(formData.followsGained) || 0,
        creatorNotes: formData.creatorNotes,
      };

      const result = await autopilotService.logPerformance(brief._id, payload);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to log performance metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Video Performance
              </h3>
              <p className="text-xs text-slate-500">
                Compare real reel analytics to improve future research scans
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
            <strong>Brief:</strong> {brief.title || brief.topic} ({brief.priorityRank})
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Days Since Upload
              </label>
              <input
                type="number"
                name="publicationAgeDays"
                min="0"
                value={formData.publicationAgeDays}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Views / Plays
              </label>
              <input
                type="number"
                name="views"
                placeholder="e.g. 15400"
                value={formData.views}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accounts Reached
              </label>
              <input
                type="number"
                name="reach"
                placeholder="e.g. 11200"
                value={formData.reach}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avg Retention Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="averageRetentionPct"
                placeholder="e.g. 64.5"
                value={formData.averageRetentionPct}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Saves
              </label>
              <input
                type="number"
                name="saves"
                placeholder="e.g. 420"
                value={formData.saves}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shares
              </label>
              <input
                type="number"
                name="shares"
                placeholder="e.g. 210"
                value={formData.shares}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Follows
              </label>
              <input
                type="number"
                name="followsGained"
                placeholder="e.g. 85"
                value={formData.followsGained}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Creator Observations & Audience Questions
            </label>
            <textarea
              name="creatorNotes"
              rows="3"
              placeholder="What questions did viewers ask in the comments? Which hook phrasing resonated most?"
              value={formData.creatorNotes}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 leading-tight">
            * These analytics feed the Content Opportunity Score algorithm to weight higher retention topics in future scans.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-60"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Saving Metrics...' : 'Save Performance Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
