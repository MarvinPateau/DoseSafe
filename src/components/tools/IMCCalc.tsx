import React, { useState } from 'react';
import { User, Activity } from 'lucide-react';

export default function IMCCalc() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const calculateIMC = () => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);

    if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0) return null;

    const hM = hCm / 100;
    const imc = w / (hM * hM);
    
    // Formule de Boyd pour la surface corporelle (BSA)
    const bsa = 0.0003207 * Math.pow(w * 1000, 0.7285 - (0.0188 * Math.log10(w * 1000))) * Math.pow(hCm, 0.3);

    return { 
      imc: imc.toFixed(1), 
      bsa: bsa.toFixed(2) 
    };
  };

  const result = calculateIMC();

  const getInterpretation = (imc: number) => {
    if (imc < 18.5) return { text: 'Insuffisance pondérale', color: 'text-amber-400' };
    if (imc < 25) return { text: 'Corpulence normale', color: 'text-emerald-400' };
    if (imc < 30) return { text: 'Surpoids', color: 'text-orange-400' };
    if (imc < 35) return { text: 'Obésité modérée', color: 'text-red-400' };
    if (imc < 40) return { text: 'Obésité sévère', color: 'text-red-500' };
    return { text: 'Obésité morbide', color: 'text-red-600' };
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">IMC & Surface</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Corpulence et BSA</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Poids (kg)</label>
              <input
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 70"
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-4 text-slate-900 dark:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Taille (cm)</label>
              <input
                type="text"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 175"
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-4 text-slate-900 dark:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700 shadow-sm dark:shadow-none"
              />
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-purple-500 rounded-3xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Activity size={100} />
              </div>
              <h3 className="text-purple-100 font-bold mb-2 uppercase tracking-wider text-sm">Indice de Masse Corporelle</h3>
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-6xl font-display font-bold text-white tracking-tighter">{result.imc}</span>
                <span className="text-xl font-medium text-purple-100">kg/m²</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-black/20 rounded-xl text-purple-50 font-bold backdrop-blur-sm">
                {getInterpretation(parseFloat(result.imc)).text}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 flex justify-between items-center shadow-sm dark:shadow-none">
              <div>
                <div className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Surface Corporelle (BSA)</div>
                <div className="text-xs text-slate-400 dark:text-zinc-500">Formule de Boyd</div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-display font-bold text-slate-900 dark:text-white">{result.bsa}</span>
                <span className="text-slate-500 dark:text-zinc-400 font-medium">m²</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
