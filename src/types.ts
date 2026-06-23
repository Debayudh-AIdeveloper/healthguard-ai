export interface PredictionInput {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigree: number;
  age: number;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface PredictionResult {
  id: string;
  timestamp: string;
  inputs: PredictionInput;
  probability: number; // 0 to 1
  riskLevel: RiskLevel;
  recommendations: string[];
}

export interface FeatureImportance {
  name: string;
  score: number;
  description: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface ShapFactor {
  name: keyof PredictionInput;
  label: string;
  value: number;
  baseline: number;
  shapValue: number;
  percentage: number; // Feature contribution percentage
  impact: 'High' | 'Moderate' | 'Low' | 'Healthy';
  status: string;
  healthyRange: string;
  insight: string;
}

export interface RiskAnalysisResult {
  factors: ShapFactor[];
  clinicalInterpretation: string;
  personalizedInsights: string[];
}

export interface PythonCodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}
