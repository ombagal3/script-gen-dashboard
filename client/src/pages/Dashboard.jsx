import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UserCheck,
  Megaphone,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { ScriptCard } from '../components/scripts/ScriptCard';
import { Modal } from '../components/common/Modal';
import { ScriptPreview } from '../components/scripts/ScriptPreview';
import { EmptyState } from '../components/common/EmptyState';
import { useScripts } from '../hooks/useScripts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalScripts: 0,
    personalBrandingScripts: 0,
    metaAdsScripts: 0,
    storyMarketingScripts: 0,
    draftScripts: 0,
    readyScripts: 0,
    publishedScripts: 0,
    archivedScripts: 0,
  });
  const [recentScripts, setRecentScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  const { duplicateScript, deleteScript, updateStatus, toast } = useScripts();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, recentsRes, statusRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recent-scripts?limit=6'),
        api.get('/dashboard/status'),
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (recentsRes.data?.scripts) setRecentScripts(recentsRes.data.scripts);
      if (statusRes.data) setSystemStatus(statusRes.data);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDuplicate = async (id) => {
    await duplicateScript(id);
    fetchDashboardData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      await deleteScript(id);
      fetchDashboardData();
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    fetchDashboardData();
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border animate-fade-in ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> High-Retention Script & Marketing Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generate viral scripts & high-converting ads in seconds.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Create structured Personal Branding reels, direct-response Meta Ads, and multi-slide Story funnels with proven writing methods.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="md"
              onClick={() => navigate('/script-generator')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Open Universal Generator
            </Button>
            <Button
              variant="outline"
              size="md"
              className="text-white border-indigo-400/50 bg-indigo-900/40 hover:bg-indigo-900/70"
              onClick={() => navigate('/market-trends')}
              leftIcon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
            >
              Market Trends & Prompts
            </Button>
            <Button
              variant="outline"
              size="md"
              className="text-white border-slate-700 hover:bg-slate-800"
              onClick={() => navigate('/script-definition')}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Method Builder
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Autopilot Daily Production Spotlight */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-slate-950" /> AUTOPILOT ENGINE
            </span>
            <span className="text-xs text-indigo-200">Daily Market Intelligence ➔ Ready-to-Shoot Scripts</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Stop researching trends & writing prompts manually.
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Autopilot continuously scans Google Trends India, TikTok Creative Center, Meta Ads, and YouTube Shorts to synthesize 3 daily production briefs. Your sole focus is shooting, editing, reviewing factual claims, and uploading.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="md"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate('/autopilot')}
            leftIcon={<Zap className="w-4 h-4 text-amber-300" />}
          >
            Open Autopilot Hub
          </Button>
          <Button
            variant="outline"
            size="md"
            className="text-white border-slate-700 hover:bg-slate-800"
            onClick={() => navigate('/production-board')}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            9-Stage Board
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Performance & Script Overview
          </h2>
          <span className="text-xs text-slate-400">
            Synced with MongoDB
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* 1. Total Scripts */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalScripts}
            </div>
            <span className="text-[10px] text-slate-400">Across all categories</span>
          </div>

          {/* 2. Personal Branding */}
          <div className="rounded-2xl border border-purple-200/60 bg-purple-50/30 p-4 shadow-xs dark:border-purple-900/40 dark:bg-purple-950/20">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Branding</span>
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-purple-700 dark:text-purple-300">
              {stats.personalBrandingScripts}
            </div>
            <span className="text-[10px] text-purple-500">Authority & Reach</span>
          </div>

          {/* 3. Meta Ads */}
          <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/30 p-4 shadow-xs dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Meta Ads</span>
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-indigo-700 dark:text-indigo-300">
              {stats.metaAdsScripts}
            </div>
            <span className="text-[10px] text-indigo-500">High ROAS copy</span>
          </div>

          {/* 4. Story Marketing */}
          <div className="rounded-2xl border border-pink-200/60 bg-pink-50/30 p-4 shadow-xs dark:border-pink-900/40 dark:bg-pink-950/20">
            <div className="flex items-center justify-between text-pink-600 dark:text-pink-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Stories</span>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-pink-700 dark:text-pink-300">
              {stats.storyMarketingScripts}
            </div>
            <span className="text-[10px] text-pink-500">DM & Sticker Funnels</span>
          </div>

          {/* 5. Drafts */}
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/30 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">
              {stats.draftScripts}
            </div>
            <span className="text-[10px] text-amber-500">In progress</span>
          </div>

          {/* 6. Ready */}
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Ready</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.readyScripts}
            </div>
            <span className="text-[10px] text-emerald-500">Ready to record</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Quick Launch Generators
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Personal Branding */}
          <div
            onClick={() => navigate('/personal-branding')}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-purple-400 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Personal Branding
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              CA, Doctor, Business Owner, Education & Stories for authority without selling.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 gap-1">
              Start Branding <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Meta Ads */}
          <div
            onClick={() => navigate('/meta-ads')}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Megaphone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Meta Ads Studio
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              10 Ad categories with visual storyboards, voiceovers, headlines, and primary copy.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1">
              Create Ad Script <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Story Marketing */}
          <div
            onClick={() => navigate('/story-marketing')}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
              Story Sequences
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Slide-by-slide 3-7 story sequences with sticker recommendations and DM funnels.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-pink-600 dark:text-pink-400 gap-1">
              Build Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Method Builder */}
          <div
            onClick={() => navigate('/script-definition')}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
              Method Builder
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Design, reorder, and save custom writing frameworks (Hook → Body → CTA).
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 gap-1">
              Customize Methods <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scripts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Generated & Updated Scripts
            </h2>
            <p className="text-xs text-slate-400">
              Saved persistently in MongoDB database
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/saved-scripts')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All ({stats.totalScripts})
          </Button>
        </div>

        {recentScripts.length === 0 ? (
          <EmptyState
            title="No scripts generated yet"
            description="Choose a module above or use the Universal Generator to generate your first script."
            actionLabel="Generate Now"
            onAction={() => navigate('/script-generator')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentScripts.map((script) => (
              <ScriptCard
                key={script._id || script.id}
                script={script}
                onView={(s) => setSelectedScript(s)}
                onEdit={(s) => navigate(`/script-generator?editId=${s._id || s.id}`)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Script Preview Modal */}
      <Modal
        isOpen={!!selectedScript}
        onClose={() => setSelectedScript(null)}
        title={selectedScript?.title || 'Script Details'}
        size="lg"
      >
        <ScriptPreview
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
          onEdit={(s) => {
            setSelectedScript(null);
            navigate(`/script-generator?editId=${s._id || s.id}`);
          }}
        />
      </Modal>
    </div>
  );
};
