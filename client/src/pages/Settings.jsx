import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Database,
  Cpu,
  ShieldCheck,
  User,
  Key,
  Globe,
  Clock,
  Save,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { LANGUAGES, DURATIONS } from '../utils/constants';
import api from '../services/api';

export const Settings = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isGuest, updatePreferences } = useAuth();

  const [systemStatus, setSystemStatus] = useState(null);
  const [defaultLanguage, setDefaultLanguage] = useState(user?.preferences?.defaultLanguage || 'English');
  const [defaultDuration, setDefaultDuration] = useState(user?.preferences?.defaultDuration || 60);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/dashboard/status');
        setSystemStatus(res.data);
      } catch (err) {
        console.warn('Could not fetch status:', err.message);
      }
    };
    fetchStatus();
  }, []);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    await updatePreferences({
      defaultLanguage,
      defaultDuration: parseInt(defaultDuration, 10),
    });
    setToastMessage('Preferences updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <SettingsIcon className="w-4 h-4" /> Configuration Hub
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          System & Dashboard Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage visual preferences, inspect live server and MongoDB connectivity, and configure default script values.
        </p>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: THEME & DISPLAY */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Appearance & Theme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between high-contrast Dark Mode or clean Light Mode.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center space-y-2 ${
                !isDark ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sun className="mx-auto w-6 h-6 text-amber-500" />
              <div className="text-xs font-bold">Light Mode</div>
            </div>

            <div
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center space-y-2 ${
                isDark ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Moon className="mx-auto w-6 h-6 text-indigo-400" />
              <div className="text-xs font-bold">Dark Mode</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: AI INTEGRATION & DEMO MODE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Provider & Generation Engine
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Server-side LLM service status and fallback configuration.
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold border ${
                systemStatus?.ai?.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
              }`}
            >
              {systemStatus?.ai?.modeLabel || 'Intelligent Demo Mode'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Configured Provider:</span>
              <strong className="text-slate-800 dark:text-slate-200 uppercase">{systemStatus?.ai?.provider || 'gemini'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Model Name:</span>
              <strong className="text-slate-800 dark:text-slate-200">{systemStatus?.ai?.model || 'gemini-1.5-flash'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credentials Security:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Kept strictly in server/.env (Never exposed to client)
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>How to enable live AI:</strong> Add your Google Gemini or OpenAI API key to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">server/.env</code> under <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">AI_API_KEY=...</code>. When no key is provided, the Intelligent Demo Engine dynamically produces realistic, high-converting scripts matching all categories, durations, and methods.
          </p>
        </div>

        {/* SECTION 3: MONGODB DATABASE CONNECTIVITY */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Database & Cloud Storage
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Persistent MongoDB cluster connection.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {systemStatus?.database?.readyStateText?.toUpperCase() || 'CONNECTED'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Database Name:</span>
              <strong className="text-slate-800 dark:text-slate-200">{systemStatus?.database?.name || 'script_dashboard'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MongoDB Host:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{systemStatus?.database?.host || 'MongoDB Atlas'}</strong>
            </div>
          </div>
        </div>

        {/* SECTION 5: DATA SOURCES & RESEARCH ADAPTERS */}
        <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40 p-6 shadow-xs dark:border-indigo-900/50 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Market Data Sources & Connection Center
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage YouTube Data API, Meta Graph API, TikTok Creative Center, Google Trends, and Tavily integrations.
                </p>
              </div>
            </div>
            <a
              href="/data-sources"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              Open Data Sources Hub &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <strong className="block text-slate-800 dark:text-slate-200 mb-1">Live Telemetry Feeds</strong>
              <p className="text-slate-500 text-[11px]">
                Test connection latency, enter API keys, or sync real-time short-form and search demand data.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <strong className="block text-slate-800 dark:text-slate-200 mb-1">Content Strategy Engine</strong>
              <p className="text-slate-500 text-[11px]">
                Configure target demographics, available equipment, presentation styles, and brand guardrails.
              </p>
              <a href="/content-strategy-settings" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-1 inline-block">
                Edit Content Strategy &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
