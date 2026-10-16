import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Megaphone,
  BookOpen,
  Layers,
  Sparkles,
  Bookmark,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Cpu,
  X,
  TrendingUp,
  Compass,
  FileCode,
  BookmarkCheck,
  Clock,
  Zap,
  Camera,
  Sliders,
  BarChart2,
  ShoppingBag,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/product-autoscript', label: 'Product AutoScript', icon: ShoppingBag, badge: 'Auto', highlight: true },
  { path: '/autopilot', label: 'Autopilot Engine', icon: Zap, badge: 'Real Data' },
  { path: '/production-board', label: 'Production Board', icon: Camera, badge: '9-Stage' },
  { path: '/data-sources', label: 'Data Sources', icon: Database, badge: '6 Sources' },
  { path: '/content-strategy-settings', label: 'Content Strategy', icon: Sliders },
  { path: '/performance-review', label: 'Performance Review', icon: BarChart2 },
  { path: '/market-trends', label: 'Market Trends', icon: TrendingUp, badge: 'Live' },
  { path: '/trend-analysis', label: 'Trend Analysis', icon: Compass },
  { path: '/master-prompt-generator', label: 'Master Prompt Generator', icon: FileCode },
  { path: '/trend-research-history', label: 'Trend Research History', icon: Clock },
  { path: '/saved-master-prompts', label: 'Saved Master Prompts', icon: BookmarkCheck },
  { path: '/personal-branding', label: 'Personal Branding', icon: UserCheck, badge: 'Viral' },
  { path: '/meta-ads', label: 'Meta Ads', icon: Megaphone, badge: 'ROI' },
  { path: '/story-marketing', label: 'Story Marketing', icon: BookOpen },
  { path: '/script-definition', label: 'Script Definition', icon: Layers },
  { path: '/script-generator', label: 'Script Generator', icon: Sparkles },
  { path: '/saved-scripts', label: 'Saved Scripts', icon: Bookmark },
  { path: '/script-history', label: 'Script History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  systemStatus,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out dark:border-slate-800/80 dark:bg-slate-950 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Script<span className="text-indigo-600 dark:text-indigo-400">Craft</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  AI Marketing Suite
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-600/15 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                  } ${item.highlight && !isActive ? 'border border-indigo-200/60 dark:border-indigo-800/40' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-105" />
                {(!isCollapsed || mobileOpen) && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {(!isCollapsed || mobileOpen) && item.badge && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Status Footer */}
        {(!isCollapsed || mobileOpen) ? (
          <div className="border-t border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Database className="w-3.5 h-3.5 text-emerald-500" /> MongoDB
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" /> AI Engine
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {systemStatus?.ai?.isConfigured ? 'Live AI' : 'Demo Engine'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200/80 p-2 flex justify-center dark:border-slate-800/80">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Online & Connected" />
          </div>
        )}
      </aside>
    </>
  );
};
