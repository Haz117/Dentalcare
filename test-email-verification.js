// Test para verificar emails de verificación de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

console.log('🔄 Iniciando prueba de emails de verificación...');

try {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase inicializado correctamente');
  
  // Intentar crear un usuario de prueba para verificar emails
  const testEmail = `test_email_${Date.now()}@gmail.com`; // Usar Gmail para prueba
  const testPassword = 'testpassword123';
  
  console.log('👤 Creando usuario de prueba para verificar emails...');
  console.log('📧 Email:', testEmail);
  
  const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
  console.log('✅ Usuario creado exitosamente!');
  console.log('🆔 UID:', userCredential.user.uid);
  
  // Intentar enviar email de verificación
  console.log('📧 Enviando email de verificación...');
  try {
    await sendEmailVerification(userCredential.user);
    console.log('✅ Email de verificación enviado exitosamente!');
    console.log('📬 Revisa la bandeja de entrada (y SPAM) de:', testEmail);
    console.log('⏰ El email puede tardar hasta 5-10 minutos en llegar');
  } catch (emailError) {
    console.error('❌ Error al enviar email de verificación:', emailError);
    console.error('Código:', emailError.code);
    console.error('Mensaje:', emailError.message);
    
    if (emailError.code === 'auth/operation-not-allowed') {
      console.error('⚠️ PROBLEMA: Los emails de verificación no están habilitados en Firebase Console.');
      console.error('📝 SOLUCIÓN: Ve a Firebase Console > Authentication > Templates y configura los emails.');
    }
  }
  
} catch (error) {
  console.error('❌ Error general:', error);
  console.error('Código de error:', error.code);
  console.error('Mensaje:', error.message);
  
  if (error.code === 'auth/operation-not-allowed') {
    console.error('⚠️ PROBLEMA: Email/Password authentication no está habilitado.');
    console.error('📝 SOLUCIÓN: Ve a Firebase Console > Authentication > Sign-in method y habilita Email/Password.');
  }
}