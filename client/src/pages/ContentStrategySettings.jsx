import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Building2,
  Globe,
  Languages,
  Share2,
  Video,
  Camera,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Check,
  RefreshCw,
  Clock,
  Radio,
  UserCheck,
  Megaphone,
  BookOpen,
} from 'lucide-react';
import { contentStrategyService } from '../services/contentStrategyService';
import { LANGUAGES } from '../utils/constants';

export const ContentStrategySettings = () => {
  const [strategies, setStrategies] = useState([]);
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const list = await contentStrategyService.getAllStrategies();
      setStrategies(list);
      const active = list.find((s) => s.isActive) || list[0];
      setActiveStrategy(active || null);
    } catch (err) {
      setError(err.message || 'Failed to load content strategy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchActive = async (id) => {
    try {
      setLoading(true);
      const updated = await contentStrategyService.setActiveStrategy(id);
      setActiveStrategy(updated);
      await loadStrategies();
    } catch (err) {
      setError(err.message || 'Failed to switch active profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setActiveStrategy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setActiveStrategy((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!activeStrategy) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await contentStrategyService.updateStrategy(
        activeStrategy._id,
        activeStrategy
      );
      setActiveStrategy(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadStrategies();
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    try {
      setSaving(true);
      const created = await contentStrategyService.createStrategy({
        brandName: newBrandName.trim(),
        primaryNiche: 'Entrepreneurship & Business Growth',
        subNiche: 'Bootstrapping & Systems',
        industry: 'Business & Technology',
        country: 'India',
        city: 'Pan-India',
        preferredLanguage: 'Hinglish',
        primaryPlatform: 'Instagram Reels',
        isActive: true,
      });
      setShowNewModal(false);
      setNewBrandName('');
      await loadStrategies();
      setActiveStrategy(created);
    } catch (err) {
      setError(err.message || 'Failed to create new brand profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !activeStrategy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading Content Strategy Profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Content Strategy Engine Settings
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure once. The Autopilot Research Engine uses these parameters to discover real trends, analyze competitor patterns, and synthesize daily production packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            New Brand / Niche
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saveSuccess ? 'Saved Changes!' : 'Save Settings'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Multi-Brand Switcher Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Brand / Niche Profiles ({strategies.length})
          </h3>
          <span className="text-xs text-slate-400">Click a card to switch the active brand</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {strategies.map((strat) => (
            <div
              key={strat._id}
              onClick={() => handleSwitchActive(strat._id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                strat.isActive
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {strat.brandName}
                </span>
                {strat.isActive ? (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">Inactive</span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {strat.primaryNiche}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-semibold">
                <span>{strat.country || 'India'}</span>
                <span>•</span>
                <span>{strat.preferredLanguage || 'Hinglish'}</span>
                <span>•</span>
                <span>{strat.module || 'Personal Branding'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeStrategy && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-column configuration form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Core Niche & Audience */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Globe className="w-5 h-5 text-indigo-500" />
                1. Niche, Demographics & Target Audience
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Business Name
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.brandName || ''}
                    onChange={(e) => handleChange('brandName', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Industry / Vertical
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.industry || ''}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Finance and Taxation, SaaS, Fitness"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Niche
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.primaryNiche || ''}
                    onChange={(e) => handleChange('primaryNiche', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Income Tax & Financial Planning"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-Niche / Core Focus
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.subNiche || ''}
                    onChange={(e) => handleChange('subNiche', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Old vs New Tax Regime for Salaried"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience Description
                </label>
                <textarea
                  rows="2"
                  value={activeStrategy.targetAudience || ''}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                  placeholder="e.g. Working professionals aged 25-45 in India seeking practical tax deductions and wealth building advice"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Country
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.country || 'India'}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Regional Focus
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.city || 'Pan-India / Metro Hubs'}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={activeStrategy.preferredLanguage || 'Hinglish'}
                    onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Content Module & Objectives */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                2. Marketing Module & Objectives
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'personal-branding',
                    title: 'Personal Branding',
                    icon: UserCheck,
                    desc: 'Build trust, high authority & follower momentum without hard pitches.',
                  },
                  {
                    id: 'meta-ads',
                    title: 'Meta Ads',
                    icon: Megaphone,
                    desc: 'Conversion-driven scripts for paid campaigns with verified claims.',
                  },
                  {
                    id: 'story-marketing',
                    title: 'Story Marketing',
                    icon: BookOpen,
                    desc: 'Slide-by-slide storytelling with polls, questions, and CTAs.',
                  },
                ].map((mod) => {
                  const Icon = mod.icon;
                  const isSelected = activeStrategy.module === mod.id;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleChange('module', mod.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${
                          isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                        }`}
                      />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{mod.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Content Objective
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.contentObjective || 'Authority and Trust'}
                    onChange={(e) => handleChange('contentObjective', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Posting Frequency
                  </label>
                  <select
                    value={activeStrategy.postingFrequency || 'Daily'}
                    onChange={(e) => handleChange('postingFrequency', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Daily">Daily (1 Reel/day)</option>
                    <option value="5x per week">5x per week</option>
                    <option value="3x per week">3x per week</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Typical Duration (Sec)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={activeStrategy.typicalDuration || 60}
                    onChange={(e) => handleChange('typicalDuration', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Production & Hardware Realities */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Camera className="w-5 h-5 text-indigo-500" />
                3. Production Equipment & Shooting Preference
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Presentation Format Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'On-Camera Talking Head',
                    'Voiceover + B-roll',
                    'Mixed / Dynamic Interview',
                  ].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => handleChange('presentationPreference', pref)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                        activeStrategy.presentationPreference === pref
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Available Shooting Equipment (Autopilot tailors instructions to this gear)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Smartphone only (iPhone / Android HD)',
                    'Tripod with Ring Light',
                    'Wireless Lapel Mic',
                    'Desk Setup / Computer Screen Capture',
                    'DSLR Camera with Prime Lens',
                    'Professional Studio Softbox Lights',
                  ].map((equip) => {
                    const isChecked = activeStrategy.availableEquipment?.includes(equip);
                    return (
                      <label
                        key={equip}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = activeStrategy.availableEquipment || [];
                            const updated = e.target.checked
                              ? [...current, equip]
                              : current.filter((x) => x !== equip);
                            handleChange('availableEquipment', updated);
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{equip}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Guidelines & Voice Tone
                </label>
                <textarea
                  rows="2"
                  value={activeStrategy.brandGuidelines || ''}
                  onChange={(e) => handleChange('brandGuidelines', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                  placeholder="e.g. Friendly mentor persona, direct to the point, clear steps, no unnecessary jargon"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Restricted Claims & Compliance Guardrails (comma separated)
                </label>
                <input
                  type="text"
                  value={activeStrategy.restrictedClaims?.join(', ') || ''}
                  onChange={(e) =>
                    handleChange(
                      'restrictedClaims',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Never guarantee zero tax, No unverified returns, Always cite section 80C accurately"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar: Connected Account & Automation Settings */}
          <div className="space-y-6">
            {/* Connected Account Insights */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-500" />
                  Connected Account
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  {activeStrategy.connectedAccountInsights?.isConnected ? 'Active Sync' : 'Disconnected'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.connectedAccountInsights?.accountHandle || ''}
                    onChange={(e) =>
                      handleNestedChange('connectedAccountInsights', 'accountHandle', e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    placeholder="@your_brand_handle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Followers
                    </label>
                    <input
                      type="number"
                      value={activeStrategy.connectedAccountInsights?.followersCount || ''}
                      onChange={(e) =>
                        handleNestedChange('connectedAccountInsights', 'followersCount', Number(e.target.value))
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Baseline ER
                    </label>
                    <input
                      type="text"
                      value={activeStrategy.connectedAccountInsights?.baselineEngagementRate || '4.8%'}
                      onChange={(e) =>
                        handleNestedChange('connectedAccountInsights', 'baselineEngagementRate', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-slate-400 block">Peak Online Hours</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {activeStrategy.connectedAccountInsights?.topActiveHours?.join(', ') || '7:00 PM - 9:00 PM IST'}
                  </p>
                </div>
              </div>
            </div>

            {/* Scheduled Autopilot Cadence */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Scheduled Autopilot
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeStrategy.scheduleSettings?.enabled ?? true}
                    onChange={(e) =>
                      handleNestedChange('scheduleSettings', 'enabled', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Daily Scan Time
                  </label>
                  <input
                    type="text"
                    value={activeStrategy.scheduleSettings?.runTime || '08:00 AM IST'}
                    onChange={(e) =>
                      handleNestedChange('scheduleSettings', 'runTime', e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                  <p className="font-semibold">⚡ Zero-Touch Automated Production</p>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                    At 08:00 AM every morning, the scheduler queries Google Trends, Google News, TikTok, Meta Ads, and Shorts to synthesize your 3 daily scripts.
                  </p>
                </div>
              </div>
            </div>

            {/* Competitor Surveillance */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Competitor Reference Handles
              </h3>
              <p className="text-xs text-slate-500">
                Comma-separated accounts whose public content formats and hook formulas to monitor.
              </p>
              <input
                type="text"
                value={activeStrategy.competitorHandles?.join(', ') || ''}
                onChange={(e) =>
                  handleChange(
                    'competitorHandles',
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                placeholder="@handle1, @handle2"
              />
            </div>
          </div>
        </div>
      )}

      {/* New Brand Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Brand / Niche Profile
            </h3>
            <p className="text-xs text-slate-500">
              Set up a distinct persona, industry, and language profile for another channel or client.
            </p>

            <form onSubmit={handleCreateNewBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand or Creator Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Growth Marketing Lab"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
