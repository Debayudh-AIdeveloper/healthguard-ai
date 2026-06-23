import React from 'react';
import { PredictionResult } from '../types';
import { 
  Printer, RotateCcw, ShieldCheck, HeartPulse, CheckSquare, Sparkles,
  AlertTriangle, CheckCircle2, ChevronRight, HelpCircle, Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Cell, PieChart, Pie, Legend
} from 'recharts';
import { calculateShapExplanations } from '../utils/mlEngine';

interface ResultProps {
  result: PredictionResult | null;
  setCurrentView: (view: string) => void;
}

export default function ResultView({ result, setCurrentView }: ResultProps) {
  if (!result) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 p-6">
        <HeartPulse className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-slate-500 font-medium">No assessment result found. Please complete the screening form first.</p>
        <button onClick={() => setCurrentView('predict')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold">
          Go To Form
        </button>
      </div>
    );
  }

  const probPercent = (result.probability * 100).toFixed(1);
  
  // Custom color configurations depending on risk levels
  let colorClass = {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900/60",
    stroke: "#22c55e" // green-500
  };

  if (result.riskLevel === 'High') {
    colorClass = {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-200 dark:border-red-900/60",
      stroke: "#ef4444" // red-500
    };
  } else if (result.riskLevel === 'Moderate') {
    colorClass = {
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-orange-200 dark:border-orange-900/60",
      stroke: "#f97316" // orange-500
    };
  }

  // Circular gauge config: Diameter is 160, semi-circle is 180 deg. Arc path length is calculated:
  // Circumference is PI * R. R=80 -> ~251.3 stroke array scale
  const r = 80;
  const circ = Math.PI * r; // 251.3
  const percentage = result.probability; // 0 to 1
  const offset = circ - (percentage * circ);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Absolute Left Sticky Panel Metric Circular Counter */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 text-center space-y-6 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metabolic Hazard</h2>
          
          {/* Probability Indicator Badge */}
          <div className="inline-flex">
            <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${colorClass.bg} ${colorClass.text} border ${colorClass.border}`}>
              {result.riskLevel} Risk Profile
            </span>
          </div>

          {/* Symmetrical Half-circle speedometer gauge with animation effects */}
          <div className="relative w-48 h-28 mx-auto mt-4 overflow-hidden">
            <svg className="w-full h-full transform translate-y-1" viewBox="0 0 200 120">
              {/* Backing arc */}
              <path 
                cx="100" 
                cy="100" 
                className="fill-none stroke-slate-200 dark:stroke-slate-800" 
                strokeWidth="22" 
                strokeLinecap="round"
                d="M20,100 A80,80 0 0,1 180,100" 
              />
              {/* Active animated stroke fill */}
              <motion.path 
                cx="100" 
                cy="100" 
                className="fill-none" 
                strokeWidth="22" 
                strokeLinecap="round"
                stroke={colorClass.stroke}
                d="M20,100 A80,80 0 0,1 180,100" 
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeDasharray={`${circ} ${circ}`}
              />
            </svg>
            <div className="absolute bottom-0 inset-x-0 text-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white block leading-none">
                {probPercent}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inference Probability</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            This metric calculations are configured server-side based on mathematical coefficients of the logistic algorithm trained on Pima Indian clinical markers.
          </p>

          {/* Sidebar printing / triggers */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              id="print-report-btn"
            >
              <Printer className="w-4 h-4" />
              Print Screening Report
            </button>
            <button
              onClick={() => setCurrentView('predict')}
              className="flex items-center justify-center gap-1.5 w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              id="re-screen-btn"
            >
              <RotateCcw className="w-4 h-4" />
              Resubmit Screening
            </button>
          </div>
        </div>

        {/* Right Actionable clinical recommendations and feedback details */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Biomarkers Echo Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Screened Physiological Review
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {[
                { name: "Plasma Glucose", val: `${result.inputs.glucose} mg/dL` },
                { name: "Body Mass (BMI)", val: `${result.inputs.bmi.toFixed(1)}` },
                { name: "Diastolic BP", val: `${result.inputs.bloodPressure} mmHg` },
                { name: "Patient Age", val: `${result.inputs.age} Years` }
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block font-semibold">{m.name}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Recommendation container cards */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Personalized Clinical Recommendations
              </h3>
            </div>

            <ul className="space-y-4">
              {result.recommendations.map((rec, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className={`flex gap-3 text-sm p-4 rounded-xl leading-relaxed text-slate-700 dark:text-slate-300 ${colorClass.bg} border ${colorClass.border}`}
                >
                  <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colorClass.text}`} />
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs leading-relaxed space-y-2">
              <strong className="font-bold flex items-center gap-1 text-sm text-blue-900 dark:text-blue-100">
                <HeartPulse className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Preventive Health Plan Guidelines
              </strong>
              <p>
                Prediabetes and diabetes risks can be mitigated or managed effectively through deliberate behavioral adjustments—principally focusing on cardiovascular activity, core dietary fiber levels, and sodium restrictions. Discuss this structured scorecard during your next routine clinic visit.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* AI Risk Factor Analysis Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8"
        id="ai-risk-factor-analysis-section"
      >
        {/* Section Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explainable AI (XAI)
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                AI Risk Factor Analysis
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Understanding the clinical factors influencing your prediction using math-exact SHAP models
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-sky-300 rounded-xl px-4 py-2 text-xs font-bold border border-blue-100 dark:border-blue-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Linear SHAP formulation
            </div>
          </div>
        </div>

        {/* Outer Split Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Narrative, Ranked List & Insights */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Risk Contributors Badge Area */}
            <div className="bg-slate-50 dark:bg-slate-850/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Top Risk Contributors (SHAP Allocation)
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {calculateShapExplanations(result.inputs).factors.slice(0, 4).map((f) => {
                  let impactBadgeColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50";
                  let dotColor = "bg-emerald-500";
                  let prefix = "🟢";

                  if (f.percentage > 15) {
                    impactBadgeColor = "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50";
                    dotColor = "bg-red-500";
                    prefix = "🔴 High Impact";
                  } else if (f.percentage > 0) {
                    impactBadgeColor = "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50";
                    dotColor = "bg-amber-500";
                    prefix = "🟡 Moderate Impact";
                  } else {
                    prefix = "🟢 Low / Protective Impact";
                  }

                  return (
                    <div 
                      key={f.name}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {f.label}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${impactBadgeColor}`}>
                          {f.percentage > 0 ? `+${f.percentage}%` : `${f.percentage}%`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-50 dark:border-slate-800/80 pt-1.5">
                        <span className="font-semibold">{prefix}</span>
                        <span>Value: {f.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feature Importance Ranked list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Local Feature Contribution Ranking
              </h4>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculateShapExplanations(result.inputs).factors.map((f, idx) => (
                    <div 
                      key={f.name}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {f.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-slate-400 font-mono text-[11px] font-medium">
                          Your metric: {f.value}
                        </span>
                        <span className={`w-14 text-right font-mono text-[11px] ${
                          f.percentage > 15 ? 'text-red-500' : f.percentage > 0 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {f.percentage >= 0 ? `+${f.percentage}%` : `${f.percentage}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical Interpretation Narration */}
            <div className="bg-blue-50/30 dark:bg-blue-950/15 rounded-xl p-5 border border-blue-100/60 dark:border-blue-900/40 space-y-2">
              <h4 className="text-xs font-extrabold text-blue-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" /> Clinical Interpretation Explanation
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "{calculateShapExplanations(result.inputs).clinicalInterpretation}"
              </p>
            </div>

            {/* Personalized Simulation What-If Insights */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Simulated Remediation Insights
              </h4>
              <div className="grid gap-3">
                {calculateShapExplanations(result.inputs).personalizedInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className="bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-900/30 flex items-start gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-350"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Dynamic Charts & Graphics */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Visual Chart Card container */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-6">
              
              {/* Plot 1: SHAP Horizontal Bar */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Horizontal Local SHAP Values
                </span>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={calculateShapExplanations(result.inputs).factors}
                      margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b11" />
                      <XAxis type="number" tick={{ fontSize: 9 }} />
                      <YAxis dataKey="label" type="category" tick={{ fontSize: 9 }} width={120} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white', fontSize: 10 }}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {calculateShapExplanations(result.inputs).factors.map((entry, index) => {
                          const positive = entry.percentage >= 0;
                          return (
                            <Cell key={`cell-${index}`} fill={positive ? '#ef4444' : '#22c55e'} />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plot 2: Absolute Pie Contribution distribution */}
              <div className="space-y-2 border-t border-slate-50 dark:border-slate-800/80 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Relative Contribution Distribution Magnitude
                </span>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculateShapExplanations(result.inputs).factors.map(f => ({ name: f.label, value: Math.abs(f.percentage) }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {calculateShapExplanations(result.inputs).factors.map((entry, index) => {
                          const colors = ['#3b82f6', '#ef4444', '#f97316', '#10b981', '#38bdf8', '#a855f7', '#14b8a6', '#64748b'];
                          return (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          );
                        })}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white', fontSize: 10 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Risk Indicator Cards & Healthy Range Comparison Grid */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider px-1">
            Risk Indicator Cards & Healthy Reference Standards
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {calculateShapExplanations(result.inputs).factors.map((f) => {
              // Map visual style configs
              let color = "border-slate-100 dark:border-slate-800";
              let statusText = "🟢 Normal Range";
              let badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400";
              
              if (f.impact === 'High') {
                color = "border-red-200 dark:border-red-900/40 border-2";
                statusText = `⚠️ ${f.status}`;
                badgeStyle = "bg-red-50 dark:bg-red-950/45 text-red-600 dark:text-red-400";
              } else if (f.impact === 'Moderate') {
                color = "border-amber-200 dark:border-amber-900/40 border-2";
                statusText = `⚠️ ${f.status}`;
                badgeStyle = "bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400";
              }

              return (
                <div 
                  key={f.name}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${color}`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {f.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${badgeStyle}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800/60 pt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Your Value:</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100">{f.value}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Healthy Reference:</span>
                      <span className="font-semibold">{f.healthyRange}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>SHAP Impact:</span>
                      <span className="font-mono text-slate-500 font-semibold">{f.percentage >= 0 ? `+${f.percentage}%` : `${f.percentage}%`}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal pt-1.5 border-t border-dashed border-slate-100 dark:border-slate-800/80">
                    {f.insight}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Healthcare Disclaimer */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-xl p-4 border border-slate-150 dark:border-slate-800/80 text-center text-[11px] text-slate-400 leading-relaxed font-medium">
          ⚠️ <strong>Healthcare Interpretation Disclaimer:</strong> Feature importance estimates and SHAP local mathematical contributions are generated dynamically for explanatory and interpretive educational demonstrations only and should under no circumstances be used as professional medical diagnosis or clinical advice.
        </div>

      </motion.div>
    </motion.div>
  );
}
