import { PredictionInput, PredictionResult, RiskLevel, RiskAnalysisResult, ShapFactor } from '../types';

// Standard coefficients derived from a logistic regression trained on the Pima Indians Diabetes Dataset:
// Feature weights (Beta coefficients):
const coefficients = {
  intercept: -8.4,
  pregnancies: 0.123,
  glucose: 0.035,
  bloodPressure: -0.013,
  skinThickness: 0.0006,
  insulin: -0.0002,
  bmi: 0.089,
  diabetesPedigree: 0.945,
  age: 0.014
};

/**
 * Predicts diabetes risk probability using Logistic Regression formulation.
 */
export function calculateRisk(inputs: PredictionInput): { probability: number; riskLevel: RiskLevel } {
  const z = 
    coefficients.intercept +
    coefficients.pregnancies * inputs.pregnancies +
    coefficients.glucose * inputs.glucose +
    coefficients.bloodPressure * inputs.bloodPressure +
    coefficients.skinThickness * inputs.skinThickness +
    coefficients.insulin * inputs.insulin +
    coefficients.bmi * inputs.bmi +
    coefficients.diabetesPedigree * inputs.diabetesPedigree +
    coefficients.age * inputs.age;

  // Sigmoid formula
  const probability = 1 / (1 + Math.exp(-z));

  let riskLevel: RiskLevel = 'Low';
  if (probability > 0.65) {
    riskLevel = 'High';
  } else if (probability > 0.3) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'Low';
  }

  return {
    probability,
    riskLevel
  };
}

/**
 * Generates personalized medical feedback and actionable recommendations based on client-specific triggers.
 */
export function generateRecommendations(inputs: PredictionInput, riskLevel: RiskLevel, probability: number): string[] {
  const list: string[] = [];

  // General risk level messaging
  if (riskLevel === 'High') {
    list.push("Consult a healthcare professional (endocrinologist or primary care physician) immediately for a diagnostic HbA1c or Oral Glucose Tolerance Test.");
    list.push("Closely monitor your blood glucose levels, particularly before and after meals.");
    list.push("Work with a certified diabetes educator or registered dietitian to develop a personalized low-glycemic, portion-controlled nutrition plan.");
  } else if (riskLevel === 'Moderate') {
    list.push("Schedule a routine wellness checkup with your doctor to discuss your screening result and evaluate preventive care.");
    list.push("Aim for gradual, sustainable dietary adjustments—reduce refined carbohydrates, artificial sweeteners, and processed foods.");
    list.push("Monitor key lifestyle triggers: record daily water intake, aim for 7-8 hours of sound sleep, and introduce light stress-reduction habits.");
  } else {
    list.push("Maintain your positive healthy lifestyle habits. Keep up standard visual screenings and annual physicals.");
    list.push("Ensure a nutrient-rich, balanced diet consisting of whole foods, leafy greens, healthy fats, and lean proteins.");
    list.push("Continue current cardiovascular or strength training activities, supporting cardiorespiratory health.");
  }

  // Trigger-specific guidance based on inputs:

  // BMI trigger
  if (inputs.bmi >= 25) {
    list.push(`Manage BMI (current: ${inputs.bmi.toFixed(1)}): Aim for a target weight loss of 5-10% of total body weight. Incorporate 150 minutes of moderate physical activity (like brisk walking, swimming, or cycling) weekly.`);
  }

  // Glucose triggers
  if (inputs.glucose >= 140) {
    list.push(`Address elevated glucose (${inputs.glucose} mg/dL): Limit simple sugars and fast-burning carbohydrates. Prioritize soluble dietary fibers (oats, legumes, nuts) to slow sugar absorption.`);
  } else if (inputs.glucose < 70 && inputs.glucose > 0) {
    list.push(`Hypoglycemia risk warning (${inputs.glucose} mg/dL): Ensure you do not skip balanced meals, particularly if engaging in intensive physical training.`);
  }

  // Blood pressure triggers
  if (inputs.bloodPressure >= 130) {
    list.push(`Optimize blood pressure (${inputs.bloodPressure} mmHg): Restrict daily sodium intake below 2,000 mg (about 1 teaspoon of salt). Incorporate potassium-rich foods (bananas, spinach, avocados) unless medically contraindicated.`);
  } else if (inputs.bloodPressure > 0 && inputs.bloodPressure < 90) {
    list.push(`Low blood pressure (${inputs.bloodPressure} mmHg): Ensure adequate hydration (8-10 glasses of water daily) and discuss circulatory metrics during your physical checkup.`);
  }

  // General lifestyle tips
  if (inputs.age >= 45) {
    list.push("Age-related screening: Clinical practice guidelines recommend annual diabetes screening tests for all adults aged 45 and older.");
  }

  return list;
}

/**
 * Creates a unique prediction object and appends to localStorage history.
 */
export function savePrediction(inputs: PredictionInput, probability: number, riskLevel: RiskLevel): PredictionResult {
  const recommendations = generateRecommendations(inputs, riskLevel, probability);
  const record: PredictionResult = {
    id: 'rec_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    inputs,
    probability,
    riskLevel,
    recommendations
  };

  try {
    const existing = localStorage.getItem('healthguard_history');
    const list: PredictionResult[] = existing ? JSON.parse(existing) : [];
    list.unshift(record);
    localStorage.setItem('healthguard_history', JSON.stringify(list));
  } catch (err) {
    console.error("Local storage save error", err);
  }

  return record;
}

/**
 * Fetches user prediction history.
 */
export function getPredictionHistory(): PredictionResult[] {
  try {
    const existing = localStorage.getItem('healthguard_history');
    return existing ? JSON.parse(existing) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Resets user prediction history.
 */
export function clearPredictionHistory(): void {
  try {
    localStorage.removeItem('healthguard_history');
  } catch (err) {
    console.error("Local storage clear error", err);
  }
}

/**
 * Map of feature descriptions and clinical relevance
 */
export const featureDetails = {
  pregnancies: {
    title: "Pregnancies",
    unit: "count",
    desc: "Number of times pregnant. Gestational hormones can induce temporary insulin resistance, elevating historical long-term diabetes risk.",
    normal: "0 - 4"
  },
  glucose: {
    title: "Plasma Glucose Concentration",
    unit: "mg/dL",
    desc: "2-hour post Oral Glucose Tolerance Test (OGTT). Primary biological diagnostic driver representing systemic insulin regulation.",
    normal: "70 - 140 mg/dL"
  },
  bloodPressure: {
    title: "Blood Pressure",
    unit: "mmHg",
    desc: "Diastolic arterial pressure. Essential vascular stressor. Elevated pressure (hypertension) heavily correlates with metabolic syndrome.",
    normal: "60 - 80 mmHg"
  },
  skinThickness: {
    title: "Triceps Skin Fold Thickness",
    unit: "mm",
    desc: "Proxy measurement for body fat distribution, estimating subcutaneous adipose layers and systemic lipids load.",
    normal: "10 - 30 mm"
  },
  insulin: {
    title: "2-Hour Serum Insulin",
    unit: "mu U/ml",
    desc: "Biological response to glucose. High values indicate chronic hyperinsulinemia (insulin resistance); low values suggest pancreatic insufficiency.",
    normal: "15 - 120 mu U/ml"
  },
  bmi: {
    title: "Body Mass Index",
    unit: "kg/m²",
    desc: "A weight-to-height ratio estimation. Highly sensitive indicator for chronic low-grade tissue inflammation and ectopic fat accumulation.",
    normal: "18.5 - 24.9 kg/m²"
  },
  diabetesPedigree: {
    title: "Diabetes Pedigree Function",
    unit: "score",
    desc: "Scores genetic influence based on extensive family history profiles. Translates genetic heritage factor mathematically.",
    normal: "0.1 - 0.8"
  },
  age: {
    title: "Age",
    unit: "years",
    desc: "Patient age. Advancing age statistically decreases beta-cell function and limits muscular capture of glucose, elevating basic risks.",
    normal: "18 - 65 years"
  }
};

/**
 * Computes math-exact Local SHAP explanations for the active screening input.
 * For linear/logistic models, local Shapley values map strictly to the difference
 * of features from cohort baselines, weighted by model beta coefficients.
 */
export function calculateShapExplanations(inputs: PredictionInput): RiskAnalysisResult {
  const baselines = {
    pregnancies: 3.845,
    glucose: 120.895,
    bloodPressure: 69.105,
    skinThickness: 20.536,
    insulin: 79.799,
    bmi: 31.993,
    diabetesPedigree: 0.472,
    age: 33.241
  };

  const coefs = {
    pregnancies: 0.123,
    glucose: 0.035,
    bloodPressure: -0.013,
    skinThickness: 0.0006,
    insulin: -0.0002,
    bmi: 0.089,
    diabetesPedigree: 0.945,
    age: 0.014
  };

  const labels: Record<keyof PredictionInput, string> = {
    pregnancies: "Pregnancies",
    glucose: "Glucose Concentration",
    bloodPressure: "Blood Pressure",
    skinThickness: "Skin Fold Thickness",
    insulin: "Insulin Concentration",
    bmi: "Body Mass Index (BMI)",
    diabetesPedigree: "Diabetes Pedigree Family Factor",
    age: "Patient Age"
  };

  // 1. Calculate raw SHAP values: (value - baseline) * coefficient
  const shapRaw: Record<keyof PredictionInput, number> = {} as any;
  let absoluteSum = 0;

  (Object.keys(inputs) as Array<keyof PredictionInput>).forEach(key => {
    const dVal = inputs[key] - baselines[key];
    const rawVal = dVal * coefs[key];
    shapRaw[key] = rawVal;
    absoluteSum += Math.abs(rawVal);
  });

  if (absoluteSum === 0) absoluteSum = 1;

  // 2. Map features into ShapFactor representation with health range mappings
  const factors: ShapFactor[] = (Object.keys(inputs) as Array<keyof PredictionInput>).map(key => {
    const value = inputs[key];
    const baseline = baselines[key];
    const shapVal = shapRaw[key];
    const rawPct = (shapVal / absoluteSum) * 100;
    const percentage = Math.round(rawPct); // Keep sign representation (+ or -)

    // Set clinical status & healthy ranges for comparison
    let status = "Healthy Range";
    let impact: 'High' | 'Moderate' | 'Low' | 'Healthy' = 'Healthy';
    let healthyRange = "Normal";
    let insight = "";

    switch (key) {
      case 'glucose':
        healthyRange = "70 - 140 mg/dL";
        if (value > 140) {
          status = "High Risk";
          impact = "High";
          insight = "Elevated blood sugars directly trigger high risk states.";
        } else if (value < 70) {
          status = "Below Healthy Range";
          impact = "Moderate";
          insight = "Blood sugars are below normal limits.";
        } else {
          status = "Healthy Range";
          impact = "Healthy";
          insight = "Glucose is within safe physiological limits.";
        }
        break;
      case 'bmi':
        healthyRange = "18.5 - 24.9 kg/m²";
        if (value >= 30) {
          status = "Obese Category";
          impact = "High";
          insight = "Elevated BMI heavily correlates with insulin resistance.";
        } else if (value >= 25) {
          status = "Overweight Category";
          impact = "Moderate";
          insight = "Mild body mass surcharge increases metabolic stress.";
        } else if (value < 18.5) {
          status = "Underweight Category";
          impact = "Moderate";
          insight = "BMI falls below standard reference controls.";
        } else {
          status = "Healthy Range";
          impact = "Healthy";
          insight = "Body Mass Index is in the optional healthy range.";
        }
        break;
      case 'age':
        healthyRange = "18 - 45 Years";
        if (value >= 45) {
          status = "Moderate Risk Range";
          impact = "Moderate";
          insight = "Natural age-related decline in beta-cell output.";
        } else {
          status = "Normal Range";
          impact = "Healthy";
          insight = "Younger age acts as a protective metabolic factor.";
        }
        break;
      case 'bloodPressure':
        healthyRange = "60 - 80 mmHg";
        if (value >= 130) {
          status = "Elevated Range";
          impact = "Moderate";
          insight = "Arterial stress correlates with overall vascular hazards.";
        } else if (value < 60) {
          status = "Low Blood Pressure";
          impact = "Low";
          insight = "Vascular pressures are relatively low.";
        } else {
          status = "Normal Range";
          impact = "Healthy";
          insight = "Blood pressure is perfectly optimized.";
        }
        break;
      case 'pregnancies':
        healthyRange = "0 - 4 Count";
        if (value >= 5) {
          status = "Elevated Range";
          impact = "Moderate";
          insight = "Multiple pregnancies are linked to historical glucose tolerance stress.";
        } else {
          status = "Normal Range";
          impact = "Healthy";
          insight = "Low gestational stress on insulin production.";
        }
        break;
      case 'insulin':
        healthyRange = "15 - 120 mu U/ml";
        if (value > 120) {
          status = "High Insulin";
          impact = "Moderate";
          insight = "Suggests potential tissue insulin resistance state.";
        } else if (value < 15) {
          status = "Low Insulin";
          impact = "Low";
          insight = "Relatively low active blood insulin concentration.";
        } else {
          status = "Normal Range";
          impact = "Healthy";
          insight = "Insulin metrics are stable and well-regulated.";
        }
        break;
      case 'skinThickness':
        healthyRange = "10 - 30 mm";
        if (value > 30) {
          status = "Elevated Fat Profile";
          impact = "Low";
          insight = "Elevated skin folds suggest moderate adipose tissue reserves.";
        } else {
          status = "Normal Range";
          impact = "Healthy";
          insight = "Tissue fold values align with average healthy standards.";
        }
        break;
      case 'diabetesPedigree':
        healthyRange = "0.1 - 0.8 Score";
        if (value > 0.8) {
          status = "High Genetic Score";
          impact = "High";
          insight = "Indicates high familial clustering of diabetes histories.";
        } else if (value > 0.5) {
          status = "Moderate Hereditary";
          impact = "Moderate";
          insight = "Average family risk profiles registered.";
        } else {
          status = "Minimal Score";
          impact = "Healthy";
          insight = "Low levels of family diabetes prevalence recorded.";
        }
        break;
    }

    return {
      name: key,
      label: labels[key],
      value,
      baseline,
      shapValue: shapVal,
      percentage,
      impact,
      status,
      healthyRange,
      insight
    };
  });

  // Sort factor contributions descending by absolute contribution magnitude
  const sortedFactors = [...factors].sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  // 3. Clinical Interpretation Formulation
  let clinicalInterpretation = "";
  if (inputs.glucose > 140) {
    clinicalInterpretation += "The primary factor influencing this elevated diabetes risk is the patient's plasma glucose concentration, which exceeds healthy reference levels. ";
  } else {
    clinicalInterpretation += "The patient's plasma glucose concentration is currently within healthy reference limits, acting as a pivotal clinical protective factor. ";
  }

  if (inputs.bmi >= 25) {
    clinicalInterpretation += `An increased BMI of ${inputs.bmi.toFixed(1)} further acts as a positive contributor to the risk score by increasing insulin resistance tissues. `;
  } else {
    clinicalInterpretation += "A well-regulated BMI keeps general tissue sensitivity healthy. ";
  }

  if (inputs.age >= 45) {
    clinicalInterpretation += "Advanced age is also registered as an incremental background hazard. ";
  }

  // 4. Personalized Insights
  const personalizedInsights: string[] = [];
  if (inputs.glucose > 140) {
    personalizedInsights.push(`If glucose is reduced from ${inputs.glucose} mg/dL to 120 mg/dL, predicted risk may decrease significantly.`);
  } else {
    personalizedInsights.push("Maintaining glucose under 100 mg/dL will continue to secure the lowest hazard classification.");
  }

  if (inputs.bmi >= 25) {
    const targetBmi = 24.0;
    personalizedInsights.push(`If BMI is reduced from ${inputs.bmi.toFixed(1)} to ${targetBmi}, overall metabolic risk may improve.`);
  } else {
    personalizedInsights.push("Your BMI resides in an excellent reference category. Preserve this through active core exercises.");
  }

  if (inputs.bloodPressure >= 130) {
    personalizedInsights.push(`If diastolic blood pressure is stabilized to 80 mmHg (currently: ${inputs.bloodPressure} mmHg), systemic cardiovascular load is reduced.`);
  }

  return {
    factors: sortedFactors,
    clinicalInterpretation,
    personalizedInsights
  };
}
