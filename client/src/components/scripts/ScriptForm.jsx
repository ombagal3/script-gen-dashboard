import React from 'react';
import {
  Sparkles,
  Layers,
  Wand2,
  HelpCircle,
  Clock,
  Globe,
  Sliders,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import {
  LANGUAGES,
  DURATIONS,
  PERSONAL_BRANDING_CATEGORIES,
  PERSONAL_BRANDING_GOALS,
  META_ADS_CATEGORIES,
  META_ADS_OBJECTIVES,
  META_CTA_TYPES,
  STORY_MARKETING_CATEGORIES,
  STORY_CTA_TYPES,
  PLATFORMS,
} from '../../utils/constants';

export const ScriptForm = ({
  module,
  formData,
  setFormData,
  methods = [],
  onSubmit,
  isLoading,
  onGenerateVariations,
}) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Top Main Row: Title & Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={module === 'meta-ads' ? 'Campaign Name' : 'Script Title'}
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={
            module === 'personal-branding'
              ? 'e.g. 3 Costly Tax Mistakes High Earners Make'
              : module === 'meta-ads'
              ? 'e.g. Q4 Growth Accelerator Launch Ad'
              : module === 'story-marketing'
              ? 'e.g. Behind The Scenes Breakthrough Story'
              : 'e.g. The 60-Second Viral Framework'
          }
        />

        {module === 'personal-branding' && (
          <Select
            label="Category"
            required
            options={PERSONAL_BRANDING_CATEGORIES}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        )}

        {module === 'meta-ads' && (
          <Select
            label="Ad Category"
            required
            options={META_ADS_CATEGORIES}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        )}

        {module === 'story-marketing' && (
          <Select
            label="Story Category"
            required
            options={STORY_MARKETING_CATEGORIES}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        )}

        {module === 'universal' && (
          <Input
            label="Custom Category"
            required
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g. Educational, Tech, Coaching"
          />
        )}
      </div>

      {/* Module-Specific Form Fields */}

      {/* 1. PERSONAL BRANDING MODULE FIELDS */}
      {module === 'personal-branding' && (
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Topic / Core Message"
              required
              value={formData.inputData?.topic || ''}
              onChange={(e) => handleNestedChange('topic', e.target.value)}
              placeholder="e.g. How to save $10k in tax without complex loopholes"
            />
            <Input
              label="Target Audience"
              required
              value={formData.inputData?.targetAudience || ''}
              onChange={(e) => handleNestedChange('targetAudience', e.target.value)}
              placeholder="e.g. Startup founders, doctors, salaried engineers"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Primary Platform"
              options={PLATFORMS}
              value={formData.inputData?.platform || 'Instagram Reels'}
              onChange={(e) => handleNestedChange('platform', e.target.value)}
            />
            <Select
              label="Primary Goal"
              options={PERSONAL_BRANDING_GOALS}
              value={formData.objective}
              onChange={(e) => handleChange('objective', e.target.value)}
            />
            <Input
              label="Tone"
              value={formData.inputData?.tone || ''}
              onChange={(e) => handleNestedChange('tone', e.target.value)}
              placeholder="e.g. Authoritative, Relatable, Calm"
            />
          </div>
        </div>
      )}

      {/* 2. META ADS MODULE FIELDS */}
      {module === 'meta-ads' && (
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Brand Name"
              required
              value={formData.inputData?.brandName || ''}
              onChange={(e) => handleNestedChange('brandName', e.target.value)}
              placeholder="e.g. Bulletproof Leads"
            />
            <Input
              label="Product or Service"
              required
              value={formData.inputData?.productService || ''}
              onChange={(e) => handleNestedChange('productService', e.target.value)}
              placeholder="e.g. AI-Powered CRM & Pipeline Automation"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Campaign Objective"
              options={META_ADS_OBJECTIVES}
              value={formData.objective}
              onChange={(e) => handleChange('objective', e.target.value)}
            />
            <Select
              label="CTA Button Type"
              options={META_CTA_TYPES}
              value={formData.inputData?.ctaType || 'Shop Now'}
              onChange={(e) => handleNestedChange('ctaType', e.target.value)}
            />
            <Select
              label="Platform Placement"
              options={['Reels and Stories', 'Feed Video', 'All Placements']}
              value={formData.inputData?.platformPlacement || 'Reels and Stories'}
              onChange={(e) => handleNestedChange('platformPlacement', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Customer Problem"
              required
              value={formData.inputData?.customerProblem || ''}
              onChange={(e) => handleNestedChange('customerProblem', e.target.value)}
              placeholder="e.g. Spending 15 hours a week following up manually"
            />
            <Input
              label="Benefits & Key USP"
              required
              value={formData.inputData?.benefitsUSP || ''}
              onChange={(e) => handleNestedChange('benefitsUSP', e.target.value)}
              placeholder="e.g. Automatically book meetings on calendar with 3x speed"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Price or Special Offer"
              value={formData.inputData?.priceOffer || ''}
              onChange={(e) => handleNestedChange('priceOffer', e.target.value)}
              placeholder="e.g. 50% Off First Month • $49/mo"
            />
            <Input
              label="Actual Testimonial or Proof"
              value={formData.inputData?.actualTestimonials || ''}
              onChange={(e) => handleNestedChange('actualTestimonials', e.target.value)}
              placeholder="e.g. 'Saved our team 20 hours each week' - Mark S."
              helperText="Verified proof only (will not fabricate)"
            />
            <Input
              label="Landing Page URL"
              value={formData.inputData?.landingPageUrl || ''}
              onChange={(e) => handleNestedChange('landingPageUrl', e.target.value)}
              placeholder="https://yourbrand.com/offer"
            />
          </div>
        </div>
      )}

      {/* 3. STORY MARKETING MODULE FIELDS */}
      {module === 'story-marketing' && (
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Story Topic / Sequence Idea"
              required
              value={formData.inputData?.topic || ''}
              onChange={(e) => handleNestedChange('topic', e.target.value)}
              placeholder="e.g. The mistake that cost us $10,000 and how we recovered"
            />
            <Select
              label="Number of Slides"
              options={[
                { value: 3, label: '3 Slides (Quick Teaser)' },
                { value: 4, label: '4 Slides (Concise Flow)' },
                { value: 5, label: '5 Slides (Standard Default: Open, Pain, Insight, Solution, CTA)' },
                { value: 6, label: '6 Slides (Detailed Story + Proof)' },
                { value: 7, label: '7 Slides (Deep Narrative Arc)' },
              ]}
              value={formData.inputData?.slideCount || 5}
              onChange={(e) => handleNestedChange('slideCount', parseInt(e.target.value, 10))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Story Call-To-Action (CTA)"
              options={STORY_CTA_TYPES}
              value={formData.objective}
              onChange={(e) => handleChange('objective', e.target.value)}
            />
            <Input
              label="Story Tone"
              value={formData.inputData?.tone || ''}
              onChange={(e) => handleNestedChange('tone', e.target.value)}
              placeholder="e.g. Casual, Candid selfie style, Transparent"
            />
          </div>
        </div>
      )}

      {/* 4. UNIVERSAL GENERATOR TOPIC FIELD */}
      {module === 'universal' && (
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          <Input
            label="Script Topic & Core Context"
            required
            value={formData.inputData?.topic || ''}
            onChange={(e) => handleNestedChange('topic', e.target.value)}
            placeholder="e.g. Why most people fail at lead generation and how to fix it"
          />
          <Input
            label="Target Audience"
            value={formData.inputData?.targetAudience || ''}
            onChange={(e) => handleNestedChange('targetAudience', e.target.value)}
            placeholder="e.g. Agency founders and consultants"
          />
        </div>
      )}

      {/* Global Row: Method Selector, Duration, Language */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Writing Method / Framework"
          options={methods.map((m) => ({
            value: m._id || m.id,
            label: m.name,
          }))}
          value={formData.methodId || ''}
          onChange={(e) => handleChange('methodId', e.target.value)}
          placeholder="Select a Script Method"
        />

        <Select
          label="Duration"
          options={DURATIONS}
          value={formData.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value, 10))}
        />

        <Select
          label="Language"
          options={LANGUAGES}
          value={formData.language}
          onChange={(e) => handleChange('language', e.target.value)}
        />
      </div>

      {/* Additional Instructions */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Additional Instructions (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.inputData?.additionalInstructions || ''}
          onChange={(e) => handleNestedChange('additionalInstructions', e.target.value)}
          placeholder="e.g. Mention our upcoming webinar, keep the tone very direct, emphasize fast turnaround..."
          className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          {onGenerateVariations && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onGenerateVariations}
              disabled={isLoading}
              leftIcon={<Wand2 className="w-4 h-4 text-indigo-500" />}
            >
              Generate 3 Variations
            </Button>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Sparkles className="w-5 h-5" />}
          className="min-w-[180px]"
        >
          {isLoading ? 'Crafting Script...' : 'Generate Script'}
        </Button>
      </div>
    </form>
  );
};
