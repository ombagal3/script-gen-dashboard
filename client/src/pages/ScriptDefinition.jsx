import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  Sparkles,
  HelpCircle,
  Copy,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { methodService } from '../services/methodService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { HOOK_TYPES, CTA_TYPES, MODULES } from '../utils/constants';

export const ScriptDefinition = () => {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New method form state
  const [newMethodData, setNewMethodData] = useState({
    name: 'Custom Method: Hook → Challenge → Turning Point → Climax → CTA',
    description: 'A dynamic multi-step script structure tailored for high audience retention.',
    bestUseCase: 'Viral reels, product launches, or founder stories.',
    applicableModules: ['personal-branding', 'meta-ads', 'story-marketing', 'universal'],
    applicableCategories: ['All'],
    steps: [
      { order: 1, name: 'Pattern Interrupt Hook', description: 'Stop the scroll in first 3 seconds', example: 'You are doing this completely wrong...' },
      { order: 2, name: 'The Silent Problem', description: 'Reveal the unseen challenge', example: 'Most people never notice why it breaks.' },
      { order: 3, name: 'The Breakthrough', description: 'The unexpected solution', example: 'When we shifted to this 1 rule...' },
      { order: 4, name: 'Proof & Evidence', description: 'Validate with real metrics', example: 'Over 500 creators saw a 4x jump.' },
      { order: 5, name: 'Direct Call to Action', description: 'Clear next instruction', example: 'Comment "BLUEPRINT" below!' },
    ],
    example: 'A 60-second video breaking down an industry breakthrough.',
    notes: 'Keep pacing snappy and cut out fluff.',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const data = await methodService.getMethods();
      setMethods(data);
      if (data.length > 0 && !selectedMethod) {
        setSelectedMethod(data[0]);
      }
    } catch (err) {
      console.warn('Error fetching methods:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod({ ...method });
    setIsEditing(false);
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...(selectedMethod.steps || [])];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSelectedMethod({ ...selectedMethod, steps: updatedSteps });
    setIsEditing(true);
  };

  const handleAddStep = () => {
    const currentSteps = selectedMethod.steps || [];
    const newStep = {
      id: `step_${Date.now()}`,
      order: currentSteps.length + 1,
      name: `New Step ${currentSteps.length + 1}`,
      description: 'Describe what occurs in this step',
      example: 'Example script line for this step',
    };
    setSelectedMethod({
      ...selectedMethod,
      steps: [...currentSteps, newStep],
    });
    setIsEditing(true);
  };

  const handleDeleteStep = (index) => {
    const currentSteps = selectedMethod.steps || [];
    if (currentSteps.length <= 2) {
      showToast('A method must have at least 2 steps');
      return;
    }
    const updated = currentSteps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSelectedMethod({ ...selectedMethod, steps: updated });
    setIsEditing(true);
  };

  const handleMoveStep = (index, direction) => {
    const currentSteps = [...(selectedMethod.steps || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentSteps.length) return;

    const temp = currentSteps[index];
    currentSteps[index] = currentSteps[targetIndex];
    currentSteps[targetIndex] = temp;

    // Reassign order
    const reordered = currentSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSelectedMethod({ ...selectedMethod, steps: reordered });
    setIsEditing(true);
  };

  const handleSaveSelectedMethod = async () => {
    if (!selectedMethod) return;
    try {
      if (selectedMethod._id || selectedMethod.id) {
        const updated = await methodService.updateMethod(selectedMethod._id || selectedMethod.id, selectedMethod);
        setSelectedMethod(updated);
        showToast('Method framework saved successfully!');
        fetchMethods();
        setIsEditing(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to save method');
    }
  };

  const handleCreateNewMethod = async (e) => {
    e.preventDefault();
    try {
      const created = await methodService.createMethod(newMethodData);
      showToast('New custom method created!');
      setCreateModalOpen(false);
      fetchMethods();
      setSelectedMethod(created);
    } catch (err) {
      showToast(err.message || 'Failed to create method');
    }
  };

  const handleDeleteMethod = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom method?')) {
      try {
        await methodService.deleteMethod(id);
        showToast('Method deleted successfully');
        fetchMethods();
        setSelectedMethod(methods[0] || null);
      } catch (err) {
        showToast(err.message || 'Cannot delete method');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" /> Script Definition & Method Builder
        </div>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          Hook → Body → CTA → Writing Frameworks
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Every script follows the foundational architecture of Hook, Body, and Call to Action, powered by modular, customizable writing methods.
        </p>
      </div>

      {/* CORE ANATOMY BREAKDOWN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Anatomy 1: The Hook */}
        <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/30 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs text-white">
              1
            </span>
            The Hook (First 3-5s)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Interrupts the user's scrolling pattern. Built on proven psychology:
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {HOOK_TYPES.map((h, i) => (
              <span key={i} className="text-[10px] font-medium bg-white dark:bg-slate-900 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Anatomy 2: Main Body */}
        <div className="rounded-2xl border border-purple-200/70 bg-purple-50/30 p-5 dark:border-purple-900/40 dark:bg-purple-950/20 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-xs text-white">
              2
            </span>
            The Body (Retaining Flow)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Delivers the explanation, transformation story, or core value in natural pacing without filler or fluff.
          </p>
          <div className="text-[11px] text-purple-800 dark:text-purple-300 font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
            Pacing: 120-140 words per minute
          </div>
        </div>

        {/* Anatomy 3: Call to Action */}
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/30 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs text-white">
              3
            </span>
            Call to Action (CTA)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Guides the viewer toward a single, frictionless action:
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {CTA_TYPES.slice(0, 6).map((c, i) => (
              <span key={i} className="text-[10px] font-medium bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* METHOD BUILDER INTERFACE */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Method List Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Saved Writing Methods
            </h2>
            <Button
              size="xs"
              onClick={() => setCreateModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Method
            </Button>
          </div>

          <div className="space-y-2">
            {methods.map((method) => {
              const isSelected = (selectedMethod?._id || selectedMethod?.id) === (method._id || method.id);
              return (
                <div
                  key={method._id || method.id}
                  onClick={() => handleSelectMethod(method)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/40 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {method.name}
                    </h3>
                    {method.isSystemDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        System
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 dark:text-slate-400">
                    {method.description}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{method.steps?.length || 0} Ordered Steps</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                      View / Edit <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Method Editor Column */}
        <div className="lg:col-span-8">
          {selectedMethod ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
              {/* Top Details & Action Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    value={selectedMethod.name || ''}
                    onChange={(e) => {
                      setSelectedMethod({ ...selectedMethod, name: e.target.value });
                      setIsEditing(true);
                    }}
                    className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    value={selectedMethod.description || ''}
                    onChange={(e) => {
                      setSelectedMethod({ ...selectedMethod, description: e.target.value });
                      setIsEditing(true);
                    }}
                    className="mt-1 text-xs text-slate-500 dark:text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/script-generator?methodId=${selectedMethod._id || selectedMethod.id}`)}
                    leftIcon={<Sparkles className="w-4 h-4 text-indigo-500" />}
                  >
                    Use in Generator
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSaveSelectedMethod}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Method
                  </Button>

                  {!selectedMethod.isSystemDefault && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMethod(selectedMethod._id || selectedMethod.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Best Use Case & Applicable Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                    Best Use Case
                  </label>
                  <input
                    type="text"
                    value={selectedMethod.bestUseCase || ''}
                    onChange={(e) => {
                      setSelectedMethod({ ...selectedMethod, bestUseCase: e.target.value });
                      setIsEditing(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                    Example Note
                  </label>
                  <input
                    type="text"
                    value={selectedMethod.example || ''}
                    onChange={(e) => {
                      setSelectedMethod({ ...selectedMethod, example: e.target.value });
                      setIsEditing(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Step Sequence Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Ordered Step Architecture ({selectedMethod.steps?.length || 0} Steps)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Reorder, rename, or describe each step. These steps are passed to the AI engine for structured script creation.
                    </p>
                  </div>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleAddStep}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Step
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {(selectedMethod.steps || []).map((step, index) => (
                    <div
                      key={step.id || index}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      {/* Step Number Badge */}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-xs">
                        {step.order || index + 1}
                      </span>

                      {/* Step Inputs */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={step.name || ''}
                          onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                          placeholder="Step Name"
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={step.description || ''}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          placeholder="Step description or guideline"
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        />
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveStep(index, -1)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 dark:hover:text-slate-200"
                          title="Move step up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === (selectedMethod.steps?.length || 0) - 1}
                          onClick={() => handleMoveStep(index, 1)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 dark:hover:text-slate-200"
                          title="Move step down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStep(index)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 ml-1"
                          title="Delete step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <Layers className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Select a Method to Inspect or Edit
              </h3>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating a brand new Method */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Custom Method"
        description="Define a reusable step-by-step writing framework that can be applied to all script modules."
        size="lg"
      >
        <form onSubmit={handleCreateNewMethod} className="space-y-4">
          <Input
            label="Method Name"
            required
            value={newMethodData.name}
            onChange={(e) => setNewMethodData({ ...newMethodData, name: e.target.value })}
            placeholder="e.g. Method 2: Problem → Agitate → Solution → CTA"
          />

          <Input
            label="Description"
            required
            value={newMethodData.description}
            onChange={(e) => setNewMethodData({ ...newMethodData, description: e.target.value })}
            placeholder="Explain the psychology and impact of this framework"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Best Use Case"
              required
              value={newMethodData.bestUseCase}
              onChange={(e) => setNewMethodData({ ...newMethodData, bestUseCase: e.target.value })}
              placeholder="e.g. Testimonials, High ROAS Ads, Educational"
            />
            <Input
              label="Example Note"
              value={newMethodData.example}
              onChange={(e) => setNewMethodData({ ...newMethodData, example: e.target.value })}
              placeholder="e.g. 60-second Reels script"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Plus className="w-4 h-4" />}>
              Create Framework
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
