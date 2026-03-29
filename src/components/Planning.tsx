import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sun, Moon, Coffee, X, ChevronRight, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { haptics } from '../utils/haptics';

type ShiftType = 'jour' | 'nuit' | 'repos';

interface Shift {
  type: ShiftType;
  startTime?: string;
  endTime?: string;
}

const DAY_OPTIONS = [
  { start: '06:45', end: '18:45' },
  { start: '07:00', end: '19:00' },
  { start: '07:15', end: '19:15' },
];

const NIGHT_OPTION = { start: '19:00', end: '07:00' };

export default function Planning() {
  const [schedule, setSchedule] = useLocalStorage<Record<string, Shift>>('dosesafe_planning', {});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempShift, setTempShift] = useState<Shift | null>(null);

  // Generate next 30 days
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  const formatDateKey = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
  };

  const handleDayClick = (d: Date) => {
    const key = formatDateKey(d);
    setSelectedDate(d);
    setTempShift(schedule[key] || { type: 'repos' });
  };

  const calculateTotalHours = () => {
    let total = 0;
    days.forEach(d => {
      const key = formatDateKey(d);
      const shift = schedule[key];
      if (shift && shift.type !== 'repos' && shift.startTime && shift.endTime) {
        const [startH, startM] = shift.startTime.split(':').map(Number);
        const [endH, endM] = shift.endTime.split(':').map(Number);
        
        let hours = endH - startH + (endM - startM) / 60;
        if (hours < 0) {
          hours += 24; // Nuit
        }
        total += hours;
      }
    });
    return total;
  };

  const totalHours = calculateTotalHours();

  const saveShift = () => {
    if (!selectedDate || !tempShift) return;
    const key = formatDateKey(selectedDate);
    
    if (tempShift.type === 'repos') {
      const newSchedule = { ...schedule };
      delete newSchedule[key];
      setSchedule(newSchedule);
    } else {
      setSchedule({ ...schedule, [key]: tempShift });
    }
    setSelectedDate(null);
    haptics.success();
  };

  const exportToICS = () => {
    const entries = Object.entries(schedule).filter(([_, shift]) => (shift as Shift).type !== 'repos' && (shift as Shift).startTime && (shift as Shift).endTime);
    
    if (entries.length === 0) {
      alert("Aucune garde à exporter ! Ajoutez d'abord des jours ou des nuits.");
      return;
    }

    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DoseSafe//Planning//FR\r\n";

    entries.forEach(([dateStr, shiftValue]) => {
      const shift = shiftValue as Shift;
      const [year, month, day] = dateStr.split('-').map(Number);
      const [startH, startM] = shift.startTime!.split(':').map(Number);
      const [endH, endM] = shift.endTime!.split(':').map(Number);

      const startDate = new Date(year, month - 1, day, startH, startM);
      const endDate = new Date(year, month - 1, day, endH, endM);

      // Si l'heure de fin est plus petite que l'heure de début, c'est que la garde finit le lendemain (Nuit)
      if (endH < startH) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const formatDT = (d: Date) => {
        return d.getFullYear() +
          String(d.getMonth() + 1).padStart(2, '0') +
          String(d.getDate()).padStart(2, '0') + 'T' +
          String(d.getHours()).padStart(2, '0') +
          String(d.getMinutes()).padStart(2, '0') +
          String(d.getSeconds()).padStart(2, '0');
      };

      const summary = shift.type === 'jour' ? 'Garde de Jour' : 'Garde de Nuit';

      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:${dateStr}-${shift.type}@dosesafe\r\n`;
      ics += `DTSTAMP:${formatDT(new Date())}\r\n`;
      ics += `DTSTART:${formatDT(startDate)}\r\n`;
      ics += `DTEND:${formatDT(endDate)}\r\n`;
      ics += `SUMMARY:${summary}\r\n`;
      ics += "END:VEVENT\r\n";
    });

    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'planning-dosesafe.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full pb-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-500 dark:text-indigo-400">
            <CalendarIcon size={24} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Planning</h2>
        </div>
        <button 
          onClick={exportToICS}
          className="flex items-center space-x-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-4 py-2.5 rounded-2xl font-bold active:scale-95 transition-all border border-indigo-500/20"
        >
          <Download size={18} />
          <span className="text-sm">ICS</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-3xl p-5 mb-4 flex items-center justify-between shadow-sm dark:shadow-none">
         <div>
            <div className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-0.5">Heures programmées</div>
            <div className="text-xs font-medium text-slate-500 dark:text-zinc-500">Sur les 30 prochains jours</div>
         </div>
         <div className="text-3xl font-display font-bold text-indigo-500 dark:text-indigo-400 tracking-tight">
            {totalHours}h
         </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-20 relative">
        {days.map((d, i) => {
          const key = formatDateKey(d);
          const shift = schedule[key];
          const isToday = i === 0;
          
          const prevDate = i > 0 ? days[i - 1] : null;
          const isNewMonth = prevDate ? d.getMonth() !== prevDate.getMonth() : true;

          return (
            <React.Fragment key={`fragment-${key}`}>
              {isNewMonth && (
                <div className={`flex items-center sticky top-0 z-10 bg-slate-50/95 dark:bg-black/95 backdrop-blur-md py-3 -mx-2 px-2 ${i === 0 ? 'mb-2' : 'mt-6 mb-2'}`}>
                  <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                  <span className="px-4 text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                    {d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                </div>
              )}
              <button
                key={key}
                onClick={() => handleDayClick(d)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all active:scale-[0.98] ${
                isToday ? 'border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-slate-200 bg-white dark:border-white/5 dark:bg-zinc-900 shadow-sm dark:shadow-none'
              }`}
            >
              <div className="flex items-center space-x-5">
                <div className={`w-14 text-center ${isToday ? 'text-indigo-500 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-zinc-400'}`}>
                  <div className="text-xs font-medium uppercase tracking-widest">{d.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                  <div className="text-3xl font-display font-bold tracking-tighter mt-1">{d.getDate()}</div>
                </div>
                
                <div className="h-10 w-px bg-slate-200 dark:bg-white/10"></div>

                <div className="text-left">
                  {!shift || shift.type === 'repos' ? (
                    <div className="flex items-center text-slate-500 dark:text-zinc-500">
                      <Coffee size={18} className="mr-2.5" />
                      <span className="font-medium">Repos</span>
                    </div>
                  ) : shift.type === 'jour' ? (
                    <div className="flex flex-col">
                      <div className="flex items-center text-amber-500 dark:text-amber-400 font-bold text-lg tracking-tight">
                        <Sun size={18} className="mr-2" />
                        Jour
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-center text-indigo-500 dark:text-indigo-400 font-bold text-lg tracking-tight">
                        <Moon size={18} className="mr-2" />
                        Nuit
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <ChevronRight size={20} className="text-slate-400 dark:text-zinc-600" />
            </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Sheet Modal */}
      {selectedDate && tempShift && (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-900/80 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-zinc-900 w-full rounded-t-[2.5rem] border-t border-slate-200 dark:border-white/10 p-8 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white capitalize tracking-tight">
                {formatDisplayDate(selectedDate)}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="p-3 bg-slate-100 dark:bg-black rounded-full text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white active:scale-95 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setTempShift({ type: 'jour', startTime: DAY_OPTIONS[1].start, endTime: DAY_OPTIONS[1].end })}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all ${
                  tempShift.type === 'jour' ? 'bg-amber-500 text-white border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-black dark:border-white/5 dark:text-zinc-400'
                }`}
              >
                <Sun size={28} className="mb-3" />
                <span className="font-bold text-sm tracking-wide">Jour</span>
              </button>
              
              <button
                onClick={() => setTempShift({ type: 'nuit', startTime: NIGHT_OPTION.start, endTime: NIGHT_OPTION.end })}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all ${
                  tempShift.type === 'nuit' ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-black dark:border-white/5 dark:text-zinc-400'
                }`}
              >
                <Moon size={28} className="mb-3" />
                <span className="font-bold text-sm tracking-wide">Nuit</span>
              </button>

              <button
                onClick={() => setTempShift({ type: 'repos' })}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all ${
                  tempShift.type === 'repos' ? 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-700 dark:text-white dark:border-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-black dark:border-white/5 dark:text-zinc-400'
                }`}
              >
                <Coffee size={28} className="mb-3" />
                <span className="font-bold text-sm tracking-wide">Repos</span>
              </button>
            </div>

            {tempShift.type === 'jour' && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-4 ml-1">Horaires de jour</label>
                <div className="grid grid-cols-3 gap-3">
                  {DAY_OPTIONS.map(opt => (
                    <button
                      key={opt.start}
                      onClick={() => setTempShift({ ...tempShift, startTime: opt.start, endTime: opt.end })}
                      className={`py-4 rounded-2xl text-sm font-bold border transition-all ${
                        tempShift.startTime === opt.start 
                          ? 'bg-amber-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-black dark:text-zinc-300 dark:border-white/5'
                      }`}
                    >
                      {opt.start}
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm font-medium text-slate-500 dark:text-zinc-500 mt-4">
                  Fin prévue : <span className="text-slate-700 dark:text-zinc-300">{tempShift.endTime}</span>
                </div>
              </div>
            )}

            {tempShift.type === 'nuit' && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-50 dark:bg-black rounded-3xl p-6 border border-slate-200 dark:border-white/5 text-center">
                  <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-2">Horaires de nuit</div>
                  <div className="text-2xl font-display font-bold text-indigo-500 dark:text-indigo-400 tracking-tight">
                    {NIGHT_OPTION.start} - {NIGHT_OPTION.end}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={saveShift}
              className="w-full py-5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
