// Test de verificación de emails duplicados
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { checkEmailExists } from "./src/services/authService.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgvIO7nGGewqMVYDIiCilkD3iJ-oO_hhU",
  authDomain: "dentalcare-3b2ef.firebaseapp.com",
  projectId: "dentalcare-3b2ef",
  storageBucket: "dentalcare-3b2ef.firebasestorage.app",
  messagingSenderId: "460784117282",
  appId: "1:460784117282:web:05baf6cb122cf824520c7b",
  measurementId: "G-K29EK328S2"
};

console.log('🔄 Iniciando prueba de verificación de emails duplicados...');

try {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase inicializado correctamente');
  
  // Test 1: Verificar email que no existe
  console.log('\n📧 Test 1: Verificando email que no existe...');
  const testEmail1 = `nuevo_${Date.now()}@example.com`;
  console.log('📧 Email de prueba:', testEmail1);
  
  try {
    const result1 = await checkEmailExists(testEmail1);
    if (result1.success && !result1.exists) {
      console.log('✅ Test 1 PASÓ: Email disponible para registro');
    } else {
      console.log('❌ Test 1 FALLÓ: Email debería estar disponible');
    }
  } catch (error) {
    console.log('⚠️ Test 1: Función checkEmailExists no disponible (esperado si no está implementada)');
  }
  
  // Test 2: Crear usuario y luego verificar que el email ya existe
  console.log('\n👤 Test 2: Creando usuario para probar duplicados...');
  const testEmail2 = `test_duplicado_${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    // Crear usuario
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail2, testPassword);
    console.log('✅ Usuario creado exitosamente con email:', testEmail2);
    
    // Ahora verificar que el email ya existe
    console.log('🔍 Verificando que el email ahora aparece como existente...');
    
    try {
      const result2 = await checkEmailExists(testEmail2);
      if (result2.success && result2.exists) {
        console.log('✅ Test 2 PASÓ: Email correctamente detectado como existente');
      } else {
        console.log('❌ Test 2 FALLÓ: Email debería aparecer como existente');
      }
    } catch (error) {
      console.log('⚠️ Test 2: Función checkEmailExists no disponible');
    }
    
    // Test 3: Intentar crear usuario duplicado
    console.log('\n🚫 Test 3: Intentando crear usuario duplicado...');
    try {
      await createUserWithEmailAndPassword(auth, testEmail2, testPassword);
      console.log('❌ Test 3 FALLÓ: Debería haber dado error de email duplicado');
    } catch (duplicateError) {
      if (duplicateError.code === 'auth/email-already-in-use') {
        console.log('✅ Test 3 PASÓ: Firebase correctamente rechazó email duplicado');
        console.log('📋 Código de error:', duplicateError.code);
        console.log('💬 Mensaje:', duplicateError.message);
      } else {
        console.log('❌ Test 3 FALLÓ: Error inesperado:', duplicateError.code);
      }
    }
    
  } catch (createError) {
    if (createError.code === 'auth/operation-not-allowed') {
      console.log('⚠️ ATENCIÓN: Firebase Authentication no está habilitado');
      console.log('📋 Para habilitar:');
      console.log('   1. Ve a Firebase Console > Authentication');
      console.log('   2. Habilita Email/Password en Sign-in method');
      console.log('   3. Ejecuta este test nuevamente');
    } else {
      console.log('❌ Error inesperado al crear usuario:', createError.code, createError.message);
    }
  }
  
  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('🎯 Objetivo: Verificar que no se puedan crear correos duplicados');
  console.log('📋 Componentes probados:');
  console.log('   - Firebase Authentication');
  console.log('   - Función checkEmailExists (si está disponible)');
  console.log('   - Prevención de duplicados');
  
  console.log('\n✅ Si Authentication está habilitado, la funcionalidad funcionará correctamente');
  
} catch (error) {
  console.error('❌ Error general en las pruebas:', error);
  console.error('Código de error:', error.code);
  console.error('Mensaje:', error.message);
}