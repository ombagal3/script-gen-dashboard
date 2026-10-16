import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Save,
  Copy,
  Check,
  FileDown,
  Layers,
  Eye,
  Sliders,
  Share2,
  Tag,
  Video,
  Type,
  Volume2,
  Bookmark,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../common/Button';
import { countWords, calculateReadTime } from '../../utils/formatters';

export const ScriptEditor = ({
  script,
  setScript,
  variations = [],
  activeVariationIndex = 0,
  setActiveVariationIndex,
  onSave,
  onRegenerateSection,
  isRegeneratingSection,
  isSaving,
  onExport,
}) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  if (!script) return null;

  const hookWords = countWords(script.hook);
  const bodyWords = countWords(script.body);
  const ctaWords = countWords(script.cta);
  const totalWords = hookWords + bodyWords + ctaWords;
  const totalReadTime = calculateReadTime(`${script.hook} ${script.body} ${script.cta}`);

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleHookVariationSelect = (hookText, index) => {
    setSelectedHookIndex(index);
    setScript((prev) => ({
      ...prev,
      hook: hookText,
    }));
  };

  const hookVariations = script.sections?.hookVariations || [];

  return (
    <div className="space-y-6">
      {/* Variations Switcher (if 3 variations generated) */}
      {variations.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              3 Variations Generated:
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {variations.map((v, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveVariationIndex(idx);
                  setScript(v);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeVariationIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                Angle {String.fromCharCode(65 + idx)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Script Header Bar: Title, Status, Read Time & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
        <div>
          <input
            type="text"
            value={script.title || ''}
            onChange={(e) => setScript({ ...script, title: e.target.value })}
            placeholder="Script Title"
            className="text-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1 -ml-2 dark:text-white dark:bg-transparent"
          />
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Method: <strong className="text-slate-700 dark:text-slate-200">{script.methodName || 'Custom'}</strong></span>
            <span>•</span>
            <span>Total: <strong>{totalWords} words</strong> ({totalReadTime})</span>
            {script.providerMessage && (
              <>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {script.providerMessage}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Global Script Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={script.status || 'Draft'}
            onChange={(e) => setScript({ ...script, status: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Copy Full Script */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleCopy(
                script.fullContent || `[HOOK]\n${script.hook}\n\n[BODY]\n${script.body}\n\n[CTA]\n${script.cta}`,
                'all'
              )
            }
            leftIcon={copiedSection === 'all' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          >
            {copiedSection === 'all' ? 'Copied All' : 'Copy All'}
          </Button>

          {/* Export Button */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              leftIcon={<FileDown className="w-4 h-4" />}
            >
              Export
            </Button>
          )}

          {/* Save Script */}
          <Button
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {script._id || script.id ? 'Save Changes' : 'Save Script'}
          </Button>
        </div>
      </div>

      {/* SECTION 1: THE HOOK */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              1
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              The Hook (First 3-5 Seconds)
            </h4>
            <span className="text-xs text-slate-400">({hookWords} words)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(script.hook, 'hook')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1 rounded-md"
              title="Copy Hook"
            >
              {copiedSection === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'hook' ? 'Copied' : 'Copy'}
            </button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => onRegenerateSection('hook')}
              isLoading={isRegeneratingSection === 'hook'}
              leftIcon={<RotateCcw className="w-3 h-3 text-indigo-500" />}
            >
              Regenerate Hook
            </Button>
          </div>
        </div>

        {/* Hook Variations Pills */}
        {hookVariations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Alternate Hooks:
            </span>
            <div className="flex flex-col gap-1.5">
              {hookVariations.map((hText, idx) => (
                <div
                  key={idx}
                  onClick={() => handleHookVariationSelect(hText, idx)}
                  className={`text-xs p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                    script.hook === hText
                      ? 'border-indigo-500 bg-indigo-50/60 font-semibold text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">#{idx + 1}</span>
                  <span className="flex-1">{hText}</span>
                  {script.hook === hText && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          rows={3}
          value={script.hook || ''}
          onChange={(e) => setScript({ ...script, hook: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 leading-relaxed font-mono"
          placeholder="Hook text..."
        />
      </div>

      {/* SECTION 2: THE MAIN BODY */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              2
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Main Body (Story, Explanation & Value)
            </h4>
            <span className="text-xs text-slate-400">({bodyWords} words)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(script.body, 'body')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1 rounded-md"
              title="Copy Body"
            >
              {copiedSection === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'body' ? 'Copied' : 'Copy'}
            </button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => onRegenerateSection('body')}
              isLoading={isRegeneratingSection === 'body'}
              leftIcon={<RotateCcw className="w-3 h-3 text-indigo-500" />}
            >
              Regenerate Body
            </Button>
          </div>
        </div>

        <textarea
          rows={8}
          value={script.body || ''}
          onChange={(e) => setScript({ ...script, body: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 leading-relaxed font-mono"
          placeholder="Main body script..."
        />
      </div>

      {/* SECTION 3: CALL TO ACTION (CTA) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              3
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Call to Action (CTA)
            </h4>
            <span className="text-xs text-slate-400">({ctaWords} words)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(script.cta, 'cta')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1 rounded-md"
              title="Copy CTA"
            >
              {copiedSection === 'cta' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'cta' ? 'Copied' : 'Copy'}
            </button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => onRegenerateSection('cta')}
              isLoading={isRegeneratingSection === 'cta'}
              leftIcon={<RotateCcw className="w-3 h-3 text-indigo-500" />}
            >
              Regenerate CTA
            </Button>
          </div>
        </div>

        <textarea
          rows={3}
          value={script.cta || ''}
          onChange={(e) => setScript({ ...script, cta: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 leading-relaxed font-mono"
          placeholder="Call to action..."
        />
      </div>

      {/* MODULE SPECIFIC DELIVERABLES */}

      {/* Meta Ads Deliverables */}
      {script.sections?.sceneVisuals && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Scene-By-Scene Storyboard & Visual Directions
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {script.sections.sceneVisuals.map((scene, i) => (
              <div key={i} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50 space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {scene.scene}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Visual:</strong> {scene.visual}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Audio:</strong> {scene.audio}
                </p>
                <div className="text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 p-1.5 rounded-md mt-1">
                  Text: {scene.onScreenText}
                </div>
              </div>
            ))}
          </div>

          {/* Ad Copy & Headline */}
          {script.sections.primaryAdCopy && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary Ad Copy (Feed / Post Text)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(script.sections.primaryAdCopy, 'adCopy')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                >
                  {copiedSection === 'adCopy' ? 'Copied Ad Copy' : 'Copy Ad Copy'}
                </button>
              </div>
              <p className="text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap font-sans">
                {script.sections.primaryAdCopy}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <strong>Headline:</strong> {script.sections.headline}
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <strong>CTA Button:</strong> {script.sections.ctaButtonRecommendation}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Story Marketing Deliverables */}
      {script.sections?.slides && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Slide-By-Slide Story Sequence ({script.sections.slides.length} Slides)
            </h4>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleCopy(script.sections.copyAllText, 'storyAll')}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              {copiedSection === 'storyAll' ? 'Copied All Slides' : 'Copy All Slides'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {script.sections.slides.map((s) => (
              <div
                key={s.slideNumber}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Slide {s.slideNumber}: {s.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(s.text, `slide_${s.slideNumber}`)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {copiedSection === `slide_${s.slideNumber}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {s.text}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>Visual:</strong> {s.visualSuggestion}
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <strong>Sticker:</strong> {s.stickerSuggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Branding Deliverables */}
      {(script.sections?.bRoll || script.sections?.caption) && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-3 dark:border-slate-800/80">
            Visual B-Roll, Caption & Curated Hashtags
          </h4>

          {script.sections.bRoll && (
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Recommended B-Roll Shots:
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc pl-5">
                {script.sections.bRoll.map((shot, i) => (
                  <li key={i}>{shot}</li>
                ))}
              </ul>
            </div>
          )}

          {script.sections.caption && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ready-to-Post Caption
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(script.sections.caption, 'caption')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedSection === 'caption' ? 'Copied' : 'Copy Caption'}
                </button>
              </div>
              <p className="text-xs bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                {script.sections.caption}
              </p>
            </div>
          )}

          {script.sections.hashtags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {script.sections.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/40 dark:border-indigo-800/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
