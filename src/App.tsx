/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import PredictView from './components/PredictView';
import ResultView from './components/ResultView';
import DashboardView from './components/DashboardView';
import AboutView from './components/AboutView';
import DevExportView from './components/DevExportView';
import { PredictionResult } from './types';
import { HeartPulse } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Sync index.html root dark states
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Main panel renderer
  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} />;
      case 'predict':
        return (
          <PredictView 
            setCurrentView={setCurrentView} 
            setLastPrediction={setLastPrediction} 
          />
        );
      case 'result':
        return (
          <ResultView 
            result={lastPrediction} 
            setCurrentView={setCurrentView} 
          />
        );
      case 'dashboard':
        return (
          <DashboardView 
            setCurrentView={setCurrentView} 
            setLastPrediction={setLastPrediction} 
          />
        );
      case 'about':
        return <AboutView />;
      case 'devexport':
        return <DevExportView />;
      default:
        return <HomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`} id="main-app-container">
      
      {/* Navigation Headers */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main Container Wrapper */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderActiveView()}
      </main>

      {/* Footer Details */}
      <footer className="bg-slate-900 text-slate-450 text-center py-6 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 text-xs font-semibold tracking-wide space-y-1">
          <p>&copy; 2026 <strong className="text-white font-bold">HealthGuard AI</strong>. All rights reserved.</p>
          <p className="text-slate-500 font-normal">Designed strictly as an educational screening helper tool using standard mathematical coefficients.</p>
        </div>
      </footer>
    </div>
  );
}

