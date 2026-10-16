import React from 'react';
import { Search, Filter, RotateCcw, Bookmark } from 'lucide-react';
import {
  TREND_INDUSTRIES,
  TREND_PLATFORMS,
  TREND_REGIONS,
  TREND_LIFECYCLES,
  TREND_SOURCES,
  MODULES,
  PERSONAL_BRANDING_CATEGORIES,
  META_ADS_CATEGORIES,
  STORY_MARKETING_CATEGORIES,
} from '../../utils/constants';

export const TrendFilters = ({ filters, onChange, onReset }) => {
  const getCategoriesForModule = () => {
    switch (filters.module) {
      case 'personal-branding':
        return PERSONAL_BRANDING_CATEGORIES;
      case 'meta-ads':
        return META_ADS_CATEGORIES;
      case 'story-marketing':
        return STORY_MARKETING_CATEGORIES;
      default:
        return [
          ...PERSONAL_BRANDING_CATEGORIES,
          ...META_ADS_CATEGORIES,
          ...STORY_MARKETING_CATEGORIES,
        ];
    }
  };

  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const availableCategories = getCategoriesForModule();

  return (
    <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
      {/* Search & Main Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search trends by keyword..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full rounded-xl pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
          />
        </div>

        {/* Industry */}
        <div>
          <select
            value={filters.industry || 'All'}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
          >
            <option value="All">All Industries</option>
            {TREND_INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Module */}
        <div>
          <select
            value={filters.module || 'All'}
            onChange={(e) => {
              onChange({ ...filters, module: e.target.value, category: 'All' });
            }}
            className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
          >
            <option value="All">All Script Modules</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
          >
            <option value="All">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Row: Platform, Lifecycle, Source, Sort, Reset */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Platform */}
        <select
          value={filters.platform || 'All'}
          onChange={(e) => handleInputChange('platform', e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Platforms</option>
          {TREND_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Lifecycle */}
        <select
          value={filters.lifecycle || 'All'}
          onChange={(e) => handleInputChange('lifecycle', e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Lifecycles</option>
          {TREND_LIFECYCLES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Source */}
        <select
          value={filters.source || 'All'}
          onChange={(e) => handleInputChange('source', e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Sources</option>
          {TREND_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy || 'opportunityScore'}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="opportunityScore">Top Opportunity Score</option>
          <option value="momentumScore">Top Momentum Score</option>
          <option value="newest">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>

        {/* Saved Only toggle */}
        <button
          type="button"
          onClick={() => handleInputChange('isSaved', filters.isSaved === 'true' ? 'false' : 'true')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-all ${
            filters.isSaved === 'true'
              ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
          }`}
        >
          <Bookmark className={`w-3 h-3 ${filters.isSaved === 'true' ? 'fill-current' : ''}`} />
          <span>Saved Only</span>
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
