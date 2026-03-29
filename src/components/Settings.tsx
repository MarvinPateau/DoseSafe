import { useState } from 'react';
import { AlertTriangle, Trash2, Info, Check, X, Bell, Moon, Sun, Mail, Loader2, Send, MessageSquare, Share2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';

export default function Settings() {
  const [confirmClear, setConfirmClear] = useState(false);
  const [alertTiming, setAlertTiming] = useLocalStorage<number>('dosesafe_alert_timing', 15);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('dosesafe_theme', 'dark');
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleClearData = () => {
    window.localStorage.removeItem('dosesafe_perfusions');
    window.localStorage.removeItem('dosesafe_scratchpad');
    window.localStorage.removeItem('dosesafe_chat_notes');
    window.localStorage.removeItem('dosesafe_planning');
    window.localStorage.removeItem('dosesafe_alert_timing');
    window.location.reload();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'DoseSafe',
          text: 'Découvrez DoseSafe, l\'application indispensable pour les calculs de perfusion et outils cliniques en milieu hospitalier.',
          url: window.location.origin,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('Lien copié !', {
          description: 'Le lien de l\'application a été copié dans votre presse-papier.'
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setIsSubmittingFeedback(true);
    
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    
    if (!endpoint) {
      toast.error('Erreur de configuration', {
        description: 'L\'URL de destination n\'est pas configurée.'
      });
      setIsSubmittingFeedback(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: feedback }),
      });

      if (response.ok) {
        toast.success('Message envoyé !', {
          description: 'Merci pour votre retour, il a été transmis anonymement.'
        });
        setFeedback('');
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      toast.error('Non supporté', { description: 'Votre navigateur ne supporte pas les notifications.' });
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Test DoseSafe', { 
        body: 'Les notifications fonctionnent correctement !',
        icon: '/vite.svg'
      });
      toast.success('Notification envoyée');
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Test DoseSafe', { 
          body: 'Les notifications sont maintenant activées !',
          icon: '/vite.svg'
        });
        toast.success('Notifications activées');
      } else {
        toast.error('Permission refusée', { description: 'Vous devez autoriser les notifications dans les réglages de votre téléphone.' });
      }
    } else {
      toast.error('Permission refusée', { description: 'Les notifications sont bloquées. Modifiez les réglages de votre navigateur/téléphone.' });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Réglages</h2>
      </div>

      {/* Share App */}
      <button
        onClick={handleShare}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-3xl p-5 flex items-center justify-between transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Share2 size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Partager DoseSafe</h3>
            <p className="text-blue-100 text-sm">Recommander à un collègue</p>
          </div>
        </div>
      </button>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Apparence</h3>
        </div>
        <div className="p-5">
          <div className="flex space-x-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                theme === 'light' 
                  ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400' 
                  : 'bg-slate-100 dark:bg-black text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Sun size={18} />
              <span>Clair</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                theme === 'dark' 
                  ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400' 
                  : 'bg-slate-100 dark:bg-black text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Moon size={18} />
              <span>Sombre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 dark:text-amber-400">
            <Bell size={20} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Alertes Perfusions</h3>
        </div>
        <div className="p-5">
          <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-4">M'avertir avant la fin :</label>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[5, 10, 15, 30].map(time => (
              <button
                key={time}
                onClick={() => setAlertTiming(time)}
                className={`py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                  alertTiming === time 
                    ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-400' 
                    : 'bg-slate-100 dark:bg-black text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-800'
                }`}
              >
                {time} min
              </button>
            ))}
          </div>
          
          <button
            onClick={handleTestNotification}
            className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Bell size={18} />
            <span>Tester les notifications</span>
          </button>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-3 text-center">
            Note : L'application doit rester ouverte pour que les alarmes sonnent.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-start space-x-4">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400 shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Une chose à ajouter ?</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
              DoseSafe est un projet en construction. Tout retour d'expérience est le bienvenu pour rajouter des fonctionnalités, modifier l'interface ou corriger des bugs !
            </p>
          </div>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-zinc-800/50">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ex: Ce serait super d'ajouter un score de calcul pour..."
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 resize-none h-28 mb-3 shadow-inner"
          />
          <button 
            onClick={handleFeedbackSubmit}
            disabled={!feedback.trim() || isSubmittingFeedback}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none"
          >
            {isSubmittingFeedback ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span>Envoyer anonymement</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-start space-x-4">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 dark:text-blue-400 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">À propos de DoseSafe</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Application conçue pour une utilisation rapide en milieu hospitalier. 
              Toutes les données sont stockées localement sur votre appareil.
            </p>
          </div>
        </div>
        
        {!confirmClear ? (
          <button 
            onClick={() => setConfirmClear(true)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-500/10 rounded-xl text-red-500 dark:text-red-400">
                <Trash2 size={20} />
              </div>
              <div>
                <div className="font-bold text-red-500 dark:text-red-400">Effacer les données</div>
                <div className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-0.5">Supprime l'historique, notes et planning</div>
              </div>
            </div>
          </button>
        ) : (
          <div className="p-5 bg-red-50 dark:bg-red-500/10">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-bold text-center">Confirmer la suppression ?</p>
            <div className="flex space-x-3">
              <button 
                onClick={handleClearData}
                className="flex-1 flex justify-center items-center py-3 bg-red-500 hover:bg-red-600 dark:hover:bg-red-400 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Check size={18} className="mr-2" /> Oui
              </button>
              <button 
                onClick={() => setConfirmClear(false)}
                className="flex-1 flex justify-center items-center py-3 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-white rounded-2xl font-bold active:scale-95 transition-all"
              >
                <X size={18} className="mr-2" /> Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-3xl p-5 flex items-start space-x-4 transition-colors duration-300">
        <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-orange-800 dark:text-orange-200/80 leading-relaxed font-medium">
          <strong className="text-orange-600 dark:text-orange-400 block mb-1">Avertissement :</strong> Cette application est un outil d'aide au calcul. 
          Les résultats doivent toujours être vérifiés par le professionnel de santé selon 
          les protocoles du service avant administration.
        </p>
      </div>
      
      <div className="text-center text-xs font-medium text-slate-400 dark:text-zinc-600 mt-8 pb-4">
        DoseSafe v1.0.0
      </div>
    </div>
  );
}
