import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileDown,
  Clock,
  FileText,
  Eye,
  Type,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { countWords, calculateReadTime, formatDate } from '../../utils/formatters';

export const ScriptPreview = ({ script, onClose, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [teleprompterMode, setTeleprompterMode] = useState(false);

  if (!script) return null;

  const fullText =
    script.fullContent ||
    `[HOOK]\n${script.hook || ''}\n\n[BODY]\n${script.body || ''}\n\n[CALL TO ACTION]\n${script.cta || ''}`;

  const words = countWords(fullText);
  const readTime = calculateReadTime(fullText);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format = 'txt') => {
    let content = fullText;
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'markdown') {
      content = `# ${script.title}\n**Category:** ${script.category} | **Module:** ${script.module} | **Language:** ${script.language}\n\n## Hook\n${script.hook}\n\n## Body\n${script.body}\n\n## Call to Action\n${script.cta}\n`;
      extension = 'md';
      mimeType = 'text/markdown';
    } else if (format === 'json') {
      content = JSON.stringify(script, null, 2);
      extension = 'json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(script.title || 'script').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Teleprompter Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {script.module?.replace('-', ' ')}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {script.category}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {script.title || 'Script Preview'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={teleprompterMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTeleprompterMode(!teleprompterMode)}
            leftIcon={<Type className="w-4 h-4" />}
          >
            {teleprompterMode ? 'Standard View' : 'Teleprompter Mode'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied' : 'Copy Full'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload('markdown')}
            leftIcon={<FileDown className="w-4 h-4" />}
          >
            Export .MD
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload('txt')}
          >
            .TXT
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <span className="flex items-center gap-1.5 font-medium">
          <FileText className="w-4 h-4 text-indigo-500" /> {words} Words
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="w-4 h-4 text-indigo-500" /> {readTime}
        </span>
        <span>•</span>
        <span>Method: <strong>{script.methodName || 'Standard Framework'}</strong></span>
        <span>•</span>
        <span>Language: <strong>{script.language || 'English'}</strong></span>
      </div>

      {/* Script Display Content */}
      <div
        className={`rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-950/60 transition-all ${
          teleprompterMode
            ? 'text-lg leading-loose font-sans font-medium text-slate-900 dark:text-white max-h-[60vh] overflow-y-auto'
            : 'space-y-6'
        }`}
      >
        {teleprompterMode ? (
          <div className="space-y-6 select-all">
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                HOOK
              </span>
              <p>{script.hook}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
                BODY
              </span>
              <p className="whitespace-pre-wrap">{script.body}</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                CALL TO ACTION
              </span>
              <p>{script.cta}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Standard Structured View */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                1. The Hook
              </span>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xs">
                {script.hook || 'No hook defined.'}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Main Body
              </span>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xs">
                {script.body || 'No body content.'}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                3. Call to Action
              </span>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xs">
                {script.cta || 'No call to action defined.'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400">
          Last updated: {formatDate(script.updatedAt || script.createdAt)}
        </span>
        {onEdit && (
          <Button size="sm" onClick={() => onEdit(script)}>
            Open in Editor
          </Button>
        )}
      </div>
    </div>
  );
};
