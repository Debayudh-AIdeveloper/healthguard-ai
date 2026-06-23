import React, { useState } from 'react';
import { PredictionInput } from '../types';
import { calculateRisk, savePrediction, featureDetails } from '../utils/mlEngine';
import { Calculator, HelpCircle, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PredictProps {
  setCurrentView: (view: string) => void;
  setLastPrediction: (result: any) => void;
}

export default function PredictView({ setCurrentView, setLastPrediction }: PredictProps) {
  // Main form fields
  const [form, setForm] = useState<PredictionInput>({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 70,
    skinThickness: 20,
    insulin: 80,
    bmi: 26.5,
    diabetesPedigree: 0.471,
    age: 35
  });

  // Built-in BMI calculator states
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [calculatorBmi, setCalculatorBmi] = useState<number | null>(null);

  // Error/validation states
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // BMI Calculation function
  const handleCalculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    if (w > 20 && w < 350 && h > 1 && h < 2.5) {
      const calculated = w / (h * h);
      setCalculatorBmi(calculated);
      setForm(prev => ({ ...prev, bmi: parseFloat(calculated.toFixed(1)) }));
      setErrors([]);
    } else {
      setErrors(["Please enter valid weight (20-350 kg) and height (100-250 cm) parameters."]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit assessment handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    // Diagnostic validation limits
    if (form.pregnancies < 0 || form.pregnancies > 20) validationErrors.push("Pregnancies must range between 0 and 20.");
    if (form.glucose < 0 || form.glucose > 300) validationErrors.push("Glucose blood sugar must range between 0 and 300 mg/dL.");
    if (form.bloodPressure < 0 || form.bloodPressure > 200) validationErrors.push("Diastolic blood pressure must range between 0 and 200 mmHg.");
    if (form.skinThickness < 0 || form.skinThickness > 100) validationErrors.push("Skin thickness must range between 0 and 100 mm.");
    if (form.insulin < 0 || form.insulin > 1000) validationErrors.push("Insulin level must range between 0 and 1,000 mu U/ml.");
    if (form.bmi < 10 || form.bmi > 80) validationErrors.push("Body Mass Index (BMI) must range between 10 and 80 kg/m².");
    if (form.diabetesPedigree < 0.01 || form.diabetesPedigree > 3.0) validationErrors.push("Diabetes pedigree score must range between 0.01 and 3.0.");
    if (form.age < 1 || form.age > 120) validationErrors.push("Age parameters must range between 1 and 120 years.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Predictive calculation
    const { probability, riskLevel } = calculateRisk(form);
    const saved = savePrediction(form, probability, riskLevel);
    
    setLastPrediction(saved);
    setCurrentView('result');
  };

  // Reset form helper
  const handleReset = () => {
    setForm({
      pregnancies: 0,
      glucose: 120,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 80,
      bmi: 26.5,
      diabetesPedigree: 0.471,
      age: 35
    });
    setWeight('');
    setHeight('');
    setCalculatorBmi(null);
    setErrors([]);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">diabetes Risk Screening Form</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Physiological parameters are standard, objective biomarkers. Input clinical parameters carefully to proceed.
        </p>
      </div>

      {/* Embedded BMI calculator tool */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50/55 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-500/30 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-3">
          <Calculator className="w-5 h-5 text-emerald-500" />
          <h3>BMI Calculator Assist</h3>
        </div>
        <p className="text-emerald-700 dark:text-emerald-400 text-sm mb-4 leading-relaxed">
          Need to compute your exact Body Mass Index? Insert your body metrics here. The calculator automatically computes your score and replaces the primary BMI field below.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Weight (kg)</label>
            <input 
              type="number" 
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Height (cm)</label>
            <input 
              type="number" 
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCalculateBmi}
            className="col-span-2 sm:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm cursor-pointer"
            id="calculate-bmi-btn"
          >
            Calculate & Update BMI
          </button>
        </div>

        {calculatorBmi && (
          <div className="mt-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold bg-emerald-100/50 dark:bg-emerald-900/30 p-2.5 rounded-lg flex justify-between items-center">
            <span>Resulting BMI: {calculatorBmi.toFixed(1)} kg/m²</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">(Primary form updated successfully)</span>
          </div>
        )}
      </motion.div>

      {/* Main Validation Notification Panel */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl p-4 text-red-800 dark:text-red-200 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>Diagnostic Warnings Detected:</span>
            </div>
            <ul className="list-disc pl-5 text-xs space-y-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoring Form Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Iterates dynamically through form structures to ensure strict rendering and tooltip support */}
            {Object.keys(form).map((key) => {
              const fieldKey = key as keyof PredictionInput;
              const details = featureDetails[fieldKey];
              let stepValue = "1";
              if (fieldKey === 'bmi') stepValue = "0.1";
              if (fieldKey === 'diabetesPedigree') stepValue = "0.001";

              return (
                <div key={key} className="space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                      {details.title}
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                      title="Reveal Clinical Significance"
                      id={`help-btn-${key}`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Context Tooltip Bubble */}
                  <AnimatePresence>
                    {activeTooltip === key && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute z-20 left-0 right-0 bg-slate-800 text-white text-xs rounded-xl p-3.5 shadow-lg border border-slate-700 -top-8 translate-y-[-100%]"
                        id={`tooltip-${key}`}
                      >
                        <p className="leading-relaxed mb-1.5">{details.desc}</p>
                        <div className="flex justify-between items-center text-[10px] text-sky-300 font-semibold border-t border-slate-700 pt-1.5">
                          <span>Standard Target Baseline:</span>
                          <span>{details.normal}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    type="number"
                    step={stepValue}
                    required
                    value={form[fieldKey]}
                    onChange={(e) => setForm({ ...form, [fieldKey]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg p-3 focus:ring-2 focus:ring-blue-500 hover:border-slate-350 transition-all outline-none"
                    id={`input-${key}`}
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-400">Class metric: {details.unit}</span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Normal range: {details.normal}</span>
                  </div>
                </div>
              );
            })}

          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm transition-all cursor-pointer"
              id="reset-form-btn"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Inputs
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm shadow-md transition-all cursor-pointer"
              id="submit-prediction-btn"
            >
              <Activity className="w-4 h-4" />
              Predict Diabetes Risk
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
