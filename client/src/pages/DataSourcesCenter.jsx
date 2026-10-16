import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Key,
  Lock,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Info,
  Check,
  ShieldCheck,
  Globe,
  Share2,
  Video,
} from 'lucide-react';
import { dataSourceService } from '../services/dataSourceService';

export const DataSourcesCenter = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingProvider, setTestingProvider] = useState(null);
  const [syncingProvider, setSyncingProvider] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [configModal, setConfigModal] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sources'); // 'sources' | 'setup-guides'

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      const data = await dataSourceService.getDataSources();
      setSources(data);
    } catch (err) {
      setError(err.message || 'Failed to load data sources');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (providerId) => {
    try {
      setTestingProvider(providerId);
      setTestResult(null);
      const res = await dataSourceService.testSource(providerId);
      setTestResult({
        providerId,
        ok: res.data?.testResult?.ok ?? res.success,
        message: res.message || res.data?.testResult?.message,
        latencyMs: res.data?.testResult?.latencyMs,
      });
      await loadSources();
    } catch (err) {
      setTestResult({
        providerId,
        ok: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSyncSource = async (providerId) => {
    try {
      setSyncingProvider(providerId);
      const res = await dataSourceService.syncSource(providerId);
      setTestResult({
        providerId,
        ok: true,
        message: res.message || 'Source synchronized successfully',
      });
      await loadSources();
    } catch (err) {
      setError(err.message || 'Sync failed');
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleOpenConfig = (source) => {
    setConfigModal(source);
    setApiKeyInput('');
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!configModal || !apiKeyInput.trim()) return;

    try {
      setSavingConfig(true);
      await dataSourceService.configureSource(configModal.providerId, {
        apiKey: apiKeyInput.trim(),
        token: apiKeyInput.trim(),
      });
      setConfigModal(null);
      setApiKeyInput('');
      await loadSources();
    } catch (err) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDisconnect = async (providerId) => {
    if (!window.confirm(`Are you sure you want to disconnect ${providerId}?`)) return;
    try {
      setLoading(true);
      await dataSourceService.disconnectSource(providerId);
      await loadSources();
    } catch (err) {
      setError(err.message || 'Failed to disconnect source');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Connected':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        );
      case 'Limited Access':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Limited Access
          </span>
        );
      case 'Authentication Required':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Auth Required
          </span>
        );
      case 'Error':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Error
          </span>
        );
      case 'Disconnected':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
            Disconnected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            Not Configured
          </span>
        );
    }
  };

  const contributingSourcesCount = sources.filter(
    (s) => s.status === 'Connected' || s.status === 'Limited Access'
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Data Sources Connection Center
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage live API adapters for Google Gemini AI, YouTube, Instagram, TikTok, Google Trends, Meta Ads, and Tavily. Real connectivity is tested before reporting active status.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'sources'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Connected Adapters ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('setup-guides')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'setup-guides'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Setup Documentation
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-slate-800 dark:text-slate-200">
            <strong>{contributingSourcesCount} of {sources.length} Sources Active:</strong> Research scans dynamically combine search demand, video statistics, and advertising formats with zero fabricated data.
          </span>
        </div>
        <button
          onClick={loadSources}
          className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh All
        </button>
      </div>

      {/* Test Result Toast */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 animate-in fade-in ${
            testResult.ok
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            )}
            <div>
              <strong>Test Result for {testResult.providerId}:</strong> {testResult.message}
              {testResult.latencyMs && (
                <span className="ml-2 font-mono text-[11px] opacity-80">({testResult.latencyMs}ms latency)</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* TAB 1: DATA SOURCES CARDS */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((source) => {
            const isTesting = testingProvider === source.providerId;
            const isSyncing = syncingProvider === source.providerId;

            return (
              <div
                key={source.providerId}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header: Title + Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        {source.category}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {source.displayName}
                      </h3>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>

                  {/* Credentials / Config status */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Environment Var:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {source.configSummary?.environmentVarName || 'None required'}
                      </span>
                    </div>
                    {source.configSummary?.maskedKey && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Key Hash:</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {source.configSummary.maskedKey}
                        </span>
                      </div>
                    )}
                    {source.lastSuccessLatencyMs > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Response Latency:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {source.lastSuccessLatencyMs}ms
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Available Features */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      Active Capabilities
                    </span>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {source.availableFeatures?.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations Notice */}
                  {source.limitations?.length > 0 && (
                    <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 text-[11px] text-amber-800 dark:text-amber-300/80 space-y-0.5">
                      <span className="font-bold block">Access Scope:</span>
                      <p className="line-clamp-2">{source.limitations[0]}</p>
                    </div>
                  )}

                  {/* Last Sync */}
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Last Synced:</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleTimeString() : 'Not synced yet'}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTestConnection(source.providerId)}
                      disabled={isTesting}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {isTesting ? 'Pinging...' : 'Test API'}
                    </button>

                    <button
                      onClick={() => handleSyncSource(source.providerId)}
                      disabled={isSyncing}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      Sync Data
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {source.requiresAuth ? (
                      <button
                        onClick={() => handleOpenConfig(source)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        Configure Credentials
                      </button>
                    ) : (
                      <span className="text-slate-400">Zero Auth Required</span>
                    )}

                    {source.documentationUrl && (
                      <a
                        href={source.documentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SETUP INSTRUCTIONS ACCORDION */}
      {activeTab === 'setup-guides' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Provider API Credentials & Setup Guide
            </h2>
            <p className="text-xs text-slate-500">
              Step-by-step instructions for enabling official developer credentials in Google Cloud, Meta Developers, and Tavily.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. Google Gemini AI Engine */}
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  1. Google Gemini AI Engine (Google AI Studio)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                  GEMINI_API_KEY
                </span>
              </div>
              <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal pl-5 space-y-1 leading-relaxed">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">Google AI Studio (aistudio.google.com/app/apikey)</a>.</li>
                <li>Sign in with your Google account and click <strong>Create API Key</strong>.</li>
                <li>Copy the key and click <strong>Configure Credentials</strong> on the Google Gemini card above, or paste into <code className="text-indigo-600">server/.env</code> as <code className="text-indigo-600">GEMINI_API_KEY</code>.</li>
                <li>Click <strong>Test Connection</strong> to verify live connection and view roundtrip ping latency!</li>
              </ol>
            </div>

            {/* 2. YouTube Data API v3 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  2. YouTube Data API v3 Setup (Google Cloud Console)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                  YOUTUBE_API_KEY
                </span>
              </div>
              <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal pl-5 space-y-1 leading-relaxed">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Google Cloud Console</a> and create or select a project.</li>
                <li>Navigate to <strong>APIs & Services → Library</strong> and search for <strong>YouTube Data API v3</strong>. Click <strong>Enable</strong>.</li>
                <li>Go to <strong>APIs & Services → Credentials</strong>, click <strong>Create Credentials → API Key</strong>.</li>
                <li>Copy the generated key and click <strong>Configure Credentials</strong> on the YouTube card above or paste into <code className="text-indigo-600">server/.env</code> as <code className="text-indigo-600">YOUTUBE_API_KEY</code>.</li>
              </ol>
            </div>

            {/* 3. Meta Graph API & Instagram */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-500" />
                  3. Meta Graph API (Instagram Business & Ads Archive)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                  META_ACCESS_TOKEN
                </span>
              </div>
              <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal pl-5 space-y-1 leading-relaxed">
                <li>Register a Meta Developer account at <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">developers.facebook.com</a>.</li>
                <li>Create an App with the <strong>Business</strong> use case.</li>
                <li>Add the <strong>Instagram Graph API</strong> product. Link your Instagram Professional account to a Facebook Page.</li>
                <li>Generate a User Access Token with permissions: <code className="text-indigo-600">instagram_basic</code>, <code className="text-indigo-600">instagram_manage_insights</code>, <code className="text-indigo-600">pages_read_engagement</code>.</li>
                <li>Paste the access token into <code className="text-indigo-600">META_ACCESS_TOKEN</code> to enable connected reel telemetry.</li>
              </ol>
            </div>

            {/* 4. Tavily AI Search */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  4. Tavily AI Deep News Search
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                  TAVILY_API_KEY
                </span>
              </div>
              <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal pl-5 space-y-1 leading-relaxed">
                <li>Sign up at <a href="https://tavily.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">tavily.com</a> (includes free monthly queries).</li>
                <li>Copy your API key from the dashboard.</li>
                <li>Paste into <code className="text-indigo-600">TAVILY_API_KEY</code> in <code className="text-indigo-600">server/.env</code> or use the Configure button.</li>
                <li><em>Note: Even without a key, Google News real-time RSS search is always active as a zero-cost fallback!</em></li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Configure Credentials Modal */}
      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Configure {configModal.displayName}
                </h3>
                <span className="text-xs text-slate-400">
                  Environment Var: <code className="text-indigo-600">{configModal.configSummary?.environmentVarName}</code>
                </span>
              </div>
              <button
                onClick={() => setConfigModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  API Key or Access Token
                </label>
                <input
                  type="password"
                  required
                  placeholder="Paste your key or token..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  * Credentials are stored securely on the server and tested immediately before activation.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConfigModal(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  {savingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {savingConfig ? 'Testing & Saving...' : 'Save & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
