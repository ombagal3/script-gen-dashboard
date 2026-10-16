import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  FolderArchive,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useScripts } from '../hooks/useScripts';
import { ScriptCard } from '../components/scripts/ScriptCard';
import { ScriptPreview } from '../components/scripts/ScriptPreview';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { MODULES, SCRIPT_STATUSES, LANGUAGES } from '../utils/constants';

export const SavedScripts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get('search') || '';
  const urlModule = searchParams.get('module') || 'all';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [filterModule, setFilterModule] = useState(urlModule);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedScript, setSelectedScript] = useState(null);
  const [renameScriptData, setRenameScriptData] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const {
    scripts,
    pagination,
    isLoading,
    fetchScripts,
    deleteScript,
    duplicateScript,
    saveScript,
    updateStatus,
    toast,
  } = useScripts();

  const loadData = () => {
    fetchScripts({
      search: searchTerm,
      module: filterModule,
      status: filterStatus,
      language: filterLanguage,
      sortBy,
      page: 1,
    });
  };

  useEffect(() => {
    loadData();
  }, [filterModule, filterStatus, filterLanguage, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleDuplicate = async (id) => {
    await duplicateScript(id);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this script? This action cannot be undone.')) {
      await deleteScript(id);
      loadData();
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    loadData();
  };

  const handleOpenRename = (script) => {
    setRenameScriptData(script);
    setNewTitle(script.title || '');
  };

  const handleSaveRename = async (e) => {
    e.preventDefault();
    if (!renameScriptData || !newTitle.trim()) return;
    try {
      await saveScript({
        ...renameScriptData,
        _id: renameScriptData._id || renameScriptData.id,
        title: newTitle.trim(),
      });
      setRenameScriptData(null);
      loadData();
    } catch (err) {
      console.warn('Rename error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border animate-fade-in ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-4 h-4" /> Script Library
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            Saved Scripts & Cloud Storage
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, filter, edit, duplicate, and export your persistent scripts stored in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/script-generator')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Script
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, hook, body, or category..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-4 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
            />
          </div>

          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterModule('all');
              setFilterStatus('all');
              setFilterLanguage('all');
              setSortBy('newest');
              fetchScripts();
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
          {/* Module Filter */}
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
          >
            <option value="all">All Modules</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            {SCRIPT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
          >
            <option value="all">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="recently-updated">Sort: Recently Updated</option>
            <option value="title-asc">Sort: Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Scripts Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          Loading saved scripts...
        </div>
      ) : scripts.length === 0 ? (
        <EmptyState
          title="No scripts match your criteria"
          description="Try clearing your filters or create a new script using our generator."
          actionLabel="Create Script"
          onAction={() => navigate('/script-generator')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scripts.map((script) => (
            <div key={script._id || script.id} className="relative group/wrapper">
              <ScriptCard
                script={script}
                onView={(s) => setSelectedScript(s)}
                onEdit={(s) => navigate(`/script-generator?editId=${s._id || s.id}`)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRename(script);
                }}
                className="absolute top-2 right-16 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover/wrapper:opacity-100 transition-opacity"
                title="Rename Script"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Script Preview Modal */}
      <Modal
        isOpen={!!selectedScript}
        onClose={() => setSelectedScript(null)}
        title={selectedScript?.title || 'Script Preview'}
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

      {/* Rename Modal */}
      <Modal
        isOpen={!!renameScriptData}
        onClose={() => setRenameScriptData(null)}
        title="Rename Script"
        description="Update the display title of this script."
        size="sm"
      >
        <form onSubmit={handleSaveRename} className="space-y-4">
          <Input
            label="Script Title"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setRenameScriptData(null)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Title
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
