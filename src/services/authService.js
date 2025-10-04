import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../firebase';

// Verificar si un email ya está registrado
export const checkEmailExists = async (email) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return {
      success: true,
      exists: signInMethods.length > 0,
      methods: signInMethods
    };
  } catch (error) {
    // Si hay error, asumimos que el email no existe
    return {
      success: true,
      exists: false,
      error: error.message
    };
  }
};

// Función helper para traducir códigos de error
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return '📧 Este email ya está registrado. ¿Quieres iniciar sesión en su lugar?';
    case 'auth/weak-password':
      return '🔒 La contraseña es muy débil. Usa al menos 6 caracteres con números y letras.';
    case 'auth/invalid-email':
      return '📧 El formato del email no es válido. Ejemplo: tu@email.com';
    case 'auth/operation-not-allowed':
      return '🚫 El registro de usuarios no está habilitado. Contacta al administrador.';
    case 'auth/too-many-requests':
      return '⏰ Demasiados intentos fallidos. Intenta de nuevo en unos minutos.';
    case 'auth/user-not-found':
      return '👤 No existe una cuenta con este email. ¿Quieres registrarte?';
    case 'auth/wrong-password':
      return '🔑 Contraseña incorrecta. Intenta de nuevo o recupera tu contraseña.';
    case 'auth/invalid-credential':
      return '🚫 Email o contraseña incorrectos. Verifica tus datos.';
    case 'auth/network-request-failed':
      return '🌐 Error de conexión. Verifica tu internet e intenta de nuevo.';
    default:
      return error.message || '❌ Error desconocido al procesar la solicitud.';
  }
};

// Registrar usuario
export const registerUser = async (email, password, displayName) => {
  try {
    console.log('🔄 Iniciando registro para:', email);
    
    // 1. Intentar crear el usuario directamente - Firebase maneja la duplicación automáticamente
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Firebase:', user.uid);
    
    // 2. Actualizar el perfil del usuario con el nombre
    if (displayName && displayName.trim()) {
      try {
        await updateProfile(user, {
          displayName: displayName.trim()
        });
        console.log('✅ Perfil actualizado con displayName:', displayName);
      } catch (profileError) {
        console.warn('⚠️ Error al actualizar perfil, pero cuenta creada:', profileError.message);
      }
    }

    // 3. Enviar email de verificación automáticamente
    try {
      await sendEmailVerification(user);
      console.log('📧 Email de verificación enviado a:', email);
    } catch (verificationError) {
      console.warn('⚠️ No se pudo enviar email de verificación:', verificationError.message);
    }
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
        emailVerified: user.emailVerified
      },
      message: `¡Cuenta creada exitosamente! Se envió un email de verificación a ${email}`
    };
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return { 
      success: false, 
      error: getErrorMessage(error),
      errorCode: error.code
    };
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    console.log('🔄 Iniciando sesión para:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Sesión iniciada correctamente:', userCredential.user.uid);
    return { 
      success: true, 
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        emailVerified: userCredential.user.emailVerified
      }
    };
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    return { 
      success: false, 
      error: getErrorMessage(error),
      errorCode: error.code
    };
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Escuchar cambios en el estado de autenticación
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};