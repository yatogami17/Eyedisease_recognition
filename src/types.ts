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

export type LesionType = 
  | "microaneurysm" 
  | "hemorrhage" 
  | "hard_exudate" 
  | "cotton_wool_spot" 
  | "optic_cupping" 
  | "rim_thinning" 
  | "av_nicking" 
  | "copper_wiring" 
  | "drusen" 
  | "normal_landmark";

export interface LocalizedAbnormality {
  id: string;
  lesionType: LesionType;
  label: string;
  x: number; // center % (0 - 100)
  y: number; // center % (0 - 100)
  width: number; // bounding box width % (0 - 100)
  height: number; // bounding box height % (0 - 100)
  severity: "info" | "warning" | "danger";
  description: string;
  clinicalSignificance: string;
  confidence: number;
}

export interface OpticDiscMetrics {
  cupToDiscRatio: number; // e.g. 0.78
  normalThreshold: number; // 0.3 - 0.4
  isntRuleCompliant: boolean;
  rimThickness: {
    inferior: number; // mm
    superior: number; // mm
    nasal: number; // mm
    temporal: number; // mm
  };
  discDiameterPx: number;
  cupDiameterPx: number;
  clinicalAssessment: string;
}

export interface VascularMetrics {
  arterioleToVenuleRatio: number; // standard: 0.67 (2:3)
  tortuosityIndex: number; // 1.0 - 1.8
  bifurcationDensity: number; // branches / mm2
  avNickingCount: number;
  copperWiringPresent: boolean;
  clinicalAssessment: string;
}

export interface CompatibilityValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  format: { passed: boolean; value: string; message: string };
  resolution: { passed: boolean; width: number; height: number; message: string };
  aspectRatio: { passed: boolean; ratio: number; message: string };
  circularity: { passed: boolean; score: number; message: string };
  illumination: { passed: boolean; meanLuminance: number; snrEstimateDb: number; message: string };
  overallAssessment: "Optimal Diagnostic Quality" | "Acceptable Diagnostic Quality" | "Suboptimal Quality (Warning)" | "Incompatible File";
  warningMessages: string[];
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
  localizedAbnormalities?: LocalizedAbnormality[];
  opticMetrics?: OpticDiscMetrics;
  vascularMetrics?: VascularMetrics;
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
  boxWidth?: number;
  boxHeight?: number;
  lesionType?: LesionType;
}

export interface SampleRetinalImage {
  id: string;
  name: string;
  conditionKey: "normal" | "diabetic" | "hypertension" | "glaucoma" | "amd" | "cataract";
  clinicalTitle: string;
  shortDescription: string;
  longClinicalDescription: string;
  markers: FundusMarker[];
  primaryBgColor: string; // SVG background base color
  abnormalities?: LocalizedAbnormality[];
  opticMetrics?: OpticDiscMetrics;
  vascularMetrics?: VascularMetrics;
}

export type NavTab = 
  | "home" 
  | "upload" 
  | "preprocessing" 
  | "cnn-analysis" 
  | "results" 
  | "training"
  | "history" 
  | "about"
  | "architecture" 
  | "paper" 
  | "plagiarism";

export interface PreprocessingSettings {
  grayscale: boolean;
  gaussianBlur: number;
  contrastClahe: number;
  greenChannelExtraction: boolean;
  normalization: boolean;
  brightness: number;
}

export interface CnnProcessingStage {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed";
  detail: string;
  outputDescription: string;
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

