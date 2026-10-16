import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const Loader = ({ text = 'Generating script with AI intelligence...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
        {text}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Applying viral hooks, retaining pacing, and formatting call-to-action...
      </p>
    </div>
  );
};
