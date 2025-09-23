# 🔥 Guía de Configuración y Pruebas de Firebase

## ✅ Estado Actual
Tu aplicación ya está configurada con Firebase:
- ✅ Variables de entorno configuradas en `.env`
- ✅ Archivo `firebase.js` configurado correctamente
- ✅ Servicios de Firebase importados y exportados
- ✅ Reglas de Firestore actualizadas para permitir citas públicas

## 🚀 Pasos para Probar Firebase

### 1. Acceder al Panel de Pruebas
Con tu servidor ejecutándose, ve a:
```
http://localhost:3001/firebase-test
```

### 2. Ejecutar Pruebas
En el panel encontrarás 3 pruebas:

#### 🔗 Prueba de Conexión General
- Crea una cita de prueba en Firestore
- Lee las citas existentes
- Verifica que todo funcione correctamente

#### 🔒 Prueba de Reglas de Seguridad
- Verifica que las reglas de Firestore estén funcionando
- Prueba permisos de lectura y escritura

#### 🧹 Limpieza de Datos de Prueba
- Identifica datos de prueba creados
- Permite limpiar la base de datos

### 3. Probar el Formulario de Citas
1. Ve a: `http://localhost:3001/agendar`
2. Llena el formulario completamente
3. Envía una cita de prueba
4. Revisa si se guarda en Firebase

## ⚙️ Configuración de Firebase Console

### Paso 1: Actualizar Reglas de Firestore
En Firebase Console > Firestore Database > Rules, asegúrate de que tengas estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{appointmentId} {
      // Permitir creación pública de citas (para formulario web)
      allow create: if (request.auth != null && request.auth.uid == resource.data.userId)
        || (request.auth == null && isValidPublicAppointment(resource.data))
        && isValidAppointment(resource.data);
      
      // Lectura para propietarios y admins
      allow read: if (request.auth != null && request.auth.uid == resource.data.userId)
        || (request.auth != null && isAdmin(request.auth));
      
      // Actualización para propietarios y admins
      allow update: if (request.auth != null && request.auth.uid == resource.data.userId)
        || (request.auth != null && isAdmin(request.auth))
        && isValidAppointmentUpdate(request.resource.data);
      
      // Eliminación para propietarios y admins
      allow delete: if (request.auth != null && request.auth.uid == resource.data.userId)
        || (request.auth != null && isAdmin(request.auth));
    }
    
    // Funciones de validación...
    function isValidAppointment(data) {
      return data.keys().hasAll(['date', 'time', 'service', 'status'])
        && data.date is string
        && data.time is string
        && data.service is string
        && data.status in ['pending', 'confirmed', 'cancelled', 'completed', 'test'];
    }
    
    function isValidPublicAppointment(data) {
      return data.keys().hasAll(['date', 'time', 'service', 'firstName', 'lastName', 'email', 'phone'])
        && data.firstName is string
        && data.lastName is string
        && data.email is string
        && data.phone is string
        && data.status == 'pending';
    }
    
    function isAdmin(auth) {
      return auth.token.admin == true 
        || auth.token.email == 'admin@dentalcare.com';
    }
  }
}
```

### Paso 2: Configurar Authentication (Opcional)
Si quieres usar autenticación:
1. Ve a Firebase Console > Authentication
2. Habilita "Email/Password" 
3. Opcionalmente habilita Google Sign-in

### Paso 3: Verificar Firestore Database
1. Ve a Firebase Console > Firestore Database
2. Debe estar en modo "production" con las reglas que configuramos
3. Verifica que se esté creando la colección "appointments"

## 🐛 Solución de Problemas Comunes

### Error: "Permission denied"
- Verifica que las reglas de Firestore estén actualizadas
- Asegúrate de que el proyecto de Firebase esté activo

### Error: "Firebase not initialized"
- Verifica que todas las variables de entorno estén configuradas
- Revisa que no haya typos en las claves de API

### Error de CORS
- Asegúrate de que el dominio localhost esté autorizado en Firebase Console

## ✅ Checklist de Verificación

- [ ] Servidor ejecutándose en http://localhost:3001
- [ ] Panel de pruebas accesible en /firebase-test
- [ ] Prueba de conexión exitosa
- [ ] Formulario de citas funcional
- [ ] Datos guardándose en Firestore
- [ ] Reglas de seguridad funcionando

## 📞 Próximos Pasos
Una vez que confirmes que Firebase funciona:
1. Puedes remover la ruta `/firebase-test` del código de producción
2. Configurar notificaciones por email (opcional)
3. Agregar más validaciones según tus necesidades
4. Configurar backups automáticos de Firestore

¡Tu aplicación dental está lista para recibir citas reales! 🦷✨