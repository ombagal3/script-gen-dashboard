import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  Edit3,
  Save,
  Download,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Layers,
  FileCode,
  ArrowRight,
} from 'lucide-react';

export const MasterPromptEditor = ({
  masterPrompt,
  onSave,
  onRegenerate,
  onGenerateScript,
  isGeneratingScript = false,
  isSaving = false,
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState(masterPrompt?.promptContent || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync content when prop changes
  React.useEffect(() => {
    if (masterPrompt?.promptContent) {
      setContent(masterPrompt.promptContent);
    }
  }, [masterPrompt?.promptContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt to clipboard:', err);
    }
  };

  const handleExport = (format = 'md') => {
    const filename = `${(masterPrompt?.title || 'master_prompt')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}.${format}`;
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSave?.(content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              {masterPrompt?.module} • {masterPrompt?.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">v{masterPrompt?.version || 1}</span>
            {masterPrompt?.trendName && (
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                Ref: {masterPrompt.trendName}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {masterPrompt?.title || 'Master Prompt Generator Output'}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>

          {/* Edit / Save Toggle */}
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Prompt</span>
            </button>
          )}

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => handleExport('md')}
              className="px-2 py-1.5 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Export as Markdown (.md)"
            >
              .MD
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => handleExport('txt')}
              className="px-2 py-1.5 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Export as Text (.txt)"
            >
              .TXT
            </button>
          </div>
        </div>
      </div>

      {/* Main Prompt Text Editor / Viewer */}
      <div className="relative rounded-xl border border-slate-200/80 bg-slate-950 font-mono text-xs text-slate-100 shadow-inner dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-medium">master_prompt_output.md</span>
          </div>
          <span>{isEditing ? 'Editing Mode Active' : 'Ready to Copy & Execute'}</span>
        </div>

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            className="w-full bg-transparent p-4 text-emerald-300 focus:outline-hidden resize-y leading-relaxed font-mono"
            placeholder="Edit master prompt..."
          />
        ) : (
          <pre className="p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-200 max-h-[550px] overflow-y-auto selection:bg-indigo-500/30">
            {content}
          </pre>
        )}
      </div>

      {/* Bottom Conversion Bar: Generate Script From Prompt */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            Ready to execute: Feed this master prompt into our AI scriptwriter to generate all deliverables.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Prompt</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onGenerateScript?.(masterPrompt?._id)}
            disabled={isGeneratingScript}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{isGeneratingScript ? 'Generating Complete Script...' : 'Generate Script from This Prompt'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
