import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

const EmergencyButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar después de 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEmergencyCall = () => {
    // Número de emergencia del consultorio
    window.location.href = 'tel:+525551234567';
  };

  const handleWhatsApp = () => {
    // WhatsApp del consultorio
    const message = encodeURIComponent('¡Hola! Tengo una emergencia dental. ¿Pueden ayudarme?');
    window.open(`https://wa.me/525551234567?text=${message}`, '_blank');
  };

  const handleUberEmergency = () => {
    // Abrir Uber a la dirección del consultorio
    const address = encodeURIComponent('Av. Principal 123, Ciudad');
    window.open(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${address}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {/* Llamada de emergencia - Botón principal */}
      <a
        href="tel:+525551234567"
        onClick={handleEmergencyCall}
        className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group relative"
        aria-label="Llamar emergencia dental"
        title="Emergencia Dental - Llamar ahora"
      >
        <Phone className="w-6 h-6" />
        
        {/* Indicador de disponibilidad */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Emergencia 24/7
        </div>
      </a>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group relative"
        aria-label="WhatsApp emergencia"
        title="WhatsApp emergencia"
      >
        <MessageCircle className="w-5 h-5" />
        
        {/* Tooltip */}
        <div className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          WhatsApp
        </div>
      </button>

      {/* Uber al consultorio */}
      <button
        onClick={handleUberEmergency}
        className="w-12 h-12 bg-gray-900 hover:bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group relative"
        aria-label="Uber al consultorio"
        title="Uber al consultorio"
      >
        <MapPin className="w-5 h-5" />
        
        {/* Tooltip */}
        <div className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Ir al consultorio
        </div>
      </button>
    </div>
  );
};

export default EmergencyButton;