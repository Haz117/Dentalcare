// Servicios adicionales para verificación de email
import { 
  sendEmailVerification,
  applyActionCode,
  checkActionCode
} from 'firebase/auth';
import { auth } from '../firebase';

// Enviar email de verificación
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return { success: true, message: 'Email de verificación enviado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verificar código de verificación
export const verifyEmailCode = async (actionCode) => {
  try {
    await applyActionCode(auth, actionCode);
    return { success: true, message: 'Email verificado exitosamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Revisar si el email del usuario está verificado
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Recargar usuario para obtener estado actualizado
export const reloadUser = async () => {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return { success: true, emailVerified: auth.currentUser.emailVerified };
    }
    return { success: false, error: 'No hay usuario autenticado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};