import { useState, useEffect, useCallback } from 'react';

// Hook para detectar dispositivo móvil
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Hook para optimizar formularios móviles
export const useMobileFormOptimization = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // Prevenir zoom en inputs en iOS
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    }

    return () => {
      // Restaurar viewport normal
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport && isMobile) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    };
  }, [isMobile]);

  const getInputProps = useCallback((type = 'text') => {
    const baseProps = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
      spellCheck: false
    };

    if (type === 'email') {
      return {
        ...baseProps,
        inputMode: 'email',
        type: 'email',
        autoCapitalize: 'none'
      };
    }

    if (type === 'tel') {
      return {
        ...baseProps,
        inputMode: 'tel',
        type: 'tel',
        pattern: '[0-9]*'
      };
    }

    if (type === 'number') {
      return {
        ...baseProps,
        inputMode: 'numeric',
        type: 'number',
        pattern: '[0-9]*'
      };
    }

    return baseProps;
  }, []);

  return {
    isMobile,
    getInputProps
  };
};