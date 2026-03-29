export const haptics = {
  light: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },
  success: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },
  warning: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  error: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }
};
