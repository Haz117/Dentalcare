// Test de autenticación Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

console.log('🔄 Iniciando prueba de autenticación Firebase...');

try {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase inicializado correctamente');
  console.log('🔐 Auth domain:', firebaseConfig.authDomain);
  
  // Intentar crear un usuario de prueba
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  console.log('👤 Intentando crear usuario de prueba...');
  console.log('📧 Email:', testEmail);
  
  const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
  console.log('✅ Usuario creado exitosamente!');
  console.log('🆔 UID:', userCredential.user.uid);
  console.log('📧 Email:', userCredential.user.email);
  
  // Intentar hacer login con el usuario creado
  console.log('🔑 Intentando hacer login...');
  const loginResult = await signInWithEmailAndPassword(auth, testEmail, testPassword);
  console.log('✅ Login exitoso!');
  
  console.log('🎉 Firebase Authentication está funcionando correctamente!');
  
} catch (error) {
  console.error('❌ Error en autenticación Firebase:', error);
  console.error('Código de error:', error.code);
  console.error('Mensaje:', error.message);
  
  if (error.code === 'auth/configuration-not-found') {
    console.error('⚠️ PROBLEMA: Firebase Authentication no está configurado correctamente.');
    console.error('   Verifica en Firebase Console:');
    console.error('   1. Authentication > Sign-in method');
    console.error('   2. Habilita "Email/Password"');
  } else if (error.code === 'auth/invalid-api-key') {
    console.error('⚠️ PROBLEMA: API Key inválida.');
  } else if (error.code === 'auth/network-request-failed') {
    console.error('⚠️ PROBLEMA: Error de red o configuración de dominio.');
  }
}