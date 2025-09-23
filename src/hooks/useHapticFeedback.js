import { useCallback } from 'react';

// Hook para feedback táctil (vibración) en dispositivos móviles
export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate([50]), [vibrate]);
  const mediumTap = useCallback(() => vibrate([100]), [vibrate]);
  const heavyTap = useCallback(() => vibrate([200]), [vibrate]);
  const doubleTap = useCallback(() => vibrate([100, 50, 100]), [vibrate]);
  const errorTap = useCallback(() => vibrate([200, 100, 200]), [vibrate]);
  const successTap = useCallback(() => vibrate([100, 50, 100, 50, 100]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    doubleTap,
    errorTap,
    successTap
  };
};