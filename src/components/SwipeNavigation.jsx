import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

// Componente de navegación por gestos
export const SwipeNavigation = ({ currentIndex, totalItems, onNext, onPrev, children }) => {
  const swipeHandlers = useSwipeGesture(onNext, onPrev);

  return (
    <div 
      className="relative overflow-hidden"
      {...swipeHandlers}
    >
      {children}
      
      {/* Indicadores de swipe */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white shadow-lg scale-125'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Controles de navegación para desktop */}
      <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
        <button
          onClick={onPrev}
          className="ml-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
        <button
          onClick={onNext}
          className="mr-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SwipeNavigation;