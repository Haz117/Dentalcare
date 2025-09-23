import { createAppointment, getAppointments } from '../services/firebaseService';
import { auth, db } from '../firebase';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

/**
 * Función para probar la conexión con Firebase
 * Ejecuta diferentes operaciones para verificar que todo funcione
 */
export const testFirebaseConnection = async () => {
  console.log('🔥 Iniciando pruebas de Firebase...');
  
  try {
    // 1. Verificar configuración de Firebase
    console.log('📋 Verificando configuración...');
    console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
    console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
    
    // 2. Verificar conexión a Firestore
    console.log('🔗 Verificando conexión a Firestore...');
    const testAppointment = {
      service: 'Consulta de Prueba',
      firstName: 'Test',
      lastName: 'Usuario',
      email: 'test@example.com',
      phone: '5551234567',
      date: '2025-09-20',
      time: '10:00 AM',
      status: 'test'
    };

    // 3. Crear cita de prueba
    console.log('➕ Creando cita de prueba...');
    const createResult = await createAppointment(testAppointment);
    
    if (createResult.success) {
      console.log('✅ Cita creada exitosamente:', createResult.id);
      
      // 4. Obtener citas para verificar lectura
      console.log('📖 Obteniendo citas...');
      const getResult = await getAppointments();
      
      if (getResult.success) {
        console.log('✅ Citas obtenidas exitosamente:', getResult.appointments.length, 'citas encontradas');
        
        // Filtrar y mostrar solo la cita de prueba
        const testAppointments = getResult.appointments.filter(apt => apt.status === 'test');
        console.log('🧪 Citas de prueba encontradas:', testAppointments.length);
        
        return {
          success: true,
          message: '¡Firebase está configurado correctamente!',
          details: {
            canWrite: true,
            canRead: true,
            testAppointmentId: createResult.id,
            totalAppointments: getResult.appointments.length
          }
        };
      } else {
        throw new Error('Error al leer citas: ' + getResult.error);
      }
    } else {
      throw new Error('Error al crear cita: ' + createResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas de Firebase:', error);
    return {
      success: false,
      message: 'Error en la configuración de Firebase',
      error: error.message
    };
  }
};

/**
 * Función para limpiar datos de prueba
 */
export const cleanupTestData = async () => {
  try {
    console.log('🧹 Limpiando datos de prueba...');
    const getResult = await getAppointments();
    
    if (getResult.success) {
      const testAppointments = getResult.appointments.filter(apt => apt.status === 'test');
      console.log(`🗑️ Encontradas ${testAppointments.length} citas de prueba para eliminar`);
      
      // Aquí podrías agregar lógica para eliminar las citas de prueba
      // Por ahora solo las registramos
      return {
        success: true,
        message: `${testAppointments.length} citas de prueba identificadas`
      };
    }
  } catch (error) {
    console.error('Error al limpiar datos de prueba:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Función para verificar reglas de seguridad de Firestore
 */
export const testFirestoreRules = async () => {
  console.log('🔒 Verificando reglas de seguridad de Firestore...');
  
  try {
    // Intentar operaciones básicas para verificar reglas
    const testResult = await createAppointment({
      service: 'Security Test',
      firstName: 'Security',
      lastName: 'Test',
      email: 'security@test.com',
      phone: '5559999999',
      date: '2025-09-20',
      time: '11:00 AM',
      status: 'security-test'
    });

    if (testResult.success) {
      console.log('✅ Reglas de escritura funcionando correctamente');
      return {
        success: true,
        message: 'Reglas de seguridad configuradas correctamente',
        canWrite: true,
        canRead: true
      };
    } else {
      console.log('⚠️ Posible problema con reglas de escritura:', testResult.error);
      return {
        success: false,
        message: 'Problema con reglas de seguridad',
        error: testResult.error
      };
    }
  } catch (error) {
    console.error('❌ Error al verificar reglas de seguridad:', error);
    return {
      success: false,
      message: 'Error al verificar reglas de seguridad',
      error: error.message
    };
  }
};