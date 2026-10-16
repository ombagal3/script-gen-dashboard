import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ScriptForm } from '../components/scripts/ScriptForm';
import { ScriptEditor } from '../components/scripts/ScriptEditor';
import { Loader } from '../components/common/Loader';
import { methodService } from '../services/methodService';
import { scriptService } from '../services/scriptService';
import { useScripts } from '../hooks/useScripts';

export const PersonalBranding = () => {
  const navigate = useNavigate();
  const { saveScript, toast, showToast } = useScripts();

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
      tone: 'Authoritative yet relatable',
      additionalInstructions: '',
    },
  });

  const [generatedScript, setGeneratedScript] = useState(null);
  const [variations, setVariations] = useState([]);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const list = await methodService.getMethods();
        setMethods(list);
        if (list.length > 0 && !formData.methodId) {
          setFormData((prev) => ({ ...prev, methodId: list[0]._id || list[0].id }));
        }
      } catch (err) {
        console.warn('Could not fetch methods:', err.message);
      }
    };
    fetchMethods();
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.inputData?.topic) {
      showToast('Please enter both a title and topic', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await scriptService.generateScript({
        module: 'personal-branding',
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
      showToast('Personal Branding script generated successfully!');
    } catch (err) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!formData.title || !formData.inputData?.topic) {
      showToast('Please enter both a title and topic', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await scriptService.generateScript({
        module: 'personal-branding',
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
        showToast('3 Brand script variations generated!');
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
        module: 'personal-branding',
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
        module: 'personal-branding',
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
        tags: [formData.category, formData.objective, 'Personal Branding'],
      };

      if (generatedScript._id || generatedScript.id) {
        payload._id = generatedScript._id || generatedScript.id;
      }

      const saved = await saveScript(payload);
      setGeneratedScript(saved);
      showToast('Saved to MongoDB successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
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
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-4 h-4" /> Personal Branding Module
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          Authority, Trust & Follower Growth
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Craft viral, educational short-form scripts tailored for professionals (CA, Doctor, Business Owner, Educator) without aggressive direct sales.
        </p>
      </div>

      {/* Main Grid: Form Left, Editor Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Script Configuration
          </h2>
          <ScriptForm
            module="personal-branding"
            formData={formData}
            setFormData={setFormData}
            methods={methods}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            onGenerateVariations={handleGenerateVariations}
          />
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 dark:border-slate-800/80 dark:bg-slate-900">
              <Loader text="Generating authoritative personal branding script..." />
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
              <UserCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Ready to Craft Your Personal Brand Script
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Fill out the configuration fields on the left and click <strong>Generate Script</strong> to produce viral hooks, educational body copy, B-roll cues, caption, and hashtags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
