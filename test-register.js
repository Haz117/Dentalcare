// Test específico para el registro de usuarios
import { registerUser } from './src/services/authService.js';

console.log('🧪 Iniciando prueba de registro...');

const testRegister = async () => {
  try {
    const testEmail = `test_register_${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testDisplayName = 'Usuario de Prueba';
    
    console.log('📝 Datos de prueba:');
    console.log('📧 Email:', testEmail);
    console.log('🔒 Password:', testPassword);
    console.log('👤 Nombre:', testDisplayName);
    
    console.log('\n🔄 Ejecutando registerUser...');
    const result = await registerUser(testEmail, testPassword, testDisplayName);
    
    console.log('\n📊 Resultado:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ REGISTRO EXITOSO!');
      console.log('🆔 UID:', result.user.uid);
      console.log('📧 Email:', result.user.email);
      console.log('👤 Nombre:', result.user.displayName);
      console.log('✉️ Email verificado:', result.user.emailVerified);
    } else {
      console.log('\n❌ REGISTRO FALLIDO:');
      console.log('🚨 Error:', result.error);
      console.log('🔗 Código:', result.errorCode);
    }
    
  } catch (error) {
    console.error('\n💥 ERROR INESPERADO:', error);
  }
};

testRegister();