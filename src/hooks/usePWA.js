// Hook personalizado para gestionar PWA
import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Detectar si ya está instalado
    const checkIfInstalled = () => {
      // Para Safari
      if (window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }
      
      // Para Chrome/Edge
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Para otros navegadores
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 PWA es instalable');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      console.log('✅ PWA instalada');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Escuchar cambios de conectividad
    const handleOnline = () => {
      console.log('🌐 Conectado');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📱 Offline');
      setIsOnline(false);
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration.scope);
          
          // Verificar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Nueva versión disponible');
                setSwUpdateAvailable(true);
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Error al registrar Service Worker:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función para instalar la PWA
  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ Usuario aceptó instalar la PWA');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('❌ Usuario rechazó instalar la PWA');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al instalar PWA:', error);
      return false;
    }
  };

  // Función para actualizar el Service Worker
  const updateServiceWorker = () => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    setSwUpdateAvailable(false);
    
    // Recargar la página después de un breve delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Función para compartir contenido (Web Share API)
  const shareContent = async (shareData = {}) => {
    const defaultData = {
      title: 'DentalCare - Consultorio Dental',
      text: 'Agenda tu cita dental con tecnología avanzada',
      url: window.location.href
    };

    const data = { ...defaultData, ...shareData };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      } else {
        // Fallback: copiar al clipboard
        await navigator.clipboard.writeText(data.url);
        console.log('📋 URL copiada al clipboard');
        return true;
      }
    } catch (error) {
      console.error('❌ Error al compartir:', error);
      return false;
    }
  };

  // Función para solicitar permisos de notificación
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('❌ Este navegador no soporta notificaciones');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permisos de notificación concedidos');
        return true;
      } else {
        console.log('❌ Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al solicitar permisos:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    swUpdateAvailable,
    installPWA,
    updateServiceWorker,
    shareContent,
    requestNotificationPermission
  };
};