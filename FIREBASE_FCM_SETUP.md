# 🔥 Firebase Cloud Messaging Setup Guide

## Pasos para configurar FCM completamente:

### 1. 📱 Generar VAPID Key en Firebase Console

```bash
# Ve a Firebase Console > Project Settings > Cloud Messaging
# En "Web configuration" > Generate key pair
# Copia la VAPID key generada
```

### 2. 🔑 Configurar Variables de Entorno

Actualiza tu archivo `.env`:

```env
# Tu VAPID key real de Firebase
VITE_FIREBASE_VAPID_KEY=tu_vapid_key_real_aqui
```

### 3. 🛠️ Habilitar Firebase Cloud Messaging

En Firebase Console:
- Ve a **Cloud Messaging**
- Habilita el servicio
- Configura el certificado Apple (para iOS PWA)

### 4. 📱 Configurar Dominio para Notificaciones

En Firebase Console > Project Settings > Cloud Messaging:
- Añade tu dominio en "Authorized domains"
- Para desarrollo: `localhost:3000`
- Para producción: `tu-dominio.com`

### 5. 🔐 Configurar Service Worker

El archivo `firebase-messaging-sw.js` ya está configurado.
Asegúrate de que esté en `/public/` y accesible desde `/firebase-messaging-sw.js`

### 6. 🧪 Probar Notificaciones

```javascript
// En la consola del navegador:
import { notificationService } from './src/services/notificationService.js';

// Solicitar permisos
await notificationService.requestPermission();

// Enviar notificación de prueba
await notificationService.scheduleLocalNotification(
  'Test DentalCare',
  'Esta es una notificación de prueba',
  0,
  'test'
);
```

### 7. 📊 Enviar Notificaciones desde el Servidor

```javascript
// Ejemplo con Node.js y Firebase Admin SDK
const admin = require('firebase-admin');

const message = {
  notification: {
    title: 'Recordatorio de Cita',
    body: 'Tu cita es en 2 horas'
  },
  data: {
    type: 'appointment_reminder',
    appointmentId: '123',
    url: '/paciente?appointment=123'
  },
  token: 'token_del_usuario'
};

admin.messaging().send(message);
```

### 8. 🔄 Configurar Notificaciones Automáticas

Las notificaciones se programan automáticamente cuando:
- Se confirma una cita (24h y 2h antes)
- Se cancela una cita
- Se requiere seguimiento

### 9. 📱 Testing en Dispositivos

Para testing completo:
1. Deploy a HTTPS (Firebase Hosting, Netlify, etc.)
2. Instalar PWA en móvil
3. Probar notificaciones en background

### 10. 🎯 Configuración Avanzada

Para producción, también configura:
- **Cloud Functions** para envío automático
- **Firestore triggers** para notificaciones en tiempo real
- **Analytics** para tracking de notificaciones