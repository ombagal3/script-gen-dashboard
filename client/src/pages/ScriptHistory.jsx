import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Eye,
  Calendar,
  Layers,
} from 'lucide-react';
import { useScripts } from '../hooks/useScripts';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ScriptPreview } from '../components/scripts/ScriptPreview';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate, getStatusColor, getModuleBadgeColor } from '../utils/formatters';

export const ScriptHistory = () => {
  const navigate = useNavigate();
  const { scripts, isLoading, fetchScripts } = useScripts({ sortBy: 'recently-updated' });
  const [selectedScript, setSelectedScript] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchScripts({ sortBy: 'recently-updated', limit: 50 });
  }, []);

  const handleCopy = (script) => {
    const text = script.fullContent || `[HOOK]\n${script.hook}\n\n[BODY]\n${script.body}\n\n[CTA]\n${script.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedId(script._id || script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <History className="w-4 h-4" /> Activity Log & Version History
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          Script Generation History
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chronological record of generated drafts, edits, and variations across all marketing modules.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400">Loading history timeline...</div>
      ) : scripts.length === 0 ? (
        <EmptyState
          title="No history records yet"
          description="Generated scripts and updates will automatically appear in this activity feed."
          actionLabel="Generate First Script"
          onAction={() => navigate('/script-generator')}
        />
      ) : (
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-6 space-y-6 py-2">
          {scripts.map((script, idx) => (
            <div key={script._id || script.id || idx} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-indigo-600 dark:border-slate-950 dark:bg-indigo-400 shadow-xs" />

              {/* Event Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-indigo-300 dark:border-slate-800/80 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold capitalize ${getModuleBadgeColor(script.module)}`}>
                      {script.module?.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {script.category}
                    </span>
                    <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(script.status)}`}>
                      {script.status || 'Draft'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(script.updatedAt || script.createdAt)}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {script.title || 'Untitled Script'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2">
                    "{script.hook || script.body || 'No preview text'}"
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400">
                    Method: <strong>{script.methodName || 'Custom'}</strong> • {script.language}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleCopy(script)}
                      leftIcon={copiedId === (script._id || script.id) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedId === (script._id || script.id) ? 'Copied' : 'Copy'}
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedScript(script)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Preview
                    </Button>

                    <Button
                      size="xs"
                      onClick={() => navigate(`/script-generator?editId=${script._id || script.id}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open in Studio
                    </Button>
                  </div>
                </div>
              </div>
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
    </div>
  );
};
