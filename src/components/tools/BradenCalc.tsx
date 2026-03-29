import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const BRADEN_ITEMS = [
  {
    id: 'sensory',
    title: 'Perception Sensorielle',
    options: [
      { score: 1, label: 'Totalement limitée', desc: 'Ne réagit pas à la douleur' },
      { score: 2, label: 'Très limitée', desc: 'Réagit à la douleur par gémissement' },
      { score: 3, label: 'Légèrement limitée', desc: 'Répond aux ordres verbaux' },
      { score: 4, label: 'Aucune limitation', desc: 'Répond aux ordres verbaux, pas de déficit' },
    ]
  },
  {
    id: 'moisture',
    title: 'Humidité',
    options: [
      { score: 1, label: 'Constamment humide', desc: 'Peau toujours moite' },
      { score: 2, label: 'Très humide', desc: 'Peau souvent moite' },
      { score: 3, label: 'Parfois humide', desc: 'Peau occasionnellement moite' },
      { score: 4, label: 'Rarement humide', desc: 'Peau généralement sèche' },
    ]
  },
  {
    id: 'activity',
    title: 'Activité',
    options: [
      { score: 1, label: 'Alité', desc: 'Confiné au lit' },
      { score: 2, label: 'Au fauteuil', desc: 'Ne peut pas marcher' },
      { score: 3, label: 'Marche occasionnellement', desc: 'Marche sur de courtes distances' },
      { score: 4, label: 'Marche fréquemment', desc: 'Marche souvent dehors' },
    ]
  },
  {
    id: 'mobility',
    title: 'Mobilité',
    options: [
      { score: 1, label: 'Totalement immobile', desc: 'Ne fait aucun changement de position' },
      { score: 2, label: 'Très limitée', desc: 'Fait de légers changements' },
      { score: 3, label: 'Légèrement limitée', desc: 'Fait des changements fréquents' },
      { score: 4, label: 'Aucune limitation', desc: 'Fait des changements majeurs' },
    ]
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    options: [
      { score: 1, label: 'Très pauvre', desc: 'Ne mange jamais un repas complet' },
      { score: 2, label: 'Probablement inadéquate', desc: 'Mange rarement un repas complet' },
      { score: 3, label: 'Adéquate', desc: 'Mange plus de la moitié des repas' },
      { score: 4, label: 'Excellente', desc: 'Mange la plupart de chaque repas' },
    ]
  },
  {
    id: 'friction',
    title: 'Friction et Cisaillement',
    options: [
      { score: 1, label: 'Problème', desc: 'Requiert une assistance modérée/maximale' },
      { score: 2, label: 'Problème potentiel', desc: 'Bouge faiblement ou requiert aide minimale' },
      { score: 3, label: 'Pas de problème apparent', desc: 'Bouge au lit et sur chaise indépendamment' },
    ]
  }
];

export default function BradenCalc() {
  const [scores, setScores] = useState<Record<string, number>>({});

  const totalScore: number = (Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0);
  const isComplete = Object.keys(scores).length === BRADEN_ITEMS.length;

  const getInterpretation = (score: number) => {
    if (score <= 9) return { text: 'Risque Très Élevé', color: 'text-red-400', bg: 'bg-red-500' };
    if (score <= 12) return { text: 'Risque Élevé', color: 'text-orange-400', bg: 'bg-orange-500' };
    if (score <= 14) return { text: 'Risque Modéré', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (score <= 18) return { text: 'Risque Faible', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    return { text: 'Pas de risque', color: 'text-zinc-400', bg: 'bg-zinc-700' };
  };

  const interpretation = isComplete ? getInterpretation(totalScore) : null;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-600 dark:text-rose-400">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Score de Braden</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Risque d'escarres</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-48">
        {BRADEN_ITEMS.map((item) => (
          <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
            <div className="space-y-2">
              {item.options.map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => setScores({ ...scores, [item.id]: opt.score })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    scores[item.id] === opt.score 
                      ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.05)] dark:shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                      : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="text-left">
                    <div className={`font-bold ${scores[item.id] === opt.score ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-zinc-200'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                  </div>
                  <div className={`text-xl font-display font-bold ${scores[item.id] === opt.score ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-zinc-600'}`}>
                    {opt.score}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isComplete && interpretation && (
        <div className="fixed bottom-36 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className={`w-full max-w-md p-6 ${interpretation.bg} animate-in slide-in-from-bottom-full duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-3xl pointer-events-auto`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Score Total</div>
                <div className="text-white font-medium flex items-center">
                  {totalScore <= 12 && <AlertTriangle size={18} className="mr-2" />}
                  {interpretation.text}
                </div>
              </div>
              <div className="text-5xl font-display font-bold text-white tracking-tighter">
                {totalScore}<span className="text-2xl text-white/60">/23</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
