import React from 'react';
import { Shield, Sun, Moon, Database, FileText, Activity } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ currentView, setCurrentView, darkMode, setDarkMode }: NavbarProps) {
  const links = [
    { id: 'home', label: 'Home', icon: Sun },
    { id: 'predict', label: 'Screening Form', icon: Activity },
    { id: 'dashboard', label: 'Clinical Insights', icon: Database },
    { id: 'about', label: 'About Model', icon: FileText },
    { id: 'devexport', label: 'Python Source Code', icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-brand"
          >
            <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5 text-sky-300" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
              HealthGuard AI
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const active = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    active 
                      ? 'text-sky-400 bg-slate-800/60 border-b-2 border-sky-400 rounded-b-none' 
                      : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/40'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full overflow-hidden hover:bg-slate-800 transition-all text-slate-300 hover:text-yellow-400"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation Toggle (Simple responsive action) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full hover:bg-slate-800 transition-colors text-slate-300"
              id="theme-toggle-mobile"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 p-1.5"
              id="mobile-nav-select"
            >
              {links.map((link) => (
                <option key={link.id} value={link.id}>
                  {link.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </nav>
  );
}
