import React from 'react';
import { Flame, Target, Info } from 'lucide-react';

export const TrendScore = ({
  score = 75,
  type = 'opportunity', // 'opportunity' | 'momentum'
  label,
  showLabel = true,
  size = 'md',
  explanation,
}) => {
  const isOpportunity = type === 'opportunity';
  const displayLabel = label || (isOpportunity ? 'Opportunity' : 'Momentum');
  const Icon = isOpportunity ? Target : Flame;

  const getColorClasses = (val) => {
    if (val >= 85) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        ring: 'stroke-emerald-500',
      };
    }
    if (val >= 70) {
      return {
        text: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        border: 'border-indigo-200 dark:border-indigo-800',
        ring: 'stroke-indigo-500',
      };
    }
    if (val >= 50) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        ring: 'stroke-amber-500',
      };
    }
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      ring: 'stroke-rose-500',
    };
  };

  const colors = getColorClasses(score);

  if (size === 'sm') {
    return (
      <span
        title={explanation || `${displayLabel}: ${score}/100`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
      >
        <Icon className="w-3 h-3" />
        <span>{score}</span>
        {showLabel && <span className="text-[10px] opacity-75 font-normal">{displayLabel}</span>}
      </span>
    );
  }

  return (
    <div
      title={explanation}
      className={`flex items-center gap-2 p-2 rounded-xl border ${colors.bg} ${colors.border} transition-all hover:shadow-xs`}
    >
      <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-2xs ${colors.text}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`text-base font-extrabold leading-tight ${colors.text}`}>{score}</span>
          <span className="text-[10px] text-slate-400 font-medium">/100</span>
        </div>
        {showLabel && (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
};
