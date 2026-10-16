import React from 'react';
import {
  Globe,
  TrendingUp,
  Megaphone,
  Video,
  Camera,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

export const TrendSourceBadge = ({ source, sourceUrl, showLink = true, size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (source) {
      case 'Google Trends':
        return {
          icon: TrendingUp,
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
        };
      case 'Meta Ads Library':
        return {
          icon: Megaphone,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900',
        };
      case 'TikTok Creative Center':
        return {
          icon: Video,
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
        };
      case 'Instagram Explore':
        return {
          icon: Camera,
          bg: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900',
        };
      case 'Google News / Web Research':
        return {
          icon: Globe,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
        };
      case 'Manual Import':
        return {
          icon: FileCheck2,
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
        };
      default:
        return {
          icon: Globe,
          bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md transition-colors ${style.bg} ${
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
    >
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{source}</span>
      {sourceUrl && showLink && (
        <ExternalLink className={size === 'xs' ? 'w-2.5 h-2.5 opacity-60' : 'w-3 h-3 opacity-60'} />
      )}
    </span>
  );

  if (sourceUrl && showLink) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`View original source: ${sourceUrl}`}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
};
