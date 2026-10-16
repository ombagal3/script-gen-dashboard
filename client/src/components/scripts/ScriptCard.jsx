import React, { useState } from 'react';
import {
  Clock,
  FileText,
  Copy,
  Check,
  Eye,
  Edit3,
  CopyPlus,
  Trash2,
  MoreVertical,
  Calendar,
} from 'lucide-react';
import { formatDate, getStatusColor, getModuleBadgeColor, countWords, calculateReadTime } from '../../utils/formatters';

export const ScriptCard = ({
  script,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const wordCount = countWords(script.fullContent || `${script.hook} ${script.body} ${script.cta}`);
  const readTime = calculateReadTime(script.fullContent || `${script.hook} ${script.body} ${script.cta}`);

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = script.fullContent || `[HOOK]\n${script.hook}\n\n[BODY]\n${script.body}\n\n[CTA]\n${script.cta}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onView && onView(script)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-indigo-500/50 cursor-pointer"
    >
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-semibold tracking-wide capitalize ${getModuleBadgeColor(script.module)}`}>
              {script.module?.replace('-', ' ')}
            </span>
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {script.category}
            </span>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={script.status || 'Draft'}
              onChange={(e) => onStatusChange && onStatusChange(script._id || script.id, e.target.value)}
              className={`rounded-lg border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer ${getStatusColor(script.status)}`}
            >
              <option value="Draft">Draft</option>
              <option value="Ready">Ready</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Script Title */}
        <h4 className="mt-3 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
          {script.title || 'Untitled Script'}
        </h4>

        {/* Script Hook Snippet */}
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 italic dark:text-slate-400">
          "{script.hook || script.body || 'No hook content preview available.'}"
        </p>
      </div>

      {/* Card Footer: Word Count, Date, Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> {wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {script.duration ? `${script.duration}s` : readTime}
            </span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Copy script to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit && onEdit(script)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
              title="Edit in editor"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate && onDuplicate(script._id || script.id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Duplicate script"
            >
              <CopyPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete && onDelete(script._id || script.id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
              title="Delete script"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Updated {formatDate(script.updatedAt || script.createdAt)}
          </span>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {script.language || 'English'}
          </span>
        </div>
      </div>
    </div>
  );
};
