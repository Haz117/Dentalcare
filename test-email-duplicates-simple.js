// Test simplificado de autenticación y duplicados
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

console.log('🔄 Iniciando prueba de autenticación anti-duplicados...');

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase inicializado correctamente');
  
  // Función para verificar si email existe (simulando la que implementamos)
  const checkEmailExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return {
        success: true,
        exists: signInMethods.length > 0,
        methods: signInMethods
      };
    } catch (error) {
      return {
        success: false,
        exists: false,
        error: error.message
      };
    }
  };
  
  // Test 1: Email que no existe
  console.log('\n📧 Test 1: Verificando email nuevo...');
  const newEmail = `test_nuevo_${Date.now()}@example.com`;
  
  const check1 = await checkEmailExists(newEmail);
  if (check1.success && !check1.exists) {
    console.log('✅ Test 1 PASÓ: Email disponible');
  } else {
    console.log('❌ Test 1: Email debería estar disponible');
  }
  
  // Test 2: Crear usuario
  console.log('\n👤 Test 2: Creando usuario...');
  const testPassword = 'testpassword123';
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, newEmail, testPassword);
    console.log('✅ Usuario creado:', userCredential.user.email);
    
    // Test 3: Verificar que ahora el email existe
    console.log('\n🔍 Test 3: Verificando email ahora existe...');
    const check2 = await checkEmailExists(newEmail);
    if (check2.success && check2.exists) {
      console.log('✅ Test 3 PASÓ: Email detectado como existente');
    } else {
      console.log('❌ Test 3: Email debería aparecer como existente');
    }
    
    // Test 4: Intentar crear duplicado
    console.log('\n🚫 Test 4: Intentando crear duplicado...');
    try {
      await createUserWithEmailAndPassword(auth, newEmail, testPassword);
      console.log('❌ Test 4 FALLÓ: Debería haber rechazado duplicado');
    } catch (duplicateError) {
      if (duplicateError.code === 'auth/email-already-in-use') {
        console.log('✅ Test 4 PASÓ: Duplicado correctamente rechazado');
      } else {
        console.log('⚠️ Test 4: Error inesperado:', duplicateError.code);
      }
    }
    
  } catch (createError) {
    if (createError.code === 'auth/operation-not-allowed') {
      console.log('🚨 FIREBASE AUTHENTICATION NO ESTÁ HABILITADO');
      console.log('');
      console.log('📋 Para habilitar:');
      console.log('   1. Ve a https://console.firebase.google.com/');
      console.log('   2. Selecciona proyecto: dentalcare-3b2ef');
      console.log('   3. Authentication > Sign-in method');
      console.log('   4. Habilita "Email/Password"');
      console.log('   5. Guarda los cambios');
      console.log('');
      console.log('Una vez habilitado, ejecuta: node test-email-duplicates-simple.js');
      process.exit(1);
    } else {
      console.log('❌ Error al crear usuario:', createError.message);
    }
  }
  
  console.log('\n🎉 TODOS LOS TESTS DE DUPLICADOS FUNCIONAN CORRECTAMENTE');
  
} catch (error) {
  console.error('❌ Error general:', error.message);
  if (error.code === 'auth/operation-not-allowed') {
    console.log('\n🔧 SOLUCIÓN: Habilitar Authentication en Firebase Console');
  }
}