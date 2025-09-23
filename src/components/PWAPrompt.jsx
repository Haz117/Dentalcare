import React from 'react';
import { Download, Wifi, WifiOff, RefreshCw, Share2, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const PWAPrompt = () => {
  const {
    isInstallable,
    isOnline,
    swUpdateAvailable,
    installPWA,
    updateServiceWorker,
    shareContent
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Mostrar prompt de instalación después de 5 segundos
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  React.useEffect(() => {
    if (swUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [swUpdateAvailable]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker();
    setShowUpdatePrompt(false);
  };

  const handleShare = async () => {
    await shareContent({
      title: 'DentalCare - Consultorio Dental',
      text: 'Descubre nuestros servicios dentales de alta calidad',
      url: window.location.origin
    });
  };

  return (
    <>
      {/* Indicador de conectividad */}
      {!isOnline && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Sin conexión - Modo offline</span>
          </div>
        </div>
      )}

      {/* Prompt de instalación */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-dental-blue rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-dental-darkgray">Instalar DentalCare</h3>
                  <p className="text-xs text-dental-gray">Acceso rápido desde tu inicio</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-dental-gray mb-4">
              Instala nuestra app para acceso rápido, notificaciones y funcionalidad offline.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-dental-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-4 py-2 text-dental-gray text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt de actualización */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Nueva versión disponible</h3>
                  <p className="text-xs text-green-600">Actualiza para obtener las últimas mejoras</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="text-green-400 hover:text-green-600"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Actualizar
              </button>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="px-4 py-2 text-green-600 text-sm border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
              >
                Después
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de compartir flotante */}
      <button
        onClick={handleShare}
        className="fixed bottom-20 right-4 w-12 h-12 bg-dental-blue text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-40 flex items-center justify-center"
        aria-label="Compartir"
        title="Compartir DentalCare"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Indicador de conectividad mejorado */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
          isOnline 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PWAPrompt;