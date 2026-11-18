/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Step1Research } from './components/Step1Research';
import { Step2Design } from './components/Step2Design';
import { Step3Evaluate } from './components/Step3Evaluate';
import { Criterion, EvaluationResult } from './types';
import { RESEARCH_PRESETS } from './data/researchPresets';
import { SAMPLE_PLANS } from './data/samplePlans';
import { apiUrl } from './api';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Research State
  const [researchText, setResearchText] = useState<string>(RESEARCH_PRESETS[0].content);
  const [researchSummary, setResearchSummary] = useState<string>(
    'Circadian stimulus guidelines and photobiological health thresholds for residential environments from WELL v2 and Lighting Research Center (Figueiro & Rea).'
  );
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: 'crit-1',
      title: 'Evening Melatonin Protection & Warm CCT Limits',
      category: 'Circadian & Chronobiology',
      researchSource: 'Figueiro et al. (2019), Lighting Research & Technology',
      targetCriteria:
        'Evening lighting within 2 hours of sleep must not exceed 2700K CCT (ideally 2200K-2400K) and must utilize indirect or low-angle distribution to prevent melanopic lux > 30.',
      approved: true,
    },
    {
      id: 'crit-2',
      title: 'Daytime Alertness & High Vertical Eye Illuminance',
      category: 'Circadian & Chronobiology',
      researchSource: 'WELL Building Standard v2, Feature L03 (2020)',
      targetCriteria:
        'Living and active daytime spaces must achieve at least 150-200 Equivalent Melanopic Lux (EML) at eye level between 09:00 and 15:00 using daylight or diffused ambient fixtures.',
      approved: true,
    },
    {
      id: 'crit-3',
      title: 'Visual Comfort & Direct Glare Cut-Off Shielding',
      category: 'Visual Comfort & Glare',
      researchSource: 'Rea & Figueiro (2021), Frontiers in Neuroscience',
      targetCriteria:
        'Downlights in relaxation and reading zones must incorporate deep baffles (cut-off angle >= 30 degrees) or diffusers to avoid luminance ratios > 10:1 that induce pupillary strain.',
      approved: true,
    },
    {
      id: 'crit-4',
      title: 'Nocturnal Wayfinding & Amber Narrow-Band LEDs',
      category: 'Technical Specification',
      researchSource: 'Figueiro et al. (2019), Lighting Research & Technology',
      targetCriteria:
        'Hallway and bathroom nocturnal navigation lighting must maintain <= 20 lux at floor level with spectral emission concentrated above 590nm (amber/warm red, zero blue wavelength).',
      approved: true,
    },
  ]);

  // Step 2: Design State (Preloaded with the realistic Penthouse RCP sample for seamless testing)
  const initialPlan = SAMPLE_PLANS[0];
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialPlan.svgDataUrl);
  const [imageBase64, setImageBase64] = useState<string | null>(initialPlan.svgDataUrl);
  const [imageMimeType, setImageMimeType] = useState<string | null>('image/svg+xml');
  const [imageFileName, setImageFileName] = useState<string | null>('Penthouse_Living_Dining_RCP-01.svg');
  const [explanatoryNotes, setExplanatoryNotes] = useState<string>(initialPlan.defaultNotes);

  // Step 3: Evaluation Result State
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Server health check
  const [serverHealth, setServerHealth] = useState<{ hasApiKey: boolean } | null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch((err) => console.warn('Server health check error:', err));
  }, []);

  const approvedCount = criteria.filter((c) => c.approved).length;
  const hasDesign = Boolean(imagePreviewUrl || explanatoryNotes.trim());
  const hasEvaluation = Boolean(evaluationResult);

  const handleResetSession = () => {
    if (confirm('Are you sure you want to start a fresh evaluation session?')) {
      setCurrentStep(1);
      setResearchText('');
      setCriteria([]);
      setResearchSummary('');
      setImageFile(null);
      setImagePreviewUrl(null);
      setImageBase64(null);
      setImageMimeType(null);
      setImageFileName(null);
      setExplanatoryNotes('');
      setEvaluationResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Top Application Header */}
      <Header
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        approvedCount={approvedCount}
        hasDesign={hasDesign}
        hasEvaluation={hasEvaluation}
        onReset={handleResetSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentStep === 1 && (
          <Step1Research
            researchText={researchText}
            setResearchText={setResearchText}
            criteria={criteria}
            setCriteria={setCriteria}
            researchSummary={researchSummary}
            setResearchSummary={setResearchSummary}
            onProceedToDesign={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Design
            imageFile={imageFile}
            setImageFile={setImageFile}
            imagePreviewUrl={imagePreviewUrl}
            setImagePreviewUrl={setImagePreviewUrl}
            imageBase64={imageBase64}
            setImageBase64={setImageBase64}
            imageMimeType={imageMimeType}
            setImageMimeType={setImageMimeType}
            imageFileName={imageFileName}
            setImageFileName={setImageFileName}
            explanatoryNotes={explanatoryNotes}
            setExplanatoryNotes={setExplanatoryNotes}
            onProceedToEvaluate={() => {
              // Invalidate previous evaluation if design changed
              setCurrentStep(3);
            }}
            onBackToResearch={() => setCurrentStep(1)}
            approvedCount={approvedCount}
          />
        )}

        {currentStep === 3 && (
          <Step3Evaluate
            criteria={criteria}
            notes={explanatoryNotes}
            imageBase64={imageBase64}
            imageMimeType={imageMimeType}
            imageFileName={imageFileName}
            evaluationResult={evaluationResult}
            setEvaluationResult={setEvaluationResult}
            onBackToDesign={() => setCurrentStep(2)}
            onBackToResearch={() => setCurrentStep(1)}
          />
        )}
      </main>

      {/* Architectural Disclaimers & Footer */}
      <footer className="border-t border-[#E8E2D8] bg-[#FAF8F5] py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700 font-display">NeuroDesign</span>
            <span>— Architectural Lighting Science Evaluator</span>
          </div>
          <div className="text-stone-400 text-[11px] max-w-md">
            Grounded in user-supplied research. Technical lighting metrics (lux, UGR, M-EDI) cannot be fully verified from 2D images and require manufacturer photometric test reports.
          </div>
        </div>
      </footer>
    </div>
  );
}
