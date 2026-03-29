import React, { useState } from 'react';
import { Activity, Scale } from 'lucide-react';

export default function CreatinineCalc() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [creat, setCreat] = useState<string>('');
  const [sex, setSex] = useState<'M' | 'F'>('M');

  const calculateClearance = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const c = parseFloat(creat);

    if (isNaN(a) || isNaN(w) || isNaN(c) || a <= 0 || w <= 0 || c <= 0) return null;

    // Formule de Cockcroft-Gault avec créatininémie en µmol/L
    // Homme: (140 - age) * poids * 1.23 / creat
    // Femme: (140 - age) * poids * 1.04 / creat
    const factor = sex === 'M' ? 1.23 : 1.04;
    const clearance = ((140 - a) * w * factor) / c;

    return Math.round(clearance);
  };

  const result = calculateClearance();

  const getInterpretation = (cl: number) => {
    if (cl >= 90) return { text: 'Fonction rénale normale', color: 'text-emerald-400' };
    if (cl >= 60) return { text: 'Insuffisance rénale légère', color: 'text-amber-400' };
    if (cl >= 30) return { text: 'Insuffisance rénale modérée', color: 'text-orange-400' };
    if (cl >= 15) return { text: 'Insuffisance rénale sévère', color: 'text-red-400' };
    return { text: 'Insuffisance rénale terminale', color: 'text-red-600' };
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
          <Activity size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Clairance Créat.</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Cockcroft-Gault</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
          <div className="flex bg-slate-50 dark:bg-black rounded-2xl p-1 border border-slate-200 dark:border-white/10 mb-6">
            <button
              onClick={() => setSex('M')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${sex === 'M' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
            >
              Homme
            </button>
            <button
              onClick={() => setSex('F')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${sex === 'F' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
            >
              Femme
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Âge (ans)</label>
              <input
                type="text"
                inputMode="decimal"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 65"
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Poids (kg)</label>
              <input
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 70"
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Créatininémie (µmol/L)</label>
            <input
              type="text"
              inputMode="decimal"
              value={creat}
              onChange={(e) => setCreat(e.target.value)}
              placeholder="Ex: 85"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {result !== null && (
          <div className="bg-emerald-500 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Scale size={100} />
            </div>
            <h3 className="text-emerald-100 font-bold mb-2 uppercase tracking-wider text-sm">Clairance Estimée</h3>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-6xl font-display font-bold text-white tracking-tighter">{result}</span>
              <span className="text-xl font-medium text-emerald-100">ml/min</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-black/20 rounded-xl text-emerald-50 font-bold backdrop-blur-sm">
              {getInterpretation(result).text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
