import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  Maximize2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { SamplePlan } from '../types';
import { SAMPLE_PLANS } from '../data/samplePlans';

interface Step2DesignProps {
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  imagePreviewUrl: string | null;
  setImagePreviewUrl: (url: string | null) => void;
  imageBase64: string | null;
  setImageBase64: (b64: string | null) => void;
  imageMimeType: string | null;
  setImageMimeType: (mime: string | null) => void;
  imageFileName: string | null;
  setImageFileName: (name: string | null) => void;
  explanatoryNotes: string;
  setExplanatoryNotes: React.Dispatch<React.SetStateAction<string>>;
  onProceedToEvaluate: () => void;
  onBackToResearch: () => void;
  approvedCount: number;
}

export const Step2Design: React.FC<Step2DesignProps> = ({
  imageFile,
  setImageFile,
  imagePreviewUrl,
  setImagePreviewUrl,
  imageBase64,
  setImageBase64,
  imageMimeType,
  setImageMimeType,
  imageFileName,
  setImageFileName,
  explanatoryNotes,
  setExplanatoryNotes,
  onProceedToEvaluate,
  onBackToResearch,
  approvedCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a JPG or PNG image file.');
      return;
    }

    setImageFile(file);
    setImageFileName(file.name);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreviewUrl(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSamplePlan = (plan: SamplePlan) => {
    setImageFile(null);
    setImageFileName(`${plan.title}.svg`);
    setImageMimeType('image/svg+xml');
    setImagePreviewUrl(plan.svgDataUrl);
    setImageBase64(plan.svgDataUrl);
    setExplanatoryNotes(plan.defaultNotes);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setImageBase64(null);
    setImageMimeType(null);
    setImageFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canProceed = Boolean(imagePreviewUrl || explanatoryNotes.trim());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Step 2: Lighting Plan &amp; Design Notes
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
            Upload Lighting Plan &amp; Specifications
          </h1>
          <p className="mt-2 text-base text-stone-600 leading-relaxed">
            Provide your Reflected Ceiling Plan (RCP), lighting layout drawing, or interior 3D rendering.
            Complement the visual plan with explanatory notes detailing luminaire types, color temperatures,
            control scenes, and lux objectives.
          </p>
        </div>

        {/* Quick Load Sample Plans */}
        <div className="mt-6 pt-6 border-t border-[#EFEAE0]">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
            Quick-Load Architectural Lighting Plans (for Immediate Testing):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => handleLoadSamplePlan(plan)}
                className="text-left p-4 rounded-xl border border-[#E5DFD4] hover:border-teal-700/60 bg-[#FAF8F5] hover:bg-teal-50/40 transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    {plan.type}
                  </div>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5 group-hover:text-teal-900">
                    {plan.title}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {plan.description}
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-teal-700 opacity-60 group-hover:opacity-100 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-700" />
                Lighting Plan / Interior Design Image (JPG or PNG)
              </label>
              {imagePreviewUrl && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Image
                </button>
              )}
            </div>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            {!imagePreviewUrl ? (
              /* Dropzone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-teal-700 bg-teal-50/50'
                    : 'border-[#D5CDC2] hover:border-teal-700/60 bg-[#FAF8F5] hover:bg-[#F5F2EB]'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EFEAE0] text-teal-800 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-stone-800 font-display">
                  Upload Lighting Plan or Reflected Ceiling Plan
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Drag and drop your CAD export, drawing sheet, or schematic interior render here, or click to browse files.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-800 text-white shadow-xs">
                  Choose JPG or PNG file
                </div>
                <p className="text-[11px] text-stone-400 mt-2">
                  Supports JPG, PNG, and high-resolution CAD exports
                </p>
              </div>
            ) : (
              /* Preview Area */
              <div className="relative rounded-xl border border-[#E0D9CD] bg-[#F7F5F0] overflow-hidden group">
                <div className="p-3 bg-white/90 border-b border-[#E0D9CD] flex items-center justify-between text-xs text-stone-700">
                  <span className="font-mono font-medium truncate max-w-xs">
                    {imageFileName || 'Uploaded Design Plan'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-1 text-stone-500 hover:text-stone-800 rounded bg-stone-100"
                      title={isZoomed ? 'Shrink' : 'Zoom full size'}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 font-medium text-[11px]"
                    >
                      Replace
                    </button>
                  </div>
                </div>

                <div className={`overflow-auto flex items-center justify-center p-2 bg-[#Fdfcf9] ${isZoomed ? 'max-h-[600px]' : 'max-h-[380px]'}`}>
                  <img
                    src={imagePreviewUrl}
                    alt="Lighting Plan Preview"
                    className="max-w-full h-auto object-contain rounded shadow-xs"
                  />
                </div>
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 text-xs text-stone-500 bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEAE0]">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong>Interior Designer Notice:</strong> Gemini analyzes symbols, fixture positions, daylight openings, and luminaire schedules directly from the image. Technical metrics (exact lux, UGR) cannot be verified purely visually and must be detailed in the notes.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Explanatory Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                Explanatory Notes &amp; Specifications
              </label>
              {explanatoryNotes && (
                <button
                  type="button"
                  onClick={() => setExplanatoryNotes('')}
                  className="text-xs text-stone-400 hover:text-stone-700 underline"
                >
                  Clear notes
                </button>
              )}
            </div>

            <p className="text-xs text-stone-500 mb-3">
              Describe luminaire types, intended CCT (e.g. 2700K vs 4000K), dimming zones, control scenes, lux objectives, and finishes.
            </p>

            <textarea
              rows={14}
              value={explanatoryNotes}
              onChange={(e) => setExplanatoryNotes(e.target.value)}
              placeholder="e.g.:&#10;LUMINAIRES:&#10;- L1: Recessed downlight 3000K, 90 CRI, deep baffle 35° cutoff&#10;- L2: Perimeter cove with 2200K-3000K warm dimming LED&#10;- L3: Low glare pendant over dining table&#10;&#10;CONTROL SCENES:&#10;- Scene 1 (Day): 100% cove + downlights&#10;- Scene 2 (Night): Downlights off, cove 10% 2200K, step lights on"
              className="w-full flex-1 p-3.5 rounded-xl border border-[#D5CDC2] bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-xs sm:text-sm font-mono leading-relaxed"
            />

            {/* Quick snippet buttons */}
            <div className="mt-3 pt-3 border-t border-[#EFEAE0]">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                Insert Specification Framework:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setExplanatoryNotes(
                      (prev) =>
                        prev +
                        (prev ? '\n\n' : '') +
                        'CONTROL SCENES:\n- Daytime (09:00-17:00): Full ambient + daylight harvesting\n- Evening Relax (19:00-23:00): Downlights OFF, Warm cove 2200K @ 15%\n- Night Path (23:00-06:00): Amber low-level step lights (<20 lux)'
                    )
                  }
                  className="text-[11px] px-2 py-1 rounded bg-[#F5F2EB] hover:bg-[#EBE5DC] text-stone-700 border border-[#E0D9CD]"
                >
                  + Add Circadian Scenes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExplanatoryNotes(
                      (prev) =>
                        prev +
                        (prev ? '\n\n' : '') +
                        'OPTICAL SPECIFICATION:\n- Deep baffled recessed downlights with 30° shielding cutoff angle\n- Micro-prismatic diffuser for glare suppression (target UGR < 19)\n- CRI Ra > 90 with saturated red R9 > 50'
                    )
                  }
                  className="text-[11px] px-2 py-1 rounded bg-[#F5F2EB] hover:bg-[#EBE5DC] text-stone-700 border border-[#E0D9CD]"
                >
                  + Add Optical Specs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToResearch}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#D5CDC2] hover:bg-[#F5F2EB] text-stone-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research ({approvedCount} Approved Criteria)
        </button>

        <div className="text-center sm:text-right">
          <div className="text-xs text-stone-500">
            {canProceed
              ? 'Ready for Gemini evaluation against approved criteria'
              : 'Please upload an image or enter design notes to proceed'}
          </div>
          <button
            type="button"
            onClick={onProceedToEvaluate}
            disabled={!canProceed}
            className="mt-1.5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-sm transition-all"
          >
            Proceed to Evaluation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
