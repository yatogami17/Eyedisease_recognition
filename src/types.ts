export type AnalysisStatus = "Normal" | "Warning" | "Urgent";

export interface ConditionProbability {
  name: string;
  probability: number;
  description: string;
}

export interface AnatomicalFindings {
  opticDisc: string;
  macula: string;
  vasculature: string;
  retinalBackground: string;
}

export interface MedicationItem {
  name: string;
  purpose: string;
  dosageExample: string;
}

export interface OpticalItem {
  deviceOrProcedure: string;
  purpose: string;
  frequency: string;
}

export interface PredictionResult {
  primaryDiagnosis: string;
  confidence: number;
  status: AnalysisStatus;
  riskScore: number;
  conditions: ConditionProbability[];
  anatomicalFindings: AnatomicalFindings;
  detailedAnalysis: string;
  recommendations: string[];
  medicationGuidance?: {
    therapeuticClass: string;
    targetAction: string;
    agents: MedicationItem[];
    clinicalWarnings: string;
  };
  opticalManagement?: {
    requiredCorrection: string;
    interventions: OpticalItem[];
    dailyMonitoring: string;
  };
  customMarkers?: FundusMarker[];
}

export interface FundusMarker {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  label: string;
  description: string;
  severity: "info" | "warning" | "danger";
}

export interface SampleRetinalImage {
  id: string;
  name: string;
  conditionKey: "normal" | "diabetic" | "glaucoma" | "amd" | "cataract";
  clinicalTitle: string;
  shortDescription: string;
  longClinicalDescription: string;
  markers: FundusMarker[];
  primaryBgColor: string; // SVG background base color
}

export interface ScreeningHistoryItem {
  id: string;
  timestamp: string;
  primaryDiagnosis: string;
  status: AnalysisStatus;
  riskScore: number;
  confidence: number;
  sourceType: "sample" | "upload";
  sourceName: string;
  thumbnail: string; // base64 or identifier
}

export interface SymptomConfig {
  id: string;
  label: string;
  description: string;
  severity: "low" | "medium" | "high";
  matchedConditions: string[];
}

export interface PlagiarismMatchedSegment {
  codeAStartLine: number;
  codeAEndLine: number;
  codeBStartLine: number;
  codeBEndLine: number;
  matchedContent: string;
  lineCount: number;
}

export interface PlagiarismResult {
  plagiarismPercentage: number;
  status: string;
  severityClass: "info" | "warning" | "danger";
  summary: string;
  details: string;
  matchedSegments: PlagiarismMatchedSegment[];
  recommendations: string[];
  telemetry: {
    totalLinesA: number;
    totalLinesB: number;
    cleanCharsA: number;
    cleanCharsB: number;
    matchedChars: number;
    engine: string;
  };
}

export interface PlagiarismPreset {
  id: string;
  name: string;
  expectedScore: string;
  description: string;
  codeA: string;
  codeB: string;
}

