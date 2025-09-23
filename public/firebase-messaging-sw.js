// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firebase Cloud Messaging
const messaging = firebase.messaging();

// Manejar notificaciones en background
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Notificación recibida en background:', payload);

  const notificationTitle = payload.notification?.title || 'DentalCare';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'dentalcare-notification',
    data: {
      url: payload.data?.url || '/',
      appointmentId: payload.data?.appointmentId,
      type: payload.data?.type || 'general'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Cita',
        icon: '/icons/calendar-icon.png'
      },
      {
        action: 'remind',
        title: 'Recordar Después',
        icon: '/icons/clock-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Descartar'
      }
    ],
    vibrate: [200, 100, 200],
    silent: false,
    requireInteraction: true,
    timestamp: Date.now()
  };

  // Personalizar según el tipo de notificación
  switch (payload.data?.type) {
    case 'appointment_reminder':
      notificationOptions.body = `Recordatorio: Tu cita es en ${payload.data?.time || '1 hora'}`;
      notificationOptions.tag = 'appointment-reminder';
      notificationOptions.vibrate = [100, 50, 100];
      break;
    
    case 'appointment_confirmed':
      notificationOptions.body = `Tu cita ha sido confirmada para ${payload.data?.date || 'mañana'}`;
      notificationOptions.tag = 'appointment-confirmed';
      notificationOptions.vibrate = [200];
      break;
    
    case 'appointment_cancelled':
      notificationOptions.body = `Tu cita del ${payload.data?.date || 'hoy'} ha sido cancelada`;
      notificationOptions.tag = 'appointment-cancelled';
      notificationOptions.vibrate = [300, 100, 300];
      break;
    
    case 'follow_up':
      notificationOptions.body = 'Es hora de tu seguimiento post-tratamiento';
      notificationOptions.tag = 'follow-up';
      break;
    
    default:
      break;
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Click en notificación:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  switch (action) {
    case 'view':
      // Abrir la página de la cita específica
      if (data.appointmentId) {
        event.waitUntil(
          clients.openWindow(`/paciente?appointment=${data.appointmentId}`)
        );
      } else {
        event.waitUntil(clients.openWindow(data.url || '/'));
      }
      break;
    
    case 'remind':
      // Programar recordatorio para más tarde (15 minutos)
      event.waitUntil(
        self.registration.showNotification('Recordatorio programado', {
          body: 'Te recordaremos nuevamente en 15 minutos',
          icon: '/icons/icon-192x192.png',
          tag: 'reminder-scheduled',
          vibrate: [100],
          silent: true
        })
      );
      
      // Aquí podrías enviar una señal al servidor para reprogramar
      break;
    
    case 'dismiss':
      // Solo cerrar, ya está manejado arriba
      break;
    
    default:
      // Click en la notificación sin acción específica
      event.waitUntil(
        clients.openWindow(data.url || '/')
      );
      break;
  }
});

// Manejar cuando se cierra una notificación
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificación cerrada:', event.notification.tag);
  
  // Opcional: enviar analytics sobre notificaciones cerradas
  if (event.notification.data?.type === 'appointment_reminder') {
    // Registrar que el usuario cerró un recordatorio
    console.log('Usuario cerró recordatorio de cita');
  }
});