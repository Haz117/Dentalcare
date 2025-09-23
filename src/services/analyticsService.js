import React from 'react';

// Analytics Service para DentalCare
class AnalyticsService {
  constructor() {
    this.isGoogleAnalyticsLoaded = typeof gtag !== 'undefined';
    this.isFacebookPixelLoaded = typeof fbq !== 'undefined';
    this.isClarityLoaded = typeof clarity !== 'undefined';
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  // Generar ID de sesión único
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  // Track page views
  trackPageView(page, title = '') {
    const data = {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: page,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    // Google Analytics
    if (this.isGoogleAnalyticsLoaded) {
      gtag('config', 'G-K29EK328S2', data);
    }

    // Facebook Pixel
    if (this.isFacebookPixelLoaded) {
      fbq('track', 'PageView');
    }

    console.log('📊 Page view tracked:', data);
  }

  // Track eventos personalizados
  trackEvent(eventName, parameters = {}) {
    const eventData = {
      ...parameters,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    // Google Analytics
    if (this.isGoogleAnalyticsLoaded) {
      gtag('event', eventName, eventData);
    }

    // Facebook Pixel (convertir eventos a formato FB)
    if (this.isFacebookPixelLoaded) {
      const fbEventName = this.convertToFacebookEvent(eventName);
      if (fbEventName) {
        fbq('track', fbEventName, parameters);
      }
    }

    console.log('📊 Event tracked:', eventName, eventData);
  }

  // Convertir eventos a formato Facebook
  convertToFacebookEvent(eventName) {
    const eventMap = {
      'appointment_book': 'Schedule',
      'appointment_complete': 'Purchase',
      'contact_form_submit': 'Contact',
      'phone_call': 'Contact',
      'service_view': 'ViewContent',
      'pwa_install': 'CompleteRegistration'
    };

    return eventMap[eventName] || null;
  }

  // Track conversiones importantes
  trackConversion(type, value = 0, currency = 'MXN') {
    const conversionData = {
      event_category: 'Conversion',
      event_label: type,
      value: value,
      currency: currency,
      session_id: this.sessionId
    };

    this.trackEvent('conversion', conversionData);

    // Eventos específicos para diferentes plataformas
    if (type === 'appointment_booked') {
      // Google Analytics Enhanced Ecommerce
      if (this.isGoogleAnalyticsLoaded) {
        gtag('event', 'purchase', {
          transaction_id: 'apt_' + Date.now(),
          value: value,
          currency: currency,
          items: [{
            item_id: 'dental_appointment',
            item_name: 'Cita Dental',
            category: 'Servicios',
            quantity: 1,
            price: value
          }]
        });
      }

      // Facebook Pixel
      if (this.isFacebookPixelLoaded) {
        fbq('track', 'Schedule', {
          value: value,
          currency: currency,
          content_name: 'Cita Dental'
        });
      }
    }
  }

  // Track errores
  trackError(error, context = '') {
    const errorData = {
      event_category: 'Error',
      event_label: context,
      error_message: error.message || error,
      error_stack: error.stack || '',
      page_location: window.location.href,
      user_agent: navigator.userAgent,
      session_id: this.sessionId
    };

    this.trackEvent('error', errorData);
    
    console.error('📊 Error tracked:', errorData);
  }

  // Track performance metrics
  trackPerformance() {
    if (!('performance' in window)) return;

    const perfData = performance.getEntriesByType('navigation')[0];
    if (!perfData) return;

    const metrics = {
      event_category: 'Performance',
      page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      dom_ready_time: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      first_paint: this.getFirstPaint(),
      session_id: this.sessionId
    };

    this.trackEvent('performance', metrics);
  }

  // Obtener First Paint time
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : 0;
  }

  // Track user engagement
  trackEngagement() {
    const timeOnPage = Date.now() - this.startTime;
    
    const engagementData = {
      event_category: 'Engagement',
      time_on_page: Math.round(timeOnPage / 1000), // en segundos
      scroll_depth: this.getScrollDepth(),
      clicks_count: this.getClicksCount(),
      session_id: this.sessionId
    };

    this.trackEvent('engagement', engagementData);
  }

  // Calcular profundidad de scroll
  getScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  // Contar clicks (aproximado)
  getClicksCount() {
    return parseInt(sessionStorage.getItem('clickCount') || '0');
  }

  // Track búsquedas internas
  trackSearch(searchTerm, resultsCount = 0) {
    const searchData = {
      event_category: 'Search',
      search_term: searchTerm,
      results_count: resultsCount,
      session_id: this.sessionId
    };

    this.trackEvent('search', searchData);

    // Google Analytics site search
    if (this.isGoogleAnalyticsLoaded) {
      gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  }

  // Track elementos de PWA
  trackPWA(action, details = {}) {
    const pwaData = {
      event_category: 'PWA',
      event_label: action,
      ...details,
      session_id: this.sessionId
    };

    this.trackEvent('pwa_' + action, pwaData);
  }

  // Track formularios
  trackForm(formName, action, details = {}) {
    const formData = {
      event_category: 'Form',
      event_label: formName,
      form_action: action,
      ...details,
      session_id: this.sessionId
    };

    this.trackEvent('form_' + action, formData);
  }

  // Track llamadas telefónicas
  trackPhoneCall(source = 'unknown') {
    this.trackEvent('phone_call', {
      event_category: 'Contact',
      event_label: 'Phone Call',
      source: source,
      session_id: this.sessionId
    });

    // Facebook Pixel
    if (this.isFacebookPixelLoaded) {
      fbq('track', 'Contact');
    }
  }

  // Configurar tracking automático
  setupAutoTracking() {
    // Track clicks en elementos importantes
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const clickData = {
        event_category: 'Click',
        element_type: target.tagName.toLowerCase(),
        element_text: target.textContent?.slice(0, 50) || '',
        element_class: target.className || '',
        element_id: target.id || ''
      };

      // Incrementar contador de clicks
      const currentCount = parseInt(sessionStorage.getItem('clickCount') || '0');
      sessionStorage.setItem('clickCount', (currentCount + 1).toString());

      // Track clicks específicos
      if (target.href?.includes('tel:')) {
        this.trackPhoneCall('website');
      } else if (target.href?.includes('mailto:')) {
        this.trackEvent('email_click', clickData);
      } else if (target.href?.includes('wa.me')) {
        this.trackEvent('whatsapp_click', clickData);
      }
    });

    // Track scroll depth cada 25%
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = this.getScrollDepth();
      const milestone = Math.floor(scrollDepth / 25) * 25;
      
      if (milestone > maxScrollDepth && milestone > 0) {
        maxScrollDepth = milestone;
        this.trackEvent('scroll_depth', {
          event_category: 'Engagement',
          event_label: `${milestone}%`,
          scroll_depth: milestone
        });
      }
    });

    // Track time on page al salir
    window.addEventListener('beforeunload', () => {
      this.trackEngagement();
    });

    // Track performance cuando carga la página
    window.addEventListener('load', () => {
      setTimeout(() => this.trackPerformance(), 1000);
    });
  }

  // Obtener métricas del usuario
  getUserMetrics() {
    return {
      session_id: this.sessionId,
      time_on_site: Date.now() - this.startTime,
      page_views: parseInt(sessionStorage.getItem('pageViews') || '0'),
      clicks: this.getClicksCount(),
      scroll_depth: this.getScrollDepth(),
      device_type: this.getDeviceType(),
      connection_type: this.getConnectionType()
    };
  }

  // Detectar tipo de dispositivo
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Obtener tipo de conexión
  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }
}

// Exportar instancia singleton
export const analyticsService = new AnalyticsService();

// Hook para usar analytics en React
export const useAnalyticsTracking = () => {
  React.useEffect(() => {
    // Configurar tracking automático
    analyticsService.setupAutoTracking();
    
    // Incrementar contador de page views
    const currentViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    sessionStorage.setItem('pageViews', (currentViews + 1).toString());
  }, []);

  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackConversion: analyticsService.trackConversion.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
    trackForm: analyticsService.trackForm.bind(analyticsService),
    trackPWA: analyticsService.trackPWA.bind(analyticsService),
    trackSearch: analyticsService.trackSearch.bind(analyticsService),
    getUserMetrics: analyticsService.getUserMetrics.bind(analyticsService)
  };
};