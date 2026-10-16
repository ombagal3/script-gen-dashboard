import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title = 'No scripts found',
  description = 'Get started by creating your first script using our high-converting AI generator.',
  actionLabel,
  onAction,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
        {icon || <FileText className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        )}
        {secondaryAction}
      </div>
    </div>
  );
};
