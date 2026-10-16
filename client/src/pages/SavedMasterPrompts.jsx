import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Trash2,
  CopyPlus,
  ArrowRight,
  ExternalLink,
  Search,
  RefreshCw,
  FileCode,
  Layers,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { masterPromptService } from '../services/masterPromptService';
import { MasterPromptEditor } from '../components/trends/MasterPromptEditor';
import { Modal } from '../components/common/Modal';
import { MODULES, TREND_INDUSTRIES } from '../utils/constants';

export const SavedMasterPrompts = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [activePrompt, setActivePrompt] = useState(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await masterPromptService.getMasterPrompts({
        search,
        module: selectedModule,
        industry: selectedIndustry,
      });
      setPrompts(res.data?.prompts || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [selectedModule, selectedIndustry]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrompts();
  };

  const handleCopy = async (id, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      showToast('Master prompt copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await masterPromptService.duplicateMasterPrompt(id);
      showToast('Master prompt duplicated successfully');
      fetchPrompts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this master prompt?')) {
      try {
        await masterPromptService.deleteMasterPrompt(id);
        showToast('Master prompt deleted');
        fetchPrompts();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleGenerateScript = async (id) => {
    setIsGeneratingScript(true);
    try {
      await masterPromptService.generateScriptFromPrompt(id);
      showToast('Script successfully generated from prompt and saved to library!');
      setTimeout(() => navigate('/saved-scripts'), 1200);
    } catch (err) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSaveModalPrompt = async (updatedContent) => {
    if (!activePrompt?._id) return;
    try {
      const updated = await masterPromptService.updateMasterPrompt(activePrompt._id, {
        promptContent: updatedContent,
      });
      setActivePrompt(updated);
      showToast('Master prompt updated');
      fetchPrompts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white dark:bg-emerald-600'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-white" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Bookmark className="h-3.5 w-3.5" /> Prompt Library
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Saved Master Prompts ({prompts.length})
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Catalog of verified master prompts, version histories, and generated script deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/master-prompt-generator')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Master Prompt</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </form>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Modules</option>
          {MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="rounded-xl px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          <option value="All">All Industries</option>
          {TREND_INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Prompts Cards Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading saved master prompts...
          </p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No saved master prompts yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Generate and save master prompts from any discovered trend or custom topic.
          </p>
          <button
            type="button"
            onClick={() => navigate('/master-prompt-generator')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Generate First Master Prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map((p) => (
            <div
              key={p._id}
              className="flex flex-col justify-between rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-indigo-700"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2 py-0.5 rounded-md font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {p.module} • {p.category}
                  </span>
                  <span className="text-slate-400 font-medium">v{p.version || 1}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                  {p.title}
                </h3>

                {p.trendName && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 line-clamp-1">
                    Trend: {p.trendName}
                  </p>
                )}

                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(p.createdAt).toLocaleDateString()} • {p.platform} ({p.duration}s)
                </p>

                {p.generatedScriptId && (
                  <div className="mt-3 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                    <span>Script Deliverable Created</span>
                    <button
                      type="button"
                      onClick={() => navigate('/saved-scripts')}
                      className="underline font-bold hover:text-emerald-900"
                    >
                      View Script
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(p._id, p.promptContent)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="Copy Prompt"
                  >
                    {copiedId === p._id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(p._id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="Duplicate Prompt"
                  >
                    <CopyPlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePrompt(p);
                      setShowEditorModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    View / Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateScript(p._id)}
                    disabled={isGeneratingScript}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Script</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Editor Modal */}
      {showEditorModal && activePrompt && (
        <Modal
          isOpen={showEditorModal}
          onClose={() => setShowEditorModal(false)}
          title={`Master Prompt Brief — ${activePrompt.title}`}
          maxWidth="max-w-5xl"
        >
          <MasterPromptEditor
            masterPrompt={activePrompt}
            onSave={handleSaveModalPrompt}
            onGenerateScript={() => handleGenerateScript(activePrompt._id)}
            isGeneratingScript={isGeneratingScript}
          />
        </Modal>
      )}
    </div>
  );
};
