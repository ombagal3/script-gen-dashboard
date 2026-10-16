import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { Dashboard } from '../pages/Dashboard';
import { ProductAutoScript } from '../pages/ProductAutoScript';
import { AutopilotEngine } from '../pages/AutopilotEngine';
import { ProductionBoard } from '../pages/ProductionBoard';
import { ContentStrategySettings } from '../pages/ContentStrategySettings';
import { PerformanceAnalytics } from '../pages/PerformanceAnalytics';
import { DataSourcesCenter } from '../pages/DataSourcesCenter';
import { MarketTrends } from '../pages/MarketTrends';
import { TrendAnalysis } from '../pages/TrendAnalysis';
import { TrendDetail } from '../pages/TrendDetail';
import { MasterPromptGenerator } from '../pages/MasterPromptGenerator';
import { TrendResearchHistory } from '../pages/TrendResearchHistory';
import { SavedMasterPrompts } from '../pages/SavedMasterPrompts';
import { PersonalBranding } from '../pages/PersonalBranding';
import { MetaAds } from '../pages/MetaAds';
import { StoryMarketing } from '../pages/StoryMarketing';
import { ScriptDefinition } from '../pages/ScriptDefinition';
import { ScriptGenerator } from '../pages/ScriptGenerator';
import { SavedScripts } from '../pages/SavedScripts';
import { ScriptHistory } from '../pages/ScriptHistory';
import { Settings } from '../pages/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/product-autoscript" element={<ProductAutoScript />} />
        <Route path="/autopilot" element={<AutopilotEngine />} />
        <Route path="/production-board" element={<ProductionBoard />} />
        <Route path="/content-strategy-settings" element={<ContentStrategySettings />} />
        <Route path="/performance-review" element={<PerformanceAnalytics />} />
        <Route path="/data-sources" element={<DataSourcesCenter />} />
        <Route path="/market-trends" element={<MarketTrends />} />
        <Route path="/trend-analysis" element={<TrendAnalysis />} />
        <Route path="/trends/:id" element={<TrendDetail />} />
        <Route path="/master-prompt-generator" element={<MasterPromptGenerator />} />
        <Route path="/trend-research-history" element={<TrendResearchHistory />} />
        <Route path="/saved-master-prompts" element={<SavedMasterPrompts />} />
        <Route path="/personal-branding" element={<PersonalBranding />} />
        <Route path="/meta-ads" element={<MetaAds />} />
        <Route path="/story-marketing" element={<StoryMarketing />} />
        <Route path="/script-definition" element={<ScriptDefinition />} />
        <Route path="/script-generator" element={<ScriptGenerator />} />
        <Route path="/saved-scripts" element={<SavedScripts />} />
        <Route path="/script-history" element={<ScriptHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
