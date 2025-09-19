# Guía de Configuración de Firebase Console

## 📋 Pasos para Configurar Autenticación

### 1. Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **dentalcare-3b2ef**
3. En el menú lateral, haz clic en **"Authentication"**

### 2. Configurar Métodos de Autenticación

#### Habilitar Email/Password:
1. Ve a la pestaña **"Sign-in method"**
2. Busca **"Email/Password"** en la lista de proveedores
3. Haz clic en **"Email/Password"**
4. Activa el toggle **"Enable"**
5. **NO** actives "Email link (passwordless sign-in)" por ahora
6. Haz clic en **"Save"**

#### Configurar Dominio Autorizado:
1. Baja hasta la sección **"Authorized domains"**
2. Agrega estos dominios:
   - `localhost` (para desarrollo)
   - Tu dominio de producción cuando lo tengas
3. Haz clic en **"Add domain"** si necesitas agregar más

### 3. Configurar Plantillas de Email (Opcional)
1. Ve a la pestaña **"Templates"**
2. Personaliza los emails de:
   - Verificación de email
   - Recuperación de contraseña
   - Cambio de email

## 📋 Pasos para Configurar Firestore

### 1. Acceder a Firestore
1. En Firebase Console, ve a **"Firestore Database"**
2. Si no has creado la base de datos, haz clic en **"Create database"**

### 2. Configurar Modo de Inicio
- Selecciona **"Start in test mode"** por ahora
- Esto permite lectura/escritura por 30 días
- Cambiaremos a reglas de producción después

### 3. Seleccionar Ubicación
- Elige la región más cercana a tus usuarios
- Para México/Centroamérica: **us-central1**
- **IMPORTANTE**: No podrás cambiar esto después

### 4. Aplicar Reglas de Seguridad
1. Ve a la pestaña **"Rules"**
2. Copia y pega el contenido del archivo `firestore-basic.rules`
3. Haz clic en **"Publish"**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /clinic/{document} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## ⚠️ Configuraciones de Seguridad Importantes

### Configurar Límites de Uso
1. Ve a **"Usage and billing"**
2. Configura alertas de uso
3. Establece límites diarios/mensuales

### Configurar Cuotas
1. Ve a **"Database"** > **"Usage"**
2. Monitorea:
   - Lecturas por día
   - Escrituras por día
   - Eliminaciones por día

## 🔧 Configuración Adicional Recomendada

### Habilitar Analytics (Ya configurado)
- Firebase Analytics ya está configurado en tu proyecto
- Puedes ver estadísticas en la sección **"Analytics"**

### Configurar Performance Monitoring
1. Ve a **"Performance"**
2. Sigue las instrucciones para habilitar
3. Agrega el SDK si es necesario

### Configurar Crashlytics (Opcional)
1. Ve a **"Crashlytics"**
2. Sigue la guía de configuración
3. Útil para detectar errores en producción

## 📱 Verificar Configuración

### Probar Autenticación:
1. Ve a **"Authentication"** > **"Users"**
2. Registra un usuario de prueba desde tu app
3. Verifica que aparezca en la lista

### Probar Firestore:
1. Ve a **"Firestore Database"** > **"Data"**
2. Crea un documento de prueba
3. Verifica que se guarde correctamente

## 🚨 Notas Importantes

1. **Nunca compartas** tus credenciales de Firebase públicamente
2. **Siempre usa** variables de entorno para credenciales
3. **Revisa** las reglas de seguridad regularmente
4. **Monitorea** el uso para evitar costos inesperados
5. **Haz backups** regulares de tus datos importantes

## 📞 Soporte

Si tienes problemas:
- Consulta la [documentación oficial de Firebase](https://firebase.google.com/docs)
- Revisa la [consola de errores](https://console.firebase.google.com/) de tu proyecto
- Verifica los logs en la sección **"Functions"** si usas Cloud Functions