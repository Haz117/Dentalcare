import React from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '../firebase';

// Inicializar Firebase Cloud Messaging
const messaging = getMessaging(app);

// Configuración para notificaciones
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'tu_vapid_key_aqui';

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.token = null;
    this.onMessageCallback = null;
  }

  // Verificar soporte de notificaciones
  isNotificationSupported() {
    return this.isSupported;
  }

  // Solicitar permisos de notificación
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('❌ Notificaciones no soportadas en este navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('✅ Permisos de notificación concedidos');
        await this.getRegistrationToken();
        return true;
      } else {
        console.log('❌ Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al solicitar permisos:', error);
      return false;
    }
  }

  // Obtener token de registro
  async getRegistrationToken() {
    if (!this.isSupported || this.permission !== 'granted') {
      return null;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });

      if (token) {
        console.log('🔑 Token FCM obtenido:', token);
        this.token = token;
        
        // Guardar token en localStorage para persistencia
        localStorage.setItem('fcm_token', token);
        
        // Aquí enviarías el token a tu servidor
        await this.sendTokenToServer(token);
        
        return token;
      } else {
        console.log('❌ No se pudo obtener el token FCM');
        return null;
      }
    } catch (error) {
      console.error('❌ Error al obtener token FCM:', error);
      return null;
    }
  }

  // Enviar token al servidor
  async sendTokenToServer(token) {
    try {
      // Aquí harías la llamada a tu API para guardar el token
      console.log('📤 Enviando token al servidor:', token);
      
      // Ejemplo de llamada API:
      /*
      const response = await fetch('/api/notifications/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userId: getCurrentUserId(),
          device: this.getDeviceInfo()
        })
      });
      */
      
    } catch (error) {
      console.error('❌ Error al enviar token:', error);
    }
  }

  // Configurar listener para mensajes en foreground
  setupForegroundMessageListener(callback) {
    if (!this.isSupported) return;

    this.onMessageCallback = callback;
    
    onMessage(messaging, (payload) => {
      console.log('📱 Mensaje recibido en foreground:', payload);
      
      // Mostrar notificación personalizada en foreground
      this.showForegroundNotification(payload);
      
      // Ejecutar callback si existe
      if (this.onMessageCallback) {
        this.onMessageCallback(payload);
      }
    });
  }

  // Mostrar notificación en foreground
  showForegroundNotification(payload) {
    const title = payload.notification?.title || 'DentalCare';
    const options = {
      body: payload.notification?.body || 'Nueva notificación',
      icon: payload.notification?.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: payload.data?.type || 'general',
      data: payload.data,
      vibrate: [200, 100, 200],
      requireInteraction: true
    };

    // Crear notificación del navegador
    if (this.permission === 'granted') {
      new Notification(title, options);
    }

    // También mostrar notificación in-app
    this.showInAppNotification(payload);
  }

  // Mostrar notificación dentro de la app
  showInAppNotification(payload) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 max-w-sm z-50 animate-slide-in-right';
    
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <img src="/icons/icon-48x48.png" alt="DentalCare" class="w-8 h-8 rounded">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-900 truncate">
            ${payload.notification?.title || 'DentalCare'}
          </h4>
          <p class="text-sm text-gray-600 mt-1">
            ${payload.notification?.body || 'Nueva notificación'}
          </p>
          ${payload.data?.appointmentId ? `
            <button onclick="window.location.href='/paciente?appointment=${payload.data.appointmentId}'" class="mt-2 text-xs text-blue-600 hover:text-blue-800">
              Ver Cita →
            </button>
          ` : ''}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Programar notificaciones locales
  async scheduleLocalNotification(title, body, delay = 0, tag = 'local') {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    const showNotification = () => {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag,
        vibrate: [200, 100, 200]
      });
    };

    if (delay > 0) {
      setTimeout(showNotification, delay);
    } else {
      showNotification();
    }

    return true;
  }

  // Obtener información del dispositivo
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: {
        width: screen.width,
        height: screen.height
      }
    };
  }

  // Desactivar notificaciones
  async disableNotifications() {
    if (this.token) {
      // Informar al servidor que se desactive este token
      await this.removeTokenFromServer(this.token);
    }
    
    localStorage.removeItem('fcm_token');
    this.token = null;
    
    console.log('🔕 Notificaciones desactivadas');
  }

  // Remover token del servidor
  async removeTokenFromServer(token) {
    try {
      console.log('📤 Removiendo token del servidor:', token);
      
      // Aquí harías la llamada a tu API para remover el token
      /*
      await fetch('/api/notifications/token', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
      */
      
    } catch (error) {
      console.error('❌ Error al remover token:', error);
    }
  }

  // Programar recordatorios de citas
  async scheduleAppointmentReminders(appointmentData) {
    const { date, time, id } = appointmentData;
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    // Recordatorio 24 horas antes
    const reminder24h = new Date(appointmentDateTime.getTime() - (24 * 60 * 60 * 1000));
    if (reminder24h > now) {
      await this.scheduleLocalNotification(
        'Recordatorio de Cita - 24h',
        `Tu cita dental es mañana a las ${time}`,
        reminder24h.getTime() - now.getTime(),
        `appointment-24h-${id}`
      );
    }

    // Recordatorio 2 horas antes
    const reminder2h = new Date(appointmentDateTime.getTime() - (2 * 60 * 60 * 1000));
    if (reminder2h > now) {
      await this.scheduleLocalNotification(
        'Recordatorio de Cita - 2h',
        `Tu cita dental es en 2 horas. Recuerda llegar 15 minutos antes.`,
        reminder2h.getTime() - now.getTime(),
        `appointment-2h-${id}`
      );
    }
  }
}

// Exportar instancia singleton
export const notificationService = new NotificationService();

// Hook para usar el servicio de notificaciones
export const useNotifications = () => {
  const [hasPermission, setHasPermission] = React.useState(
    notificationService.permission === 'granted'
  );
  const [isSupported, setIsSupported] = React.useState(
    notificationService.isSupported
  );

  React.useEffect(() => {
    setIsSupported(notificationService.isNotificationSupported());
    setHasPermission(notificationService.permission === 'granted');

    // Configurar listener de mensajes
    notificationService.setupForegroundMessageListener((payload) => {
      console.log('📱 Nueva notificación recibida:', payload);
    });
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setHasPermission(granted);
    return granted;
  };

  const disableNotifications = async () => {
    await notificationService.disableNotifications();
    setHasPermission(false);
  };

  const scheduleAppointmentReminders = async (appointmentData) => {
    return await notificationService.scheduleAppointmentReminders(appointmentData);
  };

  return {
    isSupported,
    hasPermission,
    requestPermission,
    disableNotifications,
    scheduleAppointmentReminders
  };
};