import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Criterion } from '../types';

interface CriterionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (criterion: Criterion) => void;
  criterion: Criterion | null;
  isNew?: boolean;
}

const CATEGORIES = [
  'Circadian & Chronobiology',
  'Visual Comfort & Glare',
  'Task & Focal Lighting',
  'Atmosphere & Biophilia',
  'Technical Specification',
];

export const CriterionEditModal: React.FC<CriterionEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  criterion,
  isNew = false,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [researchSource, setResearchSource] = useState('');
  const [targetCriteria, setTargetCriteria] = useState('');

  useEffect(() => {
    if (criterion) {
      setTitle(criterion.title);
      setCategory(criterion.category || CATEGORIES[0]);
      setResearchSource(criterion.researchSource);
      setTargetCriteria(criterion.targetCriteria);
    } else {
      setTitle('');
      setCategory(CATEGORIES[0]);
      setResearchSource('');
      setTargetCriteria('');
    }
  }, [criterion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetCriteria.trim()) return;

    onSave({
      id: criterion ? criterion.id : `crit-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      researchSource: researchSource.trim() || 'Supplied User Research',
      targetCriteria: targetCriteria.trim(),
      approved: criterion ? criterion.approved : true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E2DBD0] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <h3 className="text-xl font-bold font-display text-stone-900">
            {isNew ? 'Add Design Criterion' : 'Edit Research Criterion'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#EFEAE0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Criterion Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Evening Melatonin Protection & Warm CCT Limit"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDC2] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDC2] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Research Source &amp; Citation
            </label>
            <input
              type="text"
              value={researchSource}
              onChange={(e) => setResearchSource(e.target.value)}
              placeholder="e.g. Figueiro et al. (2019), WELL v2 Feature L03"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDC2] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Target Design Requirement
            </label>
            <textarea
              required
              rows={4}
              value={targetCriteria}
              onChange={(e) => setTargetCriteria(e.target.value)}
              placeholder="e.g. Evening lighting in relaxation areas should not exceed 2700K CCT and should utilize shielded or indirect luminaires to avoid vertical melanopic lux > 30."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDC2] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-[#EFEAE0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-medium rounded-lg shadow-sm"
            >
              <Check className="w-4 h-4" />
              {isNew ? 'Create Criterion' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
