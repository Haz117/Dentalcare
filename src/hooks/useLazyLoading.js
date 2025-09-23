import React, { useState, useRef, useCallback, useEffect } from 'react';

// Hook para lazy loading de imágenes
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    isError,
    onLoad: handleLoad,
    onError: handleError
  };
};

// Componente de imagen lazy optimizada
export const LazyImage = ({
  src,
  alt,
  placeholder = '/api/placeholder/400/300',
  className = '',
  ...props
}) => {
  const { ref, src: imageSrc, isLoaded, isError, onLoad, onError } = useLazyImage(src, placeholder);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={onLoad}
          onError={onError}
          className={`transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${isError ? 'filter-grayscale' : ''}`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
      
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      )}
      
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Imagen no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para lazy loading de componentes
export const useLazyComponent = (importFunction, dependencies = []) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = useCallback(async () => {
    if (Component) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const module = await importFunction();
      setComponent(() => module.default || module);
    } catch (err) {
      setError(err);
      console.error('Error loading component:', err);
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  return {
    Component,
    isLoading,
    error,
    loadComponent
  };
};

// Componente wrapper para lazy loading con Intersection Observer
export const LazyWrapper = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  fallback = null,
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (hasLoaded && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once, hasLoaded]);

  return (
    <div ref={ref}>
      {isVisible ? children : (fallback || <div className="h-32" />)}
    </div>
  );
};

// Hook para precargar recursos
export const usePreloader = () => {
  const [loadedResources, setLoadedResources] = useState(new Set());

  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (loadedResources.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedResources(prev => new Set([...prev, src]));
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [loadedResources]);

  const preloadScript = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (loadedResources.has(src)) {
        resolve(src);
        return;
      }

      const script = document.createElement('script');
      script.onload = () => {
        setLoadedResources(prev => new Set([...prev, src]));
        resolve(src);
      };
      script.onerror = reject;
      script.src = src;
      document.head.appendChild(script);
    });
  }, [loadedResources]);

  const preloadCSS = useCallback((href) => {
    return new Promise((resolve, reject) => {
      if (loadedResources.has(href)) {
        resolve(href);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => {
        setLoadedResources(prev => new Set([...prev, href]));
        resolve(href);
      };
      link.onerror = reject;
      link.href = href;
      document.head.appendChild(link);
    });
  }, [loadedResources]);

  return {
    preloadImage,
    preloadScript,
    preloadCSS,
    isLoaded: (resource) => loadedResources.has(resource)
  };
};