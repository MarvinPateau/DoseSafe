import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle, Trash2, Droplets } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { haptics } from '../utils/haptics';

interface Perfusion {
  id: string;
  room: string;
  treatment: string;
  volume: number;
  rate: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export default function Perfusions() {
  const [perfusions, setPerfusions] = useLocalStorage<Perfusion[]>('dosesafe_perfusions', []);
  const [alertTiming] = useLocalStorage<number>('dosesafe_alert_timing', 15);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [room, setRoom] = useState('');
  const [treatment, setTreatment] = useState('');
  const [volume, setVolume] = useState('');
  const [rate, setRate] = useState('');
  
  // Current time for highlighting
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !treatment || !volume || !rate) return;

    const v = parseFloat(volume);
    const r = parseFloat(rate);
    if (v <= 0 || r <= 0) return;

    const durationHours = v / r;
    const start = new Date();
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    const newPerf: Perfusion = {
      id: Date.now().toString(),
      room,
      treatment,
      volume: v,
      rate: r,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    };

    setPerfusions([...perfusions, newPerf]);
    setShowForm(false);
    setRoom('');
    setTreatment('');
    setVolume('');
    setRate('');
    haptics.success();
  };

  const removePerf = (id: string) => {
    setPerfusions(perfusions.filter(p => p.id !== id));
    haptics.light();
  };

  // Sort by end time
  const sortedPerfusions = [...perfusions].sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Suivi Perfusions</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            haptics.light();
          }}
          className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 transition-all"
        >
          <Plus size={24} className={showForm ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-5 animate-in slide-in-from-top-4 fade-in shadow-sm dark:shadow-none">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Chambre</label>
              <input 
                type="text" 
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: 102"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Traitement</label>
              <input 
                type="text" 
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Paracétamol"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Volume (ml)</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: 100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2 ml-1">Débit (ml/h)</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: 200"
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl mt-4 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            Démarrer la perfusion
          </button>
        </form>
      )}

      <div className="space-y-4">
        {sortedPerfusions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-zinc-500 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-zinc-900/30">
            <Droplets size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Aucune perfusion en cours</p>
          </div>
        ) : (
          sortedPerfusions.map(perf => {
            const start = new Date(perf.startTime);
            const end = new Date(perf.endTime);
            const timeDiff = end.getTime() - now.getTime();
            const minutesLeft = Math.floor(timeDiff / 60000);
            
            // Calculate progress percentage
            const totalDuration = end.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();
            const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
            
            let statusClass = "border-slate-200 bg-white dark:border-white/5 dark:bg-zinc-900 shadow-sm dark:shadow-none";
            let timeColor = "text-slate-600 dark:text-zinc-300";
            let progressColor = "bg-blue-500";
            let isUrgent = false;

            if (minutesLeft <= 0) {
              statusClass = "border-red-500/50 bg-red-50 dark:bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
              timeColor = "text-red-500 dark:text-red-400 font-bold";
              progressColor = "bg-red-500";
              isUrgent = true;
            } else if (minutesLeft <= alertTiming) {
              statusClass = "border-orange-500/50 bg-orange-50 dark:bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
              timeColor = "text-orange-500 dark:text-orange-400 font-bold";
              progressColor = "bg-orange-500";
              isUrgent = true;
            }

            return (
              <div key={perf.id} className={`p-5 rounded-3xl border ${statusClass} flex flex-col transition-all relative overflow-hidden pb-7`}>
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-200 dark:bg-black/40">
                  {/* Progress Bar Fill */}
                  <div 
                    className={`h-full ${progressColor} transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                        CH {perf.room}
                      </span>
                      <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">{perf.treatment}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center">
                      <span>{perf.volume}ml à {perf.rate}ml/h</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end pl-5 border-l border-slate-200 dark:border-white/10">
                    <div className="flex items-center text-xs font-medium text-slate-400 dark:text-zinc-500 mb-1">
                      <Clock size={12} className="mr-1.5" />
                      Fin prévue
                    </div>
                    <div className={`text-2xl font-display font-bold tracking-tighter ${timeColor}`}>
                      {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {isUrgent && (
                      <div className="flex items-center text-xs font-bold mt-1 text-red-500 dark:text-red-400">
                        <AlertCircle size={12} className="mr-1" />
                        {minutesLeft <= 0 ? 'Terminé' : `${minutesLeft} min`}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => removePerf(perf.id)}
                    className="ml-5 p-3 text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 rounded-full transition-all z-10"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
