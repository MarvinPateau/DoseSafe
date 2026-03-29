import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Droplets } from 'lucide-react';

interface Perfusion {
  id: string;
  room: string;
  treatment: string;
  volume: number;
  rate: number;
  startTime: string;
  endTime: string;
}

export default function PerfusionAlerts() {
  const alertedPerfusions = useRef<Map<string, 'warning' | 'finished'>>(new Map());

  useEffect(() => {
    const checkPerfusions = () => {
      try {
        const data = window.localStorage.getItem('dosesafe_perfusions');
        const alertTimingStr = window.localStorage.getItem('dosesafe_alert_timing');
        const alertTiming = alertTimingStr ? parseInt(alertTimingStr, 10) : 15;
        
        if (!data) return;

        const perfusions: Perfusion[] = JSON.parse(data);
        const now = new Date().getTime();

        perfusions.forEach(perf => {
          const endTime = new Date(perf.endTime).getTime();
          const minutesLeft = (endTime - now) / 60000;
          const status = alertedPerfusions.current.get(perf.id);

          // Alerte : X minutes restantes
          if (minutesLeft > 0 && minutesLeft <= alertTiming && status !== 'warning' && status !== 'finished') {
            alertedPerfusions.current.set(perf.id, 'warning');

            const title = `Perfusion bientôt terminée`;
            const message = `Chambre ${perf.room} : ${perf.treatment} se termine dans ${Math.ceil(minutesLeft)} min.`;

            toast(title, {
              description: message,
              icon: <Droplets className="text-orange-500" size={20} />,
              duration: 10000,
            });

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body: message });
            }
          }
          
          // Alerte : Terminée
          if (minutesLeft <= 0 && status !== 'finished') {
            alertedPerfusions.current.set(perf.id, 'finished');

            const title = `Perfusion terminée !`;
            const message = `Chambre ${perf.room} : ${perf.treatment} est terminée.`;

            toast(title, {
              description: message,
              icon: <AlertCircle className="text-red-500" size={20} />,
              duration: 15000,
            });

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body: message });
            }
          }
          
          // Nettoyer les alertes pour les perfusions terminées depuis longtemps (ex: > 1h)
          if (minutesLeft < -60) {
            alertedPerfusions.current.delete(perf.id);
          }
        });
      } catch (error) {
        console.error("Erreur lors de la vérification des perfusions:", error);
      }
    };

    // Vérifier immédiatement puis toutes les 30 secondes
    checkPerfusions();
    const interval = setInterval(checkPerfusions, 30000);

    return () => clearInterval(interval);
  }, []);

  return null; // Ce composant ne rend rien visuellement, il gère juste la logique
}
