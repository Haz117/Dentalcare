import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Zap, Clock, MapPin } from 'lucide-react';

const EmergencyButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar después de 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón principal */}
      <div className="relative">
        {/* Opciones expandidas */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
            {/* Llamada directa */}
            <button
              onClick={handleEmergencyCall}
              className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110 transform-gpu"
              aria-label="Llamar emergencia"
              title="Llamar ahora"
            >
              <Phone className="w-5 h-5" />
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-110 transform-gpu"
              aria-label="WhatsApp emergencia"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Uber al consultorio */}
            <button
              onClick={handleUberEmergency}
              className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110 transform-gpu"
              aria-label="Uber al consultorio"
              title="Uber al consultorio"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Botón principal de emergencia */}
        <button
          onClick={toggleExpanded}
          className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform-gpu ${
            isExpanded 
              ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
              : 'bg-red-500 hover:bg-red-600 animate-pulse hover:animate-none'
          } text-white flex items-center justify-center hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300`}
          aria-label={isExpanded ? "Cerrar menú de emergencia" : "Emergencia dental"}
          title={isExpanded ? "Cerrar" : "Emergencia dental"}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Zap className="w-6 h-6" />
          )}
        </button>

        {/* Indicador de disponibilidad */}
        {!isExpanded && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
        )}
      </div>

      {/* Modal de información de emergencia */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Emergencia Dental</h3>
            <p className="text-sm text-gray-600 mb-4">
              Estamos disponibles 24/7 para emergencias dentales
            </p>
            
            <div className="space-y-2 text-left">
              <div className="flex items-center text-sm text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-red-500" />
                <span>+52 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span>Disponible 24/7</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                <span>Av. Principal 123</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>¿Es una emergencia real?</strong><br />
                Dolor severo, traumatismo, sangrado abundante
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar al hacer clic fuera */}
      {isExpanded && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default EmergencyButton;