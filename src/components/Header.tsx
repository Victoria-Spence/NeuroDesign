import React from 'react';
import { Brain, BookOpen, Layers, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  approvedCount: number;
  hasDesign: boolean;
  hasEvaluation: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepChange,
  approvedCount,
  hasDesign,
  hasEvaluation,
  onReset,
}) => {
  return (
    <header className="border-b border-[#E8E2D8] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-800 text-amber-50 flex items-center justify-center shadow-sm">
              <Brain className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-stone-900 font-display">
                  NeuroDesign
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-900/10 text-teal-800 border border-teal-800/20">
                  Lighting Evaluator
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Evidence-Based Architectural Lighting Analysis for Interior Designers
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Step 1 Button */}
            <button
              onClick={() => onStepChange(1)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === 1
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#F0ECE1]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-teal-950 text-white' : 'bg-stone-300 text-stone-700'
              }`}>
                1
              </span>
              <span className="hidden md:inline">Research</span>
              {approvedCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  currentStep === 1 ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-800'
                }`}>
                  {approvedCount}
                </span>
              )}
            </button>

            <span className="text-stone-300 text-sm">/</span>

            {/* Step 2 Button */}
            <button
              onClick={() => onStepChange(2)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === 2
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#F0ECE1]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-teal-950 text-white' : 'bg-stone-300 text-stone-700'
              }`}>
                2
              </span>
              <span className="hidden md:inline">Design</span>
              {hasDesign && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <span className="text-stone-300 text-sm">/</span>

            {/* Step 3 Button */}
            <button
              onClick={() => onStepChange(3)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === 3
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#F0ECE1]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-teal-950 text-white' : 'bg-stone-300 text-stone-700'
              }`}>
                3
              </span>
              <span className="hidden md:inline">Evaluate</span>
              {hasEvaluation && (
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              )}
            </button>
          </nav>

          {/* Reset / New Session */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              title="Reset evaluation session"
              className="text-stone-500 hover:text-stone-800 hover:bg-[#EFE9DF] p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">New Session</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
