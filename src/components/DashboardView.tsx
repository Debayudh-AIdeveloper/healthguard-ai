import React, { useState, useEffect } from 'react';
import { getPredictionHistory, clearPredictionHistory } from '../utils/mlEngine';
import { PredictionResult } from '../types';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Database, TrendingUp, Users, Heart, Clipboard, Trash2, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  setCurrentView: (view: string) => void;
  setLastPrediction: (result: any) => void;
}

export default function DashboardView({ setCurrentView, setLastPrediction }: DashboardProps) {
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    setHistory(getPredictionHistory());
  }, []);

  const handleClearHistory = () => {
    clearPredictionHistory();
    setHistory([]);
    setShowConfirmDelete(false);
  };

  const handleSelectHistoryItem = (item: PredictionResult) => {
    setLastPrediction(item);
    setCurrentView('result');
  };

  // Recharts Data 1: Pima Cohort Class Output distribution
  const classData = [
    { name: 'Diabetic Class', value: 268, color: '#f87171' }, // lighter red
    { name: 'Healthy Controls', value: 500, color: '#4ade80' }  // lighter green
  ];

  // Recharts Data 2: Standard logistic regression weights of features
  const importanceData = [
    { name: 'Pregnancies', weight: 1.23, description: "Temporary insulin resistances" },
    { name: 'Glucose', weight: 4.25, description: "Primary diagnosis predictor" },
    { name: 'Diastolic BP', weight: -1.35, description: "Metabolic vascular pressure" },
    { name: 'Skin Fold', weight: 0.12, description: "Body fat reserve proxy" },
    { name: 'Insulin', weight: -0.05, description: "Beta-cell output level" },
    { name: 'BMI Quotient', weight: 3.12, description: "Tissue lipid inflammation" },
    { name: 'Pedigree', weight: 2.45, description: "Mathematical heritage vector" },
    { name: 'Age Index', weight: 1.54, description: "Muscular glucose drop factor" }
  ].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dataset Analytics & Cohort Metrics</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Statistical diagnostics of the clinical cohort and mathematical parameters driving screening evaluations.
        </p>
      </div>

      {/* Dataset Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Cohort Cohort", val: "768 Patients", desc: "Pima Indian sample size", icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/25" },
          { label: "Metabolic Load", val: "34.9% positive", desc: "Mean diabetes frequency", icon: TrendingUp, color: "text-red-500 bg-red-50 dark:bg-red-900/25" },
          { label: "Cohort BMI average", val: "32.0 kg/m²", desc: "Baseline body mass index", icon: Heart, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/25" },
          { label: "Baseline blood sugars", val: "120.9 mg/dL", desc: "Cohort mean plasma sugar", icon: Clipboard, color: "text-sky-500 bg-sky-50 dark:bg-sky-900/25" }
        ].map((box, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center space-y-1">
            <div className={`p-2 rounded-lg w-fit mx-auto ${box.color}`}>
              <box.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">{box.label}</span>
            <div className="text-lg font-extrabold text-slate-800 dark:text-white">{box.val}</div>
            <span className="text-[10px] text-slate-400 block">{box.desc}</span>
          </div>
        ))}
      </div>

      {/* Dashboard Plot Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Plot 1: Target Class Doughnut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-50 dark:border-slate-850 pb-2">
            Pima Indians Diabetes Class Spread
          </h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} 
                  itemStyle={{ color: 'white' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plot 2: ML coefficients weights */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-50 dark:border-slate-850 pb-2">
            Model Feature Weights (Beta Relative Importance)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b11" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: '#e2e8f033' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 'a8px', color: 'white' }}
                />
                <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                  {importanceData.map((entry, index) => {
                    const positive = entry.weight >= 0;
                    return (
                      <Cell key={`cell-${index}`} fill={positive ? '#3b82f6' : '#f87171'} />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Prediction History Scopes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Database className="w-5 h-5 text-blue-500" />
            Your Local Screening History ({history.length} Profiles)
          </h3>
          {history.length > 0 && (
            <div className="flex items-center gap-2">
              {showConfirmDelete ? (
                <>
                  <span className="text-[11px] text-red-500 font-bold">Delete history?</span>
                  <button
                    onClick={handleClearHistory}
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer transition-colors"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center gap-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/60 font-semibold transition-colors cursor-pointer"
                  id="clear-history-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Dataset
                </button>
              )}
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10">
            <Clipboard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-semibold">No prediction history recorded on this machine yet.</p>
            <button 
              onClick={() => setCurrentView('predict')} 
              className="text-xs text-blue-500 hover:underline font-bold mt-2"
              id="dash-assessment-btn"
            >
              Screen your values now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Screening Date</th>
                  <th className="py-3 px-4">Biomarkers (Glucose | BMI | Age)</th>
                  <th className="py-3 px-4">Risk Probability</th>
                  <th className="py-3 px-4 text-right">Outcome Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-705 dark:text-slate-350">
                {history.map((item) => {
                  let badge = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50";
                  if (item.riskLevel === 'High') {
                    badge = "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50";
                  } else if (item.riskLevel === 'Moderate') {
                    badge = "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50";
                  }

                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => handleSelectHistoryItem(item)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-medium">
                        {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500 dark:text-slate-400">
                        {item.inputs.glucose} mg/dL | {item.inputs.bmi.toFixed(1)} | {item.inputs.age} yrs
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">
                        {(item.probability * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="flex items-center justify-end gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${badge}`}>
                            {item.riskLevel}
                          </span>
                          <ArrowUpRight className="w-4.5 h-4.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </motion.div>
  );
}
