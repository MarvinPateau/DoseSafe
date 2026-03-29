import { useState } from 'react';
import { Search } from 'lucide-react';

const NORMS = [
  { name: 'Sodium (Na)', value: '135 - 145', unit: 'mEq/L' },
  { name: 'Potassium (K)', value: '3.5 - 5.0', unit: 'mEq/L' },
  { name: 'Chlorure (Cl)', value: '98 - 106', unit: 'mEq/L' },
  { name: 'Calcium (Ca)', value: '8.5 - 10.5', unit: 'mg/dL' },
  { name: 'Magnésium (Mg)', value: '1.5 - 2.5', unit: 'mEq/L' },
  { name: 'Glycémie', value: '0.70 - 1.10', unit: 'g/L' },
  { name: 'Créatinine', value: '6 - 11', unit: 'mg/L' },
  { name: 'Hémoglobine (F)', value: '12 - 16', unit: 'g/dL' },
  { name: 'Hémoglobine (H)', value: '13 - 18', unit: 'g/dL' },
  { name: 'Leucocytes', value: '4000 - 10000', unit: '/mm³' },
  { name: 'Plaquettes', value: '150 - 400', unit: 'G/L' },
  { name: 'CRP', value: '< 5', unit: 'mg/L' },
];

export default function BioNorms() {
  const [search, setSearch] = useState('');

  const filtered = NORMS.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 pb-10">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400 dark:text-zinc-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une norme..."
          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl py-5 pl-14 pr-5 text-slate-900 dark:text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="space-y-3 mt-6">
        {filtered.map((norm, i) => (
          <div key={i} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <span className="font-medium text-slate-700 dark:text-zinc-200">{norm.name}</span>
            <div className="text-right">
              <span className="font-display font-bold text-xl text-green-600 dark:text-green-400">{norm.value}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500 ml-2">{norm.unit}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-zinc-500 font-medium">Aucun résultat trouvé</div>
        )}
      </div>
    </div>
  );
}
