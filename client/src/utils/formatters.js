export const countWords = (text = '') => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const calculateReadTime = (text = '', wpm = 130) => {
  const words = countWords(text);
  const seconds = Math.round((words / wpm) * 60);
  if (seconds < 60) return `${seconds}s read`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${mins}m ${remainingSecs}s read`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Recently';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'ready':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'published':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'archived':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    case 'draft':
    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
};

export const getModuleBadgeColor = (module) => {
  switch (module) {
    case 'personal-branding':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    case 'meta-ads':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    case 'story-marketing':
      return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
    case 'universal':
    default:
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
  }
};
