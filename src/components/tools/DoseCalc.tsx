import { useState } from 'react';

export default function DoseCalc() {
  const [dose, setDose] = useState('');
  const [volume, setVolume] = useState('');
  const [concentration, setConcentration] = useState('');
  const [weight, setWeight] = useState('');
  const [isWeightBased, setIsWeightBased] = useState(false);

  const d = parseFloat(dose) || 0;
  const c_mg = parseFloat(concentration) || 0;
  const c_ml = parseFloat(volume) || 0;
  const w = parseFloat(weight) || 0;

  let mlh = 0;
  
  if (c_mg > 0 && c_ml > 0 && d > 0) {
    const conc_per_ml = c_mg / c_ml;
    if (isWeightBased && w > 0) {
      const totalDose = d * w;
      mlh = totalDose / conc_per_ml;
    } else if (!isWeightBased) {
      mlh = d / conc_per_ml;
    }
  }

  const drops = mlh * 20 / 60; // Standard 20 drops/ml

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <span className="font-medium text-slate-700 dark:text-zinc-200">Calcul par poids (mg/kg/h)</span>
          <input 
            type="checkbox" 
            checked={isWeightBased}
            onChange={(e) => setIsWeightBased(e.target.checked)}
            className="w-6 h-6 rounded text-blue-500 bg-slate-50 dark:bg-black border-slate-300 dark:border-zinc-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
          />
        </div>

        {isWeightBased && (
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Poids du patient (kg)</label>
            <input 
              type="text" 
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-5 text-xl text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm dark:shadow-none"
              placeholder="Ex: 70"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">
            Dose prescrite {isWeightBased ? '(mg/kg/h)' : '(mg/h)'}
          </label>
          <input 
            type="text" 
            inputMode="decimal"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-5 text-xl text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm dark:shadow-none"
            placeholder="Ex: 5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Ampoule (mg)</label>
            <input 
              type="text" 
              inputMode="decimal"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-5 text-xl text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm dark:shadow-none"
              placeholder="Ex: 50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Volume (ml)</label>
            <input 
              type="text" 
              inputMode="decimal"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-5 text-xl text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm dark:shadow-none"
              placeholder="Ex: 50"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-500/10 rounded-3xl p-6 border border-blue-200 dark:border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] dark:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Résultats</h3>
        <div className="space-y-4">
          <div>
            <div className="text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">
              {mlh > 0 ? mlh.toFixed(1) : '0.0'}
              <span className="text-2xl font-medium text-blue-600 dark:text-blue-400 ml-2">ml/h</span>
            </div>
          </div>
          <div className="h-px w-full bg-blue-200 dark:bg-blue-500/20"></div>
          <div>
            <div className="text-5xl font-display font-bold text-green-600 dark:text-green-400 tracking-tighter">
              {drops > 0 ? Math.round(drops) : '0'}
              <span className="text-xl font-medium text-green-600/70 dark:text-green-500/70 ml-2">gttes/min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
