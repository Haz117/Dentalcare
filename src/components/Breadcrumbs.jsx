import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../hooks/useSEO';

const Breadcrumbs = ({ className = '' }) => {
  const { breadcrumbs, schema } = useBreadcrumbs();

  // No mostrar breadcrumbs en la página principal
  if (breadcrumbs.length <= 1) return null;

  // Agregar schema al head
  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'breadcrumb-schema';
    
    // Remover script anterior si existe
    const existingScript = document.getElementById('breadcrumb-schema');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema]);

  return (
    <nav 
      className={`bg-gray-50 border-b border-gray-200 ${className}`}
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400 mx-2" />
              )}
              
              {index === 0 ? (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center text-gray-500 hover:text-dental-blue transition-colors"
                  aria-label="Ir al inicio"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span className="sr-only">{breadcrumb.name}</span>
                </Link>
              ) : index === breadcrumbs.length - 1 ? (
                <span 
                  className="text-dental-darkgray font-medium"
                  aria-current="page"
                >
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-500 hover:text-dental-blue transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;