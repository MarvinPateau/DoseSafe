import React, { useState } from 'react';
import { Droplets, ArrowLeft, Clock, Activity } from 'lucide-react';

export default function IVFlowCalc() {
  const [volume, setVolume] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'h' | 'min'>('h');
  const [dropFactor, setDropFactor] = useState<number>(20);

  const calculateFlow = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    
    if (isNaN(v) || isNaN(t) || v <= 0 || t <= 0) return null;

    const timeInMinutes = timeUnit === 'h' ? t * 60 : t;
    const dropsPerMin = Math.round((v * dropFactor) / timeInMinutes);
    const mlPerHour = Math.round(v / (timeInMinutes / 60));

    return { dropsPerMin, mlPerHour };
  };

  const result = calculateFlow();

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-sky-50 dark:bg-sky-500/10 rounded-2xl text-sky-600 dark:text-sky-400">
          <Droplets size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Débit Perfusion</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Calcul en gouttes/min</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
          <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Volume à perfuser (ml)</label>
          <input
            type="text"
            inputMode="decimal"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="Ex: 500"
            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
          <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Temps de passage</label>
          <div className="flex space-x-3">
            <input
              type="text"
              inputMode="decimal"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ex: 8"
              className="flex-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
            />
            <div className="flex bg-slate-50 dark:bg-black rounded-2xl p-1 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setTimeUnit('h')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${timeUnit === 'h' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
              >
                Heures
              </button>
              <button
                onClick={() => setTimeUnit('min')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${timeUnit === 'min' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
              >
                Min
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
          <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">Type de perfuseur</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Standard', value: 20, desc: '20 gtt/ml' },
              { label: 'Pédiatrique', value: 60, desc: '60 gtt/ml' },
              { label: 'Transfusion', value: 15, desc: '15 gtt/ml' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setDropFactor(type.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  dropFactor === type.value 
                    ? 'bg-sky-50 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500 text-sky-700 dark:text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.05)] dark:shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                    : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="font-bold text-sm mb-1">{type.label}</span>
                <span className="text-xs opacity-70">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-sky-500 rounded-3xl p-8 shadow-[0_0_30px_rgba(14,165,233,0.3)] animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity size={100} />
            </div>
            <h3 className="text-sky-100 font-bold mb-2 uppercase tracking-wider text-sm">Résultat</h3>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-6xl font-display font-bold text-white tracking-tighter">{result.dropsPerMin}</span>
              <span className="text-xl font-medium text-sky-100">gouttes / min</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-black/20 rounded-xl text-sky-50 font-medium backdrop-blur-sm">
              <Clock size={16} className="mr-2 opacity-70" />
              Soit {result.mlPerHour} ml/h (Pompe / PSE)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
