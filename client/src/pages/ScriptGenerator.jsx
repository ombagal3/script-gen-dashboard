import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Wand2,
  Copy,
  Save,
  Check,
  FileDown,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { ScriptForm } from '../components/scripts/ScriptForm';
import { ScriptEditor } from '../components/scripts/ScriptEditor';
import { Loader } from '../components/common/Loader';
import { methodService } from '../services/methodService';
import { scriptService } from '../services/scriptService';
import { useScripts } from '../hooks/useScripts';
import { MODULES } from '../utils/constants';

export const ScriptGenerator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const methodParamId = searchParams.get('methodId');

  const { saveScript, toast, showToast } = useScripts();

  const [activeModule, setActiveModule] = useState('personal-branding');
  const [methods, setMethods] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Business Owner',
    objective: 'Authority',
    language: 'English',
    duration: 60,
    methodId: '',
    inputData: {
      topic: '',
      targetAudience: '',
      platform: 'Instagram Reels',
      tone: 'Conversational and authoritative',
      additionalInstructions: '',
    },
  });

  const [generatedScript, setGeneratedScript] = useState(null);
  const [variations, setVariations] = useState([]);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch methods and optional edit script on load
  useEffect(() => {
    const init = async () => {
      try {
        const methodsList = await methodService.getMethods();
        setMethods(methodsList);

        if (editId) {
          setIsLoading(true);
          const existing = await scriptService.getScriptById(editId);
          if (existing) {
            setGeneratedScript(existing);
            setActiveModule(existing.module || 'personal-branding');
            setFormData({
              title: existing.title || '',
              category: existing.category || 'General',
              objective: existing.objective || 'Engagement',
              language: existing.language || 'English',
              duration: existing.duration || 60,
              methodId: existing.methodId || (methodsList[0]?._id || methodsList[0]?.id),
              inputData: existing.inputData || {},
            });
          }
          setIsLoading(false);
        } else {
          const selectedM = methodParamId
            ? methodsList.find((m) => (m._id || m.id) === methodParamId)
            : methodsList[0];
          if (selectedM) {
            setFormData((prev) => ({ ...prev, methodId: selectedM._id || selectedM.id }));
          }
        }
      } catch (err) {
        console.warn('Initialization error in generator:', err.message);
        setIsLoading(false);
      }
    };
    init();
  }, [editId, methodParamId]);

  // When switching active module, adjust sensible default categories
  const handleModuleSwitch = (modId) => {
    setActiveModule(modId);
    let defaultCat = 'Business Owner';
    let defaultObj = 'Authority';

    if (modId === 'meta-ads') {
      defaultCat = 'Direct Sales';
      defaultObj = 'Sales';
    } else if (modId === 'story-marketing') {
      defaultCat = 'Story Default';
      defaultObj = 'Send DM';
    } else if (modId === 'universal') {
      defaultCat = 'Informative';
      defaultObj = 'Engagement';
    }

    setFormData((prev) => ({
      ...prev,
      category: defaultCat,
      objective: defaultObj,
    }));
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title) {
      showToast('Please enter a script or campaign title', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await scriptService.generateScript({
        module: activeModule,
        category: formData.category,
        objective: formData.objective,
        language: formData.language,
        duration: formData.duration,
        methodId: formData.methodId,
        inputData: formData.inputData,
        variationsCount: 1,
      });

      setGeneratedScript(res.script);
      setVariations([]);
      showToast('Script generated successfully with selected method!');
    } catch (err) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!formData.title) {
      showToast('Please enter a script or campaign title', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await scriptService.generateScript({
        module: activeModule,
        category: formData.category,
        objective: formData.objective,
        language: formData.language,
        duration: formData.duration,
        methodId: formData.methodId,
        inputData: formData.inputData,
        variationsCount: 3,
      });

      if (res.variations) {
        setVariations(res.variations);
        setGeneratedScript(res.variations[0]);
        setActiveVariationIndex(0);
        showToast('3 variations generated!');
      }
    } catch (err) {
      showToast(err.message || 'Variations generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSection = async (section) => {
    setIsRegeneratingSection(section);
    try {
      const res = await scriptService.regenerateSection({
        module: activeModule,
        section,
        category: formData.category,
        objective: formData.objective,
        language: formData.language,
        duration: formData.duration,
        currentScript: generatedScript,
        inputData: formData.inputData,
      });

      if (section === 'hook' && res.data?.hook) {
        setGeneratedScript((prev) => ({
          ...prev,
          hook: res.data.hook,
          sections: {
            ...prev.sections,
            hookVariations: res.data.hookVariations || prev.sections?.hookVariations,
          },
        }));
      } else if (section === 'body' && res.data?.body) {
        setGeneratedScript((prev) => ({ ...prev, body: res.data.body }));
      } else if (section === 'cta' && res.data?.cta) {
        setGeneratedScript((prev) => ({ ...prev, cta: res.data.cta }));
      }

      showToast(`${section.toUpperCase()} regenerated while preserving other sections!`);
    } catch (err) {
      showToast(err.message || 'Failed to regenerate section', 'error');
    } finally {
      setIsRegeneratingSection(null);
    }
  };

  const handleSave = async () => {
    if (!generatedScript) return;
    setIsSaving(true);
    try {
      const payload = {
        title: generatedScript.title || formData.title,
        module: activeModule,
        category: formData.category,
        objective: formData.objective,
        language: formData.language,
        duration: formData.duration,
        methodId: formData.methodId || null,
        methodName: generatedScript.methodName,
        hook: generatedScript.hook,
        body: generatedScript.body,
        cta: generatedScript.cta,
        fullContent: generatedScript.fullContent,
        sections: generatedScript.sections,
        status: generatedScript.status || 'Draft',
        inputData: formData.inputData,
        tags: [formData.category, formData.objective, activeModule],
      };

      if (generatedScript._id || generatedScript.id) {
        payload._id = generatedScript._id || generatedScript.id;
      }

      const saved = await saveScript(payload);
      setGeneratedScript(saved);
      showToast('Script successfully saved to MongoDB!');
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border animate-fade-in ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Universal Script Studio
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          All-In-One Script Generator & Editor
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Seamless 8-step workflow combining Personal Branding, Meta Ads, Story Marketing, and Custom Methods with independent section regeneration.
        </p>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-4">
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModuleSwitch(m.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeModule === m.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Left, Editor Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Generator Configuration
          </h2>
          <ScriptForm
            module={activeModule}
            formData={formData}
            setFormData={setFormData}
            methods={methods}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            onGenerateVariations={handleGenerateVariations}
          />
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 dark:border-slate-800/80 dark:bg-slate-900">
              <Loader text="Crafting script with selected writing method..." />
            </div>
          ) : generatedScript ? (
            <ScriptEditor
              script={generatedScript}
              setScript={setGeneratedScript}
              variations={variations}
              activeVariationIndex={activeVariationIndex}
              setActiveVariationIndex={setActiveVariationIndex}
              onSave={handleSave}
              onRegenerateSection={handleRegenerateSection}
              isRegeneratingSection={isRegeneratingSection}
              isSaving={isSaving}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <Sparkles className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Ready to Generate Your Script
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Select your module, configure the topic and method on the left, then click <strong>Generate Script</strong> to review and edit Hook, Body, and CTA independently.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
