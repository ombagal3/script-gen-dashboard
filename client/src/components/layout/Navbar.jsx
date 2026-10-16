import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Plus,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';

export const Navbar = ({ setMobileOpen, systemStatus }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isGuest, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/saved-scripts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        await register(authName, authEmail, authPassword);
      } else {
        await login(authEmail, authPassword);
      }
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/80 sm:px-6">
        {/* Left Section: Mobile menu button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            title="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved scripts, hooks, or topics..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-500 transition-all"
            />
          </form>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Mode Indicator Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
              systemStatus?.ai?.isConfigured
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{systemStatus?.ai?.isConfigured ? 'Live AI Mode' : 'Intelligent Demo Mode'}</span>
          </div>

          {/* Quick Generate Action */}
          <Button
            size="sm"
            onClick={() => navigate('/script-generator')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            New Script
          </Button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Auth Button */}
          {isGuest ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              leftIcon={<User className="w-4 h-4" />}
            >
              Sign In
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {user?.name || 'Account'}
                </span>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal for Login / Register */}
      <Modal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={authMode === 'login' ? 'Sign In to ScriptCraft' : 'Create Free Account'}
        description={
          authMode === 'login'
            ? 'Sign in to access your saved scripts, custom methods, and personal history across devices.'
            : 'Register a new account to unlock persistent cloud storage and custom marketing methods.'
        }
        size="sm"
      >
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authError && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500">
              {authError}
            </div>
          )}

          {authMode === 'register' && (
            <Input
              label="Full Name"
              required
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Minimum 6 characters"
          />

          <div className="pt-2">
            <Button
              type="submit"
              size="md"
              fullWidth
              isLoading={authLoading}
              className="w-full"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
            >
              {authMode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
