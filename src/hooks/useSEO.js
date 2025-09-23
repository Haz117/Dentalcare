import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Configuración SEO por página
const SEO_CONFIG = {
  '/': {
    title: 'DentalCare - Consultorio Dental | Servicios de Alta Calidad',
    description: 'Consultorio dental moderno con tecnología avanzada. Ofrecemos implantes, blanqueamiento, ortodoncia y más. Agenda tu cita online.',
    keywords: 'dentista, consultorio dental, implantes dentales, blanqueamiento, ortodoncia, citas online',
    ogType: 'website',
    canonical: '/'
  },
  '/agendar': {
    title: 'Agendar Cita Dental Online | DentalCare',
    description: 'Agenda tu cita dental de forma rápida y sencilla. Disponibilidad en tiempo real y confirmación inmediata.',
    keywords: 'agendar cita dental, reservar dentista, cita online, consultorio dental',
    ogType: 'website',
    canonical: '/agendar'
  },
  '/paciente': {
    title: 'Panel del Paciente | DentalCare',
    description: 'Accede a tu historial dental, citas programadas y gestiona tus tratamientos de forma segura.',
    keywords: 'panel paciente, historial dental, mis citas, tratamientos dentales',
    ogType: 'website',
    canonical: '/paciente',
    noindex: true // Panel privado
  },
  '/admin': {
    title: 'Panel Administrativo | DentalCare',
    description: 'Panel de administración del consultorio dental.',
    keywords: 'admin dental, gestión consultorio',
    ogType: 'website',
    canonical: '/admin',
    noindex: true // Panel privado
  }
};

// Hook para gestión dinámica de SEO
export const useSEO = (customConfig = {}) => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const config = {
      ...SEO_CONFIG[pathname],
      ...customConfig
    };

    if (!config) return;

    // Actualizar title
    if (config.title) {
      document.title = config.title;
    }

    // Función helper para actualizar meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      if (!content) return;
      
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta tags básicos
    updateMetaTag('description', config.description);
    updateMetaTag('keywords', config.keywords);
    
    // Open Graph
    updateMetaTag('og:title', config.title, 'property');
    updateMetaTag('og:description', config.description, 'property');
    updateMetaTag('og:type', config.ogType || 'website', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:site_name', 'DentalCare', 'property');
    updateMetaTag('og:locale', 'es_ES', 'property');
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', config.title);
    updateMetaTag('twitter:description', config.description);
    
    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = `${window.location.origin}${config.canonical || pathname}`;

    // Robots meta tag
    if (config.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Schema.org JSON-LD
    updateStructuredData(config);

  }, [pathname, customConfig]);
};

// Actualizar datos estructurados
const updateStructuredData = (config) => {
  // Remover JSON-LD existente (excepto el del HTML base)
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]:not([data-permanent])');
  existingScripts.forEach(script => script.remove());

  // Schema para páginas específicas
  let schemaData = null;

  if (config.canonical === '/') {
    // Schema para página principal
    schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DentalClinic",
          "@id": `${window.location.origin}/#clinic`,
          "name": "DentalCare",
          "description": "Consultorio dental moderno con tecnología avanzada",
          "url": window.location.origin,
          "telephone": "+52-555-123-4567",
          "email": "contacto@consultoriodental.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Principal 123",
            "addressLocality": "Ciudad",
            "addressCountry": "MX"
          },
          "openingHours": [
            "Mo-Fr 08:00-18:00",
            "Sa 08:00-12:00"
          ],
          "priceRange": "$$",
          "acceptsReservations": true,
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios Dentales",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Limpieza Dental",
                  "description": "Limpieza profesional y revisión completa"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Blanqueamiento Dental",
                  "description": "Tratamiento de blanqueamiento láser"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Implantes Dentales",
                  "description": "Implantes de titanio con garantía"
                }
              }
            ]
          }
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          "url": window.location.origin,
          "name": "DentalCare",
          "description": "Consultorio dental moderno",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/buscar?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }
      ]
    };
  } else if (config.canonical === '/agendar') {
    // Schema para página de agendamiento
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Agendar Cita Dental",
      "description": "Agenda tu cita dental online de forma rápida y sencilla",
      "url": window.location.href,
      "mainEntity": {
        "@type": "ReservationAction",
        "name": "Agendar Cita Dental",
        "description": "Sistema de reservas online para citas dentales"
      }
    };
  }

  if (schemaData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }
};

// Componente SEOHead para usar en páginas específicas
export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  ogType = 'website',
  noindex = false,
  canonical 
}) => {
  useSEO({
    title,
    description,
    keywords,
    image,
    ogType,
    noindex,
    canonical
  });

  return null;
};

// Hook para Analytics y tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }

    // Eventos personalizados para analytics
    const trackPageView = () => {
      console.log('📊 Page view tracked:', {
        path: location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
      });
    };

    trackPageView();
  }, [location]);

  // Función para trackear eventos personalizados
  const trackEvent = (eventName, parameters = {}) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    console.log('📊 Event tracked:', eventName, parameters);
  };

  return { trackEvent };
};

// Sitemap generator (para uso en build)
export const generateSitemap = () => {
  const baseUrl = 'https://tu-dominio.com';
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/agendar', priority: 0.9, changefreq: 'daily' },
    { url: '/servicios', priority: 0.8, changefreq: 'weekly' },
    { url: '/nosotros', priority: 0.7, changefreq: 'monthly' },
    { url: '/contacto', priority: 0.6, changefreq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;

  return sitemap;
};

// Robots.txt generator
export const generateRobotsTxt = () => {
  const baseUrl = 'https://tu-dominio.com';
  
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /paciente
Disallow: /firebase-test

Sitemap: ${baseUrl}/sitemap.xml`;
};

// Hook para manejar breadcrumbs
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Inicio', path: '/' }];

    const routeNames = {
      'agendar': 'Agendar Cita',
      'paciente': 'Mi Panel',
      'admin': 'Administración',
      'servicios': 'Servicios',
      'nosotros': 'Nosotros',
      'contacto': 'Contacto'
    };

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      if (routeNames[path]) {
        breadcrumbs.push({
          name: routeNames[path],
          path: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const generateBreadcrumbSchema = () => {
    const breadcrumbs = getBreadcrumbs();
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": breadcrumb.name,
        "item": `${window.location.origin}${breadcrumb.path}`
      }))
    };
  };

  return {
    breadcrumbs: getBreadcrumbs(),
    schema: generateBreadcrumbSchema()
  };
};