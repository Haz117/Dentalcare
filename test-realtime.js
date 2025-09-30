// Test básico para verificar funcionalidad de tiempo real
import { realtimeService } from './src/services/realtimeService.js';

console.log('🧪 Iniciando test de tiempo real...');

// Test de suscripción básica
const testSubscription = () => {
  console.log('📡 Probando suscripción a citas...');
  
  try {
    const subscriptionId = realtimeService.subscribeToAppointments(
      'test-admin',
      (result) => {
        console.log('✅ Resultado recibido:', result);
        
        if (result.error) {
          console.error('❌ Error en test:', result.error);
        } else if (result.appointments) {
          console.log(`📋 ${result.appointments.length} citas recibidas`);
        }
      },
      true // isAdmin
    );
    
    console.log(`✅ Suscripción creada: ${subscriptionId}`);
    
    // Cancelar después de 5 segundos
    setTimeout(() => {
      realtimeService.unsubscribe(subscriptionId);
      console.log('🧹 Test completado, suscripción cancelada');
    }, 5000);
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
};

// Ejecutar test
testSubscription();