import React, { useState } from 'react';
import { Calculator, Flame, Activity, ArrowLeft, Droplets, Brain, Scale, User, ShieldAlert } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DoseCalc from './tools/DoseCalc';
import BurnCalc from './tools/BurnCalc';
import BioNorms from './tools/BioNorms';
import IVFlowCalc from './tools/IVFlowCalc';
import GlasgowCalc from './tools/GlasgowCalc';
import CreatinineCalc from './tools/CreatinineCalc';
import IMCCalc from './tools/IMCCalc';
import BradenCalc from './tools/BradenCalc';

type UnitCategory = 'Général' | 'Urgences / Réa' | 'Grands Brûlés' | 'Gériatrie';

const UNITS: UnitCategory[] = ['Général', 'Urgences / Réa', 'Grands Brûlés', 'Gériatrie'];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useLocalStorage<UnitCategory>('dosesafe_selected_unit', 'Général');

  if (activeTool === 'dose') return <ToolWrapper onBack={() => setActiveTool(null)}><DoseCalc /></ToolWrapper>;
  if (activeTool === 'burn') return <ToolWrapper onBack={() => setActiveTool(null)}><BurnCalc /></ToolWrapper>;
  if (activeTool === 'bio') return <ToolWrapper onBack={() => setActiveTool(null)}><BioNorms /></ToolWrapper>;
  if (activeTool === 'ivflow') return <ToolWrapper onBack={() => setActiveTool(null)}><IVFlowCalc /></ToolWrapper>;
  if (activeTool === 'glasgow') return <ToolWrapper onBack={() => setActiveTool(null)}><GlasgowCalc /></ToolWrapper>;
  if (activeTool === 'creat') return <ToolWrapper onBack={() => setActiveTool(null)}><CreatinineCalc /></ToolWrapper>;
  if (activeTool === 'imc') return <ToolWrapper onBack={() => setActiveTool(null)}><IMCCalc /></ToolWrapper>;
  if (activeTool === 'braden') return <ToolWrapper onBack={() => setActiveTool(null)}><BradenCalc /></ToolWrapper>;

  const renderTools = () => {
    switch (selectedUnit) {
      case 'Général':
        return (
          <>
            <ToolCard icon={<Droplets size={32} className="text-sky-500" />} title="Débit Perf" subtitle="Gouttes/min" onClick={() => setActiveTool('ivflow')} color="sky" />
            <ToolCard icon={<Calculator size={32} className="text-blue-500" />} title="Calcul Dose" subtitle="mg/ml & PSE" onClick={() => setActiveTool('dose')} color="blue" />
            <ToolCard icon={<User size={32} className="text-purple-500" />} title="IMC & BSA" subtitle="Corpulence" onClick={() => setActiveTool('imc')} color="purple" />
            <ToolCard icon={<Activity size={32} className="text-green-500" />} title="Biologie" subtitle="Normes usuelles" onClick={() => setActiveTool('bio')} color="green" />
          </>
        );
      case 'Urgences / Réa':
        return (
          <>
            <ToolCard icon={<Brain size={32} className="text-indigo-500" />} title="Glasgow" subtitle="Score neuro" onClick={() => setActiveTool('glasgow')} color="indigo" />
            <ToolCard icon={<Scale size={32} className="text-emerald-500" />} title="Clairance" subtitle="Cockcroft-Gault" onClick={() => setActiveTool('creat')} color="emerald" />
            <ToolCard icon={<Droplets size={32} className="text-sky-500" />} title="Débit Perf" subtitle="Gouttes/min" onClick={() => setActiveTool('ivflow')} color="sky" />
            <ToolCard icon={<Calculator size={32} className="text-blue-500" />} title="Calcul Dose" subtitle="mg/ml & PSE" onClick={() => setActiveTool('dose')} color="blue" />
          </>
        );
      case 'Grands Brûlés':
        return (
          <>
            <ToolCard icon={<Flame size={32} className="text-orange-500" />} title="Brûlures" subtitle="Surface & Parkland" onClick={() => setActiveTool('burn')} color="orange" className="col-span-2" />
            <ToolCard icon={<Droplets size={32} className="text-sky-500" />} title="Débit Perf" subtitle="Gouttes/min" onClick={() => setActiveTool('ivflow')} color="sky" />
            <ToolCard icon={<User size={32} className="text-purple-500" />} title="IMC & BSA" subtitle="Corpulence" onClick={() => setActiveTool('imc')} color="purple" />
          </>
        );
      case 'Gériatrie':
        return (
          <>
            <ToolCard icon={<ShieldAlert size={32} className="text-rose-500" />} title="Braden" subtitle="Risque escarres" onClick={() => setActiveTool('braden')} color="rose" className="col-span-2" />
            <ToolCard icon={<Scale size={32} className="text-emerald-500" />} title="Clairance" subtitle="Cockcroft-Gault" onClick={() => setActiveTool('creat')} color="emerald" />
            <ToolCard icon={<User size={32} className="text-purple-500" />} title="IMC & BSA" subtitle="Corpulence" onClick={() => setActiveTool('imc')} color="purple" />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="-mx-4 overflow-x-auto overflow-y-hidden scrollbar-hide shrink-0">
        <div className="flex space-x-2 w-max px-4 py-5">
          {UNITS.map((unit) => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                selectedUnit === unit 
                  ? 'bg-slate-900 text-white shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:bg-white dark:text-black dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pb-24">
        {renderTools()}
      </div>
    </div>
  );
}

function ToolCard({ icon, title, subtitle, onClick, className = '', color }: { icon: React.ReactNode, title: string, subtitle: string, onClick: () => void, className?: string, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 p-6 rounded-3xl text-left active:scale-[0.98] transition-all group ${className}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className={`inline-flex p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 dark:text-${color}-400 mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400">{subtitle}</p>
    </button>
  );
}

function ToolWrapper({ onBack, children }: { onBack: () => void, children: React.ReactNode }) {
  return (
    <div className="animate-in slide-in-from-right-4 fade-in duration-200 h-full flex flex-col">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white mb-4 font-bold active:scale-95 transition-all w-fit"
      >
        <div className="p-2 bg-white dark:bg-zinc-900 rounded-full mr-3 border border-slate-200 dark:border-white/10">
          <ArrowLeft size={20} />
        </div>
        Retour
      </button>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
