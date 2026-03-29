import React, { useState } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';

const GCS_EYES = [
  { score: 4, label: 'Spontanée', desc: 'Ouverture des yeux normale' },
  { score: 3, label: 'À la voix', desc: 'Ouverture à la demande' },
  { score: 2, label: 'À la douleur', desc: 'Ouverture à la stimulation' },
  { score: 1, label: 'Aucune', desc: 'Pas d\'ouverture des yeux' },
];

const GCS_VERBAL = [
  { score: 5, label: 'Orientée', desc: 'Réponse normale' },
  { score: 4, label: 'Confuse', desc: 'Désorienté mais parle' },
  { score: 3, label: 'Inappropriée', desc: 'Mots sans lien' },
  { score: 2, label: 'Incompréhensible', desc: 'Gémissements' },
  { score: 1, label: 'Aucune', desc: 'Pas de réponse verbale' },
];

const GCS_MOTOR = [
  { score: 6, label: 'Obéit', desc: 'Aux ordres simples' },
  { score: 5, label: 'Orientée', desc: 'Localise la douleur' },
  { score: 4, label: 'Évitement', desc: 'Retrait à la douleur' },
  { score: 3, label: 'Décortication', desc: 'Flexion anormale' },
  { score: 2, label: 'Décérébration', desc: 'Extension anormale' },
  { score: 1, label: 'Aucune', desc: 'Pas de réponse motrice' },
];

export default function GlasgowCalc() {
  const [eyes, setEyes] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [motor, setMotor] = useState<number | null>(null);

  const totalScore = (eyes || 0) + (verbal || 0) + (motor || 0);
  const isComplete = eyes !== null && verbal !== null && motor !== null;

  const getInterpretation = (score: number) => {
    if (score === 15) return { text: 'Conscience normale', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (score >= 13) return { text: 'Traumatisme crânien léger', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (score >= 9) return { text: 'Traumatisme crânien modéré', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { text: 'Coma sévère (Intubation requise)', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const interpretation = isComplete ? getInterpretation(totalScore) : null;

  const renderSection = (title: string, options: any[], state: number | null, setState: (val: number) => void) => (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl mb-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.score}
            onClick={() => setState(opt.score)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
              state === opt.score 
                ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)] dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <div className="text-left">
              <div className={`font-bold ${state === opt.score ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-zinc-200'}`}>
                {opt.label}
              </div>
              <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
            </div>
            <div className={`text-xl font-display font-bold ${state === opt.score ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-600'}`}>
              {opt.score}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400">
          <Brain size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Score de Glasgow</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Évaluation neurologique</p>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pb-48">
        {renderSection('Ouverture des Yeux (Y)', GCS_EYES, eyes, setEyes)}
        {renderSection('Réponse Verbale (V)', GCS_VERBAL, verbal, setVerbal)}
        {renderSection('Meilleure Réponse Motrice (M)', GCS_MOTOR, motor, setMotor)}
      </div>

      {isComplete && interpretation && (
        <div className="fixed bottom-36 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className={`w-full max-w-md p-6 ${interpretation.bg} animate-in slide-in-from-bottom-full duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-3xl pointer-events-auto`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Score Total</div>
                <div className="text-white font-medium flex items-center">
                  {totalScore <= 8 && <AlertTriangle size={18} className="mr-2" />}
                  {interpretation.text}
                </div>
              </div>
              <div className="text-5xl font-display font-bold text-white tracking-tighter">
                {totalScore}<span className="text-2xl text-white/60">/15</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
