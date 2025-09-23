import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';

// Componente de botón "back to top"
export const BackToTopButton = () => {
  const { isVisible, scrollToTop } = useScrollToTop();

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 left-4 w-12 h-12 bg-dental-blue text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center"
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTopButton;