# 🔥 Guía de Solución: Creación de Usuarios

## ❌ Problema Identificado
- **Error**: `auth/operation-not-allowed`
- **Causa**: Firebase Authentication no está habilitado
- **Específicamente**: El método "Email/Password" no está configurado

## ✅ Solución

### 1. Firebase Console Configuration
- Ve a: https://console.firebase.google.com/
- Proyecto: `dentalcare-3b2ef`
- Navega: Authentication > Sign-in method
- **Habilita**: Email/Password

### 2. Verificar Dominios Autorizados
- En la misma página, verifica "Authorized domains"
- Debe incluir: `localhost` y `dentalcare-3b2ef.firebaseapp.com`

### 3. Comandos de Verificación
```bash
# Probar autenticación
node test-auth.js

# Iniciar aplicación
npm run dev
```

### 4. Código de Test
- Archivo: `test-auth.js`
- Propósito: Verificar que la autenticación funcione
- Resultado esperado: Usuario creado y login exitoso

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `auth/operation-not-allowed` | Email/Password no habilitado | Habilitarlo en Firebase Console |
| `auth/invalid-api-key` | API Key incorrecta | Verificar archivo `.env` |
| `auth/network-request-failed` | Problema de red/dominio | Verificar dominios autorizados |

## 📞 Verificación Final
Después de la configuración:
1. Ejecutar `node test-auth.js` debe ser exitoso
2. La aplicación debe permitir registro de usuarios
3. Los usuarios deben aparecer en Firebase Console > Authentication > Users