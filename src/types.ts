export interface Criterion {
  id: string;
  title: string;
  category: string;
  researchSource: string;
  targetCriteria: string;
  approved: boolean;
}

export interface CriterionEvaluation {
  criterionId: string;
  criterionTitle: string;
  status: 'Addressed' | 'Partly addressed' | 'Needs attention' | 'Insufficient information';
  designEvidence: string;
  researchGrounding: string;
  practicalImprovement: string;
  missingSpecifications: string;
}

export interface EvaluationResult {
  overallAlignmentScore: number;
  executiveSummary: string;
  keyStrengths: string[];
  priorityAdjustments: string[];
  evaluations: CriterionEvaluation[];
}

export interface ResearchPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
}

export interface SamplePlan {
  id: string;
  title: string;
  type: string;
  description: string;
  svgDataUrl: string;
  defaultNotes: string;
}
