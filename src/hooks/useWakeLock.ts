import { useState, useEffect, useCallback } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) return false;
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      
      lock.addEventListener('release', () => {
        setIsLocked(false);
        setWakeLock(null);
      });
      
      setWakeLock(lock);
      setIsLocked(true);
      return true;
    } catch (err) {
      console.error('Wake Lock error:', err);
      return false;
    }
  }, []);

  const release = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
      } catch (e) {
        console.error(e);
      }
      setWakeLock(null);
      setIsLocked(false);
    }
  }, [wakeLock]);

  // Re-acquire wake lock when document becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [wakeLock, request]);

  return { isSupported, isLocked, request, release };
}
