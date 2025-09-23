# 🚀 Guía de Testing para DentalCare PWA

Esta guía te ayudará a validar que todas las mejoras implementadas funcionen correctamente.

## 📱 Testing PWA (Progressive Web App)

### 1. Verificar Instalación PWA
```bash
# Servir la aplicación en HTTPS (requerido para PWA)
npm run dev -- --host --https
```

**Pasos de Testing:**
1. ✅ Abrir Chrome/Edge en modo incógnito
2. ✅ Ir a `https://localhost:5173`
3. ✅ Buscar ícono de instalación en la barra de direcciones
4. ✅ Ver prompt "Agregar a pantalla de inicio"
5. ✅ Instalar y verificar que funciona offline

### 2. Service Worker
**Chrome DevTools:**
1. ✅ F12 → Application → Service Workers
2. ✅ Verificar que está registrado y activo
3. ✅ Test "Update on reload"
4. ✅ Verificar caché en Application → Storage

### 3. Manifest
**Verificaciones:**
1. ✅ F12 → Application → Manifest
2. ✅ Ver íconos cargados correctamente
3. ✅ Verificar shortcuts y screenshots
4. ✅ Comprobar theme_color y background_color

---

## 🔔 Testing Notificaciones

### 1. Configuración Firebase FCM
```bash
# Verificar variables de entorno
echo $VITE_FIREBASE_VAPID_KEY
```

**Checklist:**
1. ✅ Configurar VAPID key real en Firebase Console
2. ✅ Actualizar `.env` con la key
3. ✅ Verificar permisos de notificación
4. ✅ Test notificación de prueba

### 2. Testing en Navegador
```javascript
// Abrir DevTools Console y ejecutar:
notificationService.requestPermission()
  .then(permission => console.log('Permission:', permission));

// Programar notificación de prueba
notificationService.scheduleAppointmentReminder({
  id: 'test123',
  patientName: 'Paciente Test',
  date: new Date(Date.now() + 60000), // 1 minuto
  service: 'Consulta General'
});
```

### 3. Testing Push Notifications
**Firebase Console:**
1. ✅ Ir a Cloud Messaging
2. ✅ Crear campaña de test
3. ✅ Enviar a device token específico
4. ✅ Verificar recepción

---

## 🎨 Testing Mobile UX

### 1. Responsive Design
**Breakpoints a Testing:**
```css
/* Mobile: 320px - 767px */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */
```

**Chrome DevTools:**
1. ✅ F12 → Toggle device toolbar
2. ✅ Test iPhone SE, iPhone 12 Pro, iPad
3. ✅ Verificar touch targets (mínimo 44px)
4. ✅ Test orientación landscape/portrait

### 2. Gestos Touch
```javascript
// Test en consola del navegador móvil:
// Swipe gestures
document.addEventListener('touchstart', e => console.log('Touch start:', e.touches.length));
document.addEventListener('touchmove', e => console.log('Touch move'));
document.addEventListener('touchend', e => console.log('Touch end'));

// Pull to refresh
window.addEventListener('pulltorefresh', () => console.log('Pull to refresh triggered'));
```

### 3. Haptic Feedback (móviles reales)
```javascript
// Test vibración
if ('vibrate' in navigator) {
  navigator.vibrate([100, 50, 100]); // Pattern: vibrar, pausa, vibrar
}
```

---

## ⚡ Testing Performance

### 1. Lighthouse Audit
```bash
# Instalar lighthouse CLI
npm install -g lighthouse

# Audit completo
lighthouse https://localhost:5173 --view
```

**Métricas objetivo:**
- ✅ Performance: >90
- ✅ Accessibility: >95
- ✅ Best Practices: >90
- ✅ SEO: >90
- ✅ PWA: 100

### 2. Lazy Loading
**DevTools Network:**
1. ✅ F12 → Network → Disable cache
2. ✅ Recargar página inicial
3. ✅ Verificar que solo se cargan chunks necesarios
4. ✅ Navegar y ver carga dinámica

### 3. Image Optimization
**Verificaciones:**
1. ✅ WebP format en navegadores compatibles
2. ✅ Fallback a JPG/PNG
3. ✅ Lazy loading de imágenes
4. ✅ Responsive images (srcset)

---

## 🔄 Testing Real-time Features

### 1. Firestore Real-time
```javascript
// Test en consola:
import { realtimeService } from './src/services/realtimeService.js';

// Escuchar cambios en citas
realtimeService.subscribeToAppointments(appointments => {
  console.log('Appointments updated:', appointments);
});

// Crear cita de prueba
realtimeService.createAppointment({
  patientName: 'Test Patient',
  date: new Date(),
  service: 'Consulta General'
});
```

### 2. Connection Status
```javascript
// Simular desconexión
window.addEventListener('online', () => console.log('Back online'));
window.addEventListener('offline', () => console.log('Gone offline'));

// Test manual: Desactivar WiFi y verificar UI
```

### 3. Optimistic Updates
**Testing Flow:**
1. ✅ Crear cita offline
2. ✅ Verificar feedback visual
3. ✅ Reconectar y ver sincronización
4. ✅ Verificar data consistency

---

## 🔍 Testing SEO

### 1. Meta Tags
```bash
# Verificar con curl
curl -s https://localhost:5173 | grep -i "<meta"
curl -s https://localhost:5173/servicios | grep -i "<title"
```

### 2. Structured Data
**Google Rich Results Test:**
1. ✅ Ir a https://search.google.com/test/rich-results
2. ✅ Introducir URL del sitio
3. ✅ Verificar LocalBusiness schema
4. ✅ Check Medical Organization data

### 3. Breadcrumbs
**Testing navegación:**
1. ✅ Inicio → Servicios → Servicio específico
2. ✅ Verificar breadcrumb navigation
3. ✅ Test Schema.org BreadcrumbList
4. ✅ Accessibility con lectores de pantalla

---

## 📊 Testing Analytics

### 1. Google Analytics 4
**Real-time Testing:**
1. ✅ Google Analytics → Reports → Realtime
2. ✅ Navegar por el sitio
3. ✅ Verificar events en tiempo real
4. ✅ Test conversiones

### 2. Custom Events
```javascript
// Test en consola:
import { analyticsService } from './src/services/analyticsService.js';

// Test eventos personalizados
analyticsService.trackEvent('test_event', {
  category: 'Testing',
  action: 'Manual Test',
  value: 1
});

// Test conversión
analyticsService.trackConversion('appointment_booked', 500, 'MXN');
```

### 3. Facebook Pixel
**Facebook Events Manager:**
1. ✅ Ir a Facebook Business → Events Manager
2. ✅ Test Events tab
3. ✅ Verificar PageView events
4. ✅ Test custom events

---

## 🛠️ Testing Tools Adicionales

### 1. PWA Testing
```bash
# PWA Asset Generator
npx pwa-asset-generator public/icons/icon-512.svg public/icons --icon-only

# Workbox CLI para service workers
npx workbox wizard
```

### 2. Accessibility Testing
```bash
# axe-core CLI
npm install -g @axe-core/cli
axe https://localhost:5173
```

### 3. Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 🚨 Common Issues & Solutions

### PWA No Instala
- ✅ Verificar HTTPS (no localhost HTTP)
- ✅ Service worker registrado
- ✅ Manifest válido
- ✅ Iconos correctos

### Notificaciones No Funcionan
- ✅ VAPID key configurada
- ✅ Permisos otorgados
- ✅ Service worker registrado
- ✅ HTTPS requerido

### Performance Baja
- ✅ Verificar bundle size
- ✅ Lazy loading implementado
- ✅ Images optimizadas
- ✅ Service worker caching

### Analytics No Trackea
- ✅ Tracking IDs correctos
- ✅ Ad blockers desactivados
- ✅ Consent dado
- ✅ JavaScript habilitado

---

## 📋 Testing Checklist Final

### Pre-Launch Testing
- [ ] PWA instala correctamente
- [ ] Notificaciones funcionan
- [ ] Mobile UX optimizada
- [ ] Performance >90 en Lighthouse
- [ ] Real-time updates funcionan
- [ ] SEO tags correctos
- [ ] Analytics tracking activo
- [ ] Error boundaries capturan errores
- [ ] Offline functionality funciona
- [ ] Cross-browser testing completado

### Production Readiness
- [ ] Environment variables configuradas
- [ ] Firebase proyecto production
- [ ] Domain HTTPS configurado
- [ ] CDN para assets estáticos
- [ ] Monitoring y error tracking
- [ ] Backup strategy implementada

**¡Tu sitio estará listo para competir con cualquier clínica dental moderna! 🦷✨**