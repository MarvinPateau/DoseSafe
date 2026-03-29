import { useState } from 'react';
import { RotateCcw, Info, Droplets } from 'lucide-react';

const BURN_REGIONS = [
  {
    title: "Tête & Cou",
    parts: [
      { id: 'head', label: 'Tête', front: 3.5, back: 3.5 },
      { id: 'neck', label: 'Cou', front: 1, back: 1 },
    ]
  },
  {
    title: "Tronc",
    parts: [
      { id: 'trunk', label: 'Tronc', front: 13, back: 13 },
      { id: 'buttock_r', label: 'Fesse Droite', front: 0, back: 2.5 },
      { id: 'buttock_l', label: 'Fesse Gauche', front: 0, back: 2.5 },
      { id: 'genitals', label: 'Génitaux', front: 1, back: 0 },
    ]
  },
  {
    title: "Membre Supérieur Droit",
    parts: [
      { id: 'arm_r', label: 'Bras (Haut)', front: 2, back: 2 },
      { id: 'forearm_r', label: 'Avant-bras', front: 1.5, back: 1.5 },
      { id: 'hand_r', label: 'Main', front: 1.25, back: 1.25 },
    ]
  },
  {
    title: "Membre Supérieur Gauche",
    parts: [
      { id: 'arm_l', label: 'Bras (Haut)', front: 2, back: 2 },
      { id: 'forearm_l', label: 'Avant-bras', front: 1.5, back: 1.5 },
      { id: 'hand_l', label: 'Main', front: 1.25, back: 1.25 },
    ]
  },
  {
    title: "Membre Inférieur Droit",
    parts: [
      { id: 'thigh_r', label: 'Cuisse', front: 4.75, back: 4.75 },
      { id: 'leg_r', label: 'Jambe (Bas)', front: 3.5, back: 3.5 },
      { id: 'foot_r', label: 'Pied', front: 1.75, back: 1.75 },
    ]
  },
  {
    title: "Membre Inférieur Gauche",
    parts: [
      { id: 'thigh_l', label: 'Cuisse', front: 4.75, back: 4.75 },
      { id: 'leg_l', label: 'Jambe (Bas)', front: 3.5, back: 3.5 },
      { id: 'foot_l', label: 'Pied', front: 1.75, back: 1.75 },
    ]
  }
];

export default function BurnCalc() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [weight, setWeight] = useState<string>('');

  const togglePart = (id: string, side: 'front' | 'back') => {
    const key = `${id}_${side}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const total = BURN_REGIONS.reduce((sum, region) => {
    return sum + region.parts.reduce((partSum, part) => {
      let s = 0;
      if (part.front > 0 && selected[`${part.id}_front`]) s += part.front;
      if (part.back > 0 && selected[`${part.id}_back`]) s += part.back;
      return partSum + s;
    }, 0);
  }, 0);

  const calculateParkland = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || total <= 0) return null;
    
    // Formule de Parkland: 4ml * Poids(kg) * Surface Brûlée(%)
    const totalVolume = 4 * w * total;
    const first8h = totalVolume / 2;
    const next16h = totalVolume / 2;

    return {
      total: Math.round(totalVolume),
      first8h: Math.round(first8h),
      next16h: Math.round(next16h)
    };
  };

  const parkland = calculateParkland();

  return (
    <div className="space-y-6 pb-10">
      
      {/* Sticky Total Header */}
      <div className="sticky top-0 z-10 bg-slate-50/80 dark:bg-black/80 backdrop-blur-xl pt-2 pb-4 border-b border-slate-200 dark:border-white/5 -mx-4 px-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-500/10 rounded-3xl p-6 border border-orange-200 dark:border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)] dark:shadow-[0_0_30px_rgba(249,115,22,0.1)] flex justify-between items-center">
          <div>
            <h3 className="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Surface Totale (SCB)</h3>
            <div className="text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">
              {total.toFixed(2).replace('.00', '')}<span className="text-2xl font-medium text-orange-600 dark:text-orange-400 ml-1">%</span>
            </div>
          </div>
          <button 
            onClick={() => { setSelected({}); setWeight(''); }}
            className="h-14 w-14 bg-orange-100 hover:bg-orange-200 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center active:scale-95 transition-all"
            aria-label="Réinitialiser"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-start space-x-3 mb-6">
        <Info className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
          Basé sur la table de <strong>Lund et Browder (Adulte)</strong>. <br/>
          <em>Astuce : La paume du patient (doigts inclus) représente ~1% de sa surface corporelle pour les petites brûlures éparses.</em>
        </p>
      </div>

      {/* Parkland Formula Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Droplets className="text-sky-600 dark:text-sky-400" size={24} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remplissage (Parkland)</h3>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Poids du patient (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 70"
            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-700"
          />
        </div>

        {parkland && (
          <div className="bg-sky-50 dark:bg-sky-500/10 rounded-2xl p-4 border border-sky-200 dark:border-sky-500/20 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-4">
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Volume Total (24h)</div>
              <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{parkland.total} ml</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-200 dark:bg-black/40 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 dark:text-zinc-400 mb-1">8 premières heures</div>
                <div className="text-lg font-bold text-sky-700 dark:text-sky-300">{parkland.first8h} ml</div>
              </div>
              <div className="bg-slate-200 dark:bg-black/40 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 dark:text-zinc-400 mb-1">16 heures suivantes</div>
                <div className="text-lg font-bold text-sky-700 dark:text-sky-300">{parkland.next16h} ml</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {BURN_REGIONS.map((region, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-sm font-display font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5 pb-2">
              {region.title}
            </h4>
            <div className="space-y-2">
              {region.parts.map(part => (
                <div key={part.id} className="grid grid-cols-3 gap-2 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-slate-200 dark:border-white/5">
                  <div className="text-sm font-medium text-slate-700 dark:text-zinc-200 pl-3">
                    {part.label}
                  </div>
                  
                  {/* Front Button */}
                  {part.front > 0 ? (
                    <button
                      onClick={() => togglePart(part.id, 'front')}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                        selected[`${part.id}_front`]
                          ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                          : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 active:bg-slate-100 dark:active:bg-zinc-800'
                      }`}
                    >
                      Face ({part.front}%)
                    </button>
                  ) : <div />}

                  {/* Back Button */}
                  {part.back > 0 ? (
                    <button
                      onClick={() => togglePart(part.id, 'back')}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                        selected[`${part.id}_back`]
                          ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                          : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 active:bg-slate-100 dark:active:bg-zinc-800'
                      }`}
                    >
                      Dos ({part.back}%)
                    </button>
                  ) : <div />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
