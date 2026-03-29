/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Droplets, Settings as SettingsIcon, StickyNote, Calendar } from 'lucide-react';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { haptics } from './utils/haptics';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import Perfusions from './components/Perfusions';
import Settings from './components/Settings';
import Notes from './components/Notes';
import Planning from './components/Planning';
import PerfusionAlerts from './components/PerfusionAlerts';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [homeKey, setHomeKey] = useState(0);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('dosesafe_theme', 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleHomeClick = () => {
    if (activeTab === 'home') {
      setHomeKey(prev => prev + 1);
    } else {
      setActiveTab('home');
    }
    haptics.light();
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    haptics.light();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-50 font-sans overflow-hidden transition-colors duration-300">
      <Toaster theme={theme} position="top-center" />
      <Analytics />
      <PerfusionAlerts />
      {/* Header */}
      <header className="pt-safe pb-2 px-6 bg-slate-50 dark:bg-black flex-shrink-0 z-10 pt-12 flex items-center justify-between transition-colors duration-300">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">
          Dose<span className="text-blue-500">Safe</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-4 flex flex-col">
        {activeTab === 'home' && <Dashboard key={homeKey} />}
        {activeTab === 'planning' && <Planning />}
        {activeTab === 'perfusions' && <Perfusions />}
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe z-50 pointer-events-none">
        <div className="px-4 pb-6 pt-8 bg-gradient-to-t from-slate-50 via-slate-50/80 dark:from-black dark:via-black/80 to-transparent">
          <nav className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-2 py-2 flex justify-between items-center shadow-2xl shadow-blue-500/10 transition-colors duration-300">
            <NavItem 
              icon={<Home size={22} />} 
              label="Accueil" 
              isActive={activeTab === 'home'} 
              onClick={handleHomeClick} 
            />
            <NavItem 
              icon={<Calendar size={22} />} 
              label="Planning" 
              isActive={activeTab === 'planning'} 
              onClick={() => handleTabClick('planning')} 
            />
            <NavItem 
              icon={<Droplets size={22} />} 
              label="Perfs" 
              isActive={activeTab === 'perfusions'} 
              onClick={() => handleTabClick('perfusions')} 
            />
            <NavItem 
              icon={<StickyNote size={22} />} 
              label="Notes" 
              isActive={activeTab === 'notes'} 
              onClick={() => handleTabClick('notes')} 
            />
            <NavItem 
              icon={<SettingsIcon size={22} />} 
              label="Réglages" 
              isActive={activeTab === 'settings'} 
              onClick={() => handleTabClick('settings')} 
            />
          </nav>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}
    >
      {isActive && <div className="absolute inset-0 bg-blue-50 dark:bg-white/10 rounded-full" />}
      <div className={`relative z-10 transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
        {icon}
      </div>
      {isActive && <span className="absolute bottom-1.5 text-[9px] font-medium tracking-wide z-10">{label}</span>}
    </button>
  );
}
