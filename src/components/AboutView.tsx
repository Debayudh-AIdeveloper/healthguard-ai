import React from 'react';
import { FileText, Cpu, GitBranch, Shield, HeartPulse, Sparkles, Code } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutView() {
  const steps = [
    { title: "Standard Dataset", desc: "Verifies and loads the local dataset with 768 patient entries from the Pima Indians diabetes study." },
    { title: "Biological Imputation", desc: "Handles invalid zero entries inside biomarker arrays (Glucose, BMI, Blood Pressure, Insulin, Skin thickness) replacing them with median scores." },
    { title: "Standard Scaling", desc: "Standardizes feature distributions (Mean of zero, unit variance) to avoid coefficient convergence failures in mathematical solvers." },
    { title: "Stratified 80/20 Splitting", desc: "Drives stratified split distributions mapping training and testing validation sets accurately." },
    { title: "Double-Classifier Audit", desc: "Fits both Logistic Regression and Random Forest Classifiers in parallel, measuring predictive F1 boundaries, precision, and recalls." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 max-w-4xl mx-auto"
    >
      
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">System Pipeline & Model Specifications</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Theoretical guidelines, mathematical models, and deployment technologies utilized across standard training environments.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
          <HeartPulse className="w-5 h-5 text-blue-500" />
          <h2>Clinical Modeling Objectives</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
          The <strong>HealthGuard AI</strong> platform addresses early-stage diabetes detection as a binary classification hazard problem. Built as a high-fidelity coding showcase for internships and technical portfolio evaluations, it balances clinical statistics transparency with highly readable, modular code.
        </p>
      </div>

      {/* Flow Diagram Workflow */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5 px-1">
          <GitBranch className="w-5 h-5 text-blue-500" />
          Machine Learning Pipeline
        </h3>
        
        <div className="grid sm:grid-cols-5 gap-3 relative">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-blue-600/15 dark:text-blue-400/10 block mb-2">0{idx+1}</span>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-white mb-2">{s.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Performance Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-850 pb-3">
          <Cpu className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Validation Accuracy Comparison Metrics</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Logistic Regression Validation Accuracy</span>
              <span>78.3%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78.3%' }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Random Forest Classifier Accuracy</span>
              <span>80.5% (Saved Best Model Payload)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '80.5%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white block">80.5%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Classification Accuracy</span>
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white block">78.1%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Classifier Precision</span>
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white block">75.8%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Inference Recall</span>
          </div>
        </div>
      </div>

      {/* Standard Disclaimers Card */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-150 p-6 md:p-8 shadow-sm flex gap-4 text-red-800 dark:text-red-200">
        <Shield className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div className="space-y-1 text-xs">
          <strong className="text-sm font-bold text-red-900 dark:text-red-100 block">Required Health Screening Notice</strong>
          <p className="leading-relaxed">
            The mathematical representations inside this application map statistical metrics. This calculation is for educational study validation purposes and cannot substitute for actual clinical examinations, laboratory diagnostic checks (such as HbA1c curves), or physical evaluations by certified medical practitioners. Do not evaluate treatment regimes or base clinical therapy strictly around this calculator scorecard.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
