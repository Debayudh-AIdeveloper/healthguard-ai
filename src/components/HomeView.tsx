import React from 'react';
import { Shield, Activity, Database, CheckCircle, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  setCurrentView: (view: string) => void;
}

export default function HomeView({ setCurrentView }: HomeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Medical Disclaimer Alert */}
      <motion.div variants={itemVariants} className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-4 flex gap-3 text-red-800 dark:text-red-200">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
        <p className="text-sm font-medium leading-relaxed">
          <strong className="text-red-900 dark:text-red-100 font-bold">Medical Disclaimer:</strong> This application is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a credentialed physician for actual diagnostics.
        </p>
      </motion.div>

      {/* Hero Hub */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
        <motion.div variants={itemVariants} className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            <Activity className="w-3.5 h-3.5" />
            Adaptive Analytical Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            AI-Driven <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Diabetes Risk</span> Screening App.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-xl">
            Assess clinical diabetes indices within seconds. HealthGuard AI deploys machine learning models trained on the standard Pima Indians Diabetes dataset to compute instant physical hazard scores.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setCurrentView('predict')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-blue-500/25 dark:shadow-none hover:-translate-y-0.5 transition-all"
              id="start-assessment-btn"
            >
              Start Diagnostic Screening
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all"
              id="view-dataset-btn"
            >
              Explore Insights Dataset
              <Database className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Vector SVG Medical Art */}
        <motion.div variants={itemVariants} className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-3xl"></div>
            <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-xl relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="300" height="300" rx="40" fill="#2563eb" fillOpacity="0.03" />
              <circle cx="200" cy="200" r="120" fill="#3b82f6" fillOpacity="0.07" />
              <circle cx="200" cy="200" r="90" fill="#3b82f6" fillOpacity="0.1" />
              
              {/* Shield container block */}
              <rect x="140" y="100" width="120" height="150" rx="60" fill="#1e40af" stroke="#3b82f6" strokeWidth="4" />
              
              {/* Cross symbol */}
              <rect x="190" y="145" width="20" height="60" rx="3" fill="#38bdf8" />
              <rect x="170" y="165" width="60" height="20" rx="3" fill="#38bdf8" />
              
              {/* Connection pulses */}
              <circle cx="100" cy="180" r="10" fill="#0284c7" />
              <line x1="110" y1="180" x2="140" y2="180" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="300" cy="220" r="14" fill="#0284c7" />
              <line x1="260" y1="220" x2="286" y2="220" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 3" />
              
              {/* Cardiogram tracing */}
              <path d="M70 280 H140 L155 240 L170 320 L185 270 L195 290 H330" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Core workflow values */}
      <div className="space-y-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          How Predictive Health Safeguards Your Future
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Verified Clinical Datasets",
              desc: "Engineered around the National Institute of Diabetes and Digestive and Kidney Diseases Pima Indian metrics, supporting absolute parametric alignment.",
              color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30"
            },
            {
              icon: Activity,
              title: "Double-Classifier Verification",
              desc: "Employs two distinct ML models: Logistic Regression for linear coefficient weights, and Random Forest for advanced decision boundary estimation.",
              color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
            },
            {
              icon: CheckCircle,
              title: "High Actionability",
              desc: "Receive customized dietary prescriptions, metabolic exercise guides, and clinical referral reminders tailored to your exact biomarkers.",
              color: "text-sky-500 bg-sky-50 dark:bg-sky-900/30"
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`p-3 rounded-lg w-fit mb-4 ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
