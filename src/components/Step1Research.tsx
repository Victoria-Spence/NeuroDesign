import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Criterion } from '../types';
import { RESEARCH_PRESETS } from '../data/researchPresets';
import { CriterionEditModal } from './CriterionEditModal';
import { apiUrl } from '../api';

interface Step1ResearchProps {
  researchText: string;
  setResearchText: (text: string) => void;
  criteria: Criterion[];
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  researchSummary: string;
  setResearchSummary: (s: string) => void;
  onProceedToDesign: () => void;
}

export const Step1Research: React.FC<Step1ResearchProps> = ({
  researchText,
  setResearchText,
  criteria,
  setCriteria,
  researchSummary,
  setResearchSummary,
  onProceedToDesign,
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);
  const [isNewCriterion, setIsNewCriterion] = useState(false);

  const approvedCount = criteria.filter((c) => c.approved).length;

  const handleSelectPreset = (presetId: string) => {
    const selected = RESEARCH_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setResearchText(selected.content);
      setExtractError(null);
    }
  };

  const handleExtractCriteria = async () => {
    if (!researchText.trim()) {
      setExtractError('Please enter or paste lighting research text with sources.');
      return;
    }

    setIsExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch(apiUrl('/api/extract-criteria'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract design criteria.');
      }

      if (data.extractedCriteria && Array.isArray(data.extractedCriteria)) {
        const mapped: Criterion[] = data.extractedCriteria.map((item: any, idx: number) => ({
          id: item.id || `crit-${idx + 1}`,
          title: item.title,
          category: item.category || 'General Lighting',
          researchSource: item.researchSource || 'Supplied Source',
          targetCriteria: item.targetCriteria,
          approved: true, // Default to approved so the designer can review/uncheck
        }));
        setCriteria(mapped);
        setResearchSummary(data.researchSummary || '');
      } else {
        throw new Error('No structured criteria returned by the AI extraction model.');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setExtractError(err.message || 'An unexpected error occurred during extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleApprove = (id: string) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: !c.approved } : c))
    );
  };

  const handleSelectAll = (approved: boolean) => {
    setCriteria((prev) => prev.map((c) => ({ ...c, approved })));
  };

  const handleDelete = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleOpenEdit = (crit: Criterion) => {
    setEditingCriterion(crit);
    setIsNewCriterion(false);
    setModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingCriterion(null);
    setIsNewCriterion(true);
    setModalOpen(true);
  };

  const handleSaveCriterion = (savedCrit: Criterion) => {
    if (isNewCriterion) {
      setCriteria((prev) => [...prev, savedCrit]);
    } else {
      setCriteria((prev) =>
        prev.map((c) => (c.id === savedCrit.id ? savedCrit : c))
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Step 1: Research &amp; Criteria Ingestion
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight" style={{ fontFamily: 'Arial' }}>
            Define Lighting Science &amp; Research Criteria
          </h1>
          <p className="mt-2 text-base text-stone-600 leading-relaxed" style={{ fontFamily: 'Arial' }}>
            Supply peer-reviewed lighting science, wellness standards (such as WELL v2, CIE, or IESNA),
            or circadian studies. NeuroDesign uses Gemini to extract actionable criteria, which you can
            fine-tune and approve before design evaluation.
          </p>
        </div>

        {/* Preset Library Buttons */}
        <div className="mt-6 pt-6 border-t border-[#EFEAE0]">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3" style={{ fontFamily: 'Arial' }}>
            Quick-Load Architectural Research Presets:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RESEARCH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className="text-left p-3.5 rounded-xl border border-[#E5DFD4] hover:border-teal-700/60 bg-[#FAF8F5] hover:bg-teal-50/40 transition-all group"
              >
                <div className="font-semibold text-stone-900 text-sm group-hover:text-teal-900 flex items-center justify-between">
                  {preset.title}
                  <Sparkles className="w-3.5 h-3.5 text-teal-700 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-stone-500 mt-1 line-clamp-1 font-mono">
                  {preset.subtitle}
                </div>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700" />
              Supplied Research &amp; Source Citations
            </label>
            {researchText && (
              <button
                type="button"
                onClick={() => setResearchText('')}
                className="text-xs text-stone-400 hover:text-stone-700 underline"
              >
                Clear text
              </button>
            )}
          </div>

          <textarea
            rows={8}
            value={researchText}
            onChange={(e) => setResearchText(e.target.value)}
            placeholder="Paste research text here, including paper titles, authors, standards (WELL, CIE, IES), or journal citations..."
            className="w-full p-4 rounded-xl border border-[#D5CDC2] bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-sm leading-relaxed font-sans"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-stone-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Citations are required to prevent AI hallucination during evaluation.
            </div>

            <button
              type="button"
              onClick={handleExtractCriteria}
              disabled={isExtracting || !researchText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-sm transition-all"
            >
              {isExtracting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting Design Criteria with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  Extract Design Criteria
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {extractError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Criteria Extraction Failed</strong>
                <p className="mt-0.5 text-rose-800">{extractError}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extracted Criteria Approval Section */}
      {criteria.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E8E2D8] p-4 sm:p-5 rounded-2xl shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-stone-900">
                  Extracted Criteria Review
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {approvedCount} of {criteria.length} Approved
                </span>
              </div>
              {researchSummary && (
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  {researchSummary}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-[#F5F2EB] hover:bg-[#EAE4D9] rounded-lg border border-[#E0D9CD]"
              >
                Approve All
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-[#F5F2EB] hover:bg-[#EAE4D9] rounded-lg border border-[#E0D9CD]"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={handleOpenNew}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Criterion
              </button>
            </div>
          </div>

          {/* Criteria Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteria.map((crit, index) => (
              <div
                key={crit.id}
                className={`p-5 rounded-2xl border transition-all ${
                  crit.approved
                    ? 'bg-white border-teal-800/25 shadow-xs ring-1 ring-teal-700/10'
                    : 'bg-[#F9F7F4] border-[#E8E2D8] opacity-75'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleApprove(crit.id)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                        crit.approved
                          ? 'bg-teal-800 text-white'
                          : 'border-2 border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                      title={crit.approved ? 'Criterion approved' : 'Click to approve'}
                    >
                      {crit.approved && <Check className="w-4 h-4 stroke-[2.5]" />}
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                      {crit.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(crit)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-[#F0ECE1] rounded-lg"
                      title="Edit criterion"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(crit.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete criterion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-base font-bold text-stone-900 font-display">
                  {crit.title}
                </h3>

                {/* Source Citation */}
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-stone-500 italic bg-[#FAF8F5] p-2 rounded-lg border border-[#EDE7DD]">
                  <span className="font-semibold not-italic text-stone-700 shrink-0">Source:</span>
                  <span>{crit.researchSource}</span>
                </div>

                {/* Target Requirement */}
                <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {crit.targetCriteria}
                </p>

                {/* Approval Status Footer */}
                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                  <span className={crit.approved ? 'text-teal-800 font-medium' : 'text-stone-400 font-medium'}>
                    {crit.approved ? 'Approved for evaluation' : 'Excluded from evaluation'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleApprove(crit.id)}
                    className="text-stone-500 hover:text-stone-800 underline text-xs"
                  >
                    {crit.approved ? 'Exclude' : 'Include'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              {approvedCount === 0
                ? 'Select at least one criterion above to proceed to design upload.'
                : `${approvedCount} criteria will be evaluated against your lighting design in Step 3.`}
            </p>

            <button
              type="button"
              onClick={onProceedToDesign}
              disabled={approvedCount === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-sm transition-all"
            >
              Proceed to Design Step
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit / New Modal */}
      <CriterionEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCriterion}
        criterion={editingCriterion}
        isNew={isNewCriterion}
      />
    </div>
  );
};
