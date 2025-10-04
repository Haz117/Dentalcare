import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  and
} from 'firebase/firestore';
import { db } from '../firebase';

const APPOINTMENTS_COLLECTION = 'appointments';

// Crear una nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    console.log('📝 Iniciando creación de cita...');
    
    // 1. Verificar disponibilidad del horario
    if (appointmentData.date && appointmentData.time) {
      console.log('🔍 Verificando disponibilidad del horario...');
      const availabilityCheck = await checkTimeSlotAvailability(appointmentData.date, appointmentData.time);
      
      if (!availabilityCheck.success) {
        return { success: false, error: 'Error al verificar disponibilidad: ' + availabilityCheck.error };
      }
      
      if (!availabilityCheck.available) {
        const existingAppointment = availabilityCheck.existingAppointments[0];
        return { 
          success: false, 
          error: `Lo sentimos, el horario ${appointmentData.time} del ${appointmentData.date} ya está ocupado. Por favor selecciona otro horario.`,
          errorCode: 'TIME_SLOT_OCCUPIED',
          existingAppointment: existingAppointment
        };
      }
    }
    
    // 2. Si el horario está disponible, crear la cita
    console.log('✅ Horario disponible, creando cita...');
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: new Date(),
      status: appointmentData.status || 'pending'
    });
    
    console.log('✅ Cita creada exitosamente:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todas las citas
export const getAppointments = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, APPOINTMENTS_COLLECTION), orderBy('date', 'asc'))
    );
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener citas por usuario
export const getUserAppointments = async (userId) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar una cita
export const updateAppointment = async (appointmentId, updates) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(appointmentRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar una cita
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verificar si un horario específico está disponible
export const checkTimeSlotAvailability = async (date, time) => {
  try {
    console.log(`🔍 Verificando disponibilidad para ${date} a las ${time}...`);
    
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      and(
        where('date', '==', date),
        where('time', '==', time),
        where('status', 'in', ['pending', 'confirmed']) // Solo citas activas
      )
    );
    
    const querySnapshot = await getDocs(q);
    const existingAppointments = [];
    
    querySnapshot.forEach((doc) => {
      existingAppointments.push({ id: doc.id, ...doc.data() });
    });
    
    const isAvailable = existingAppointments.length === 0;
    
    console.log(`${isAvailable ? '✅' : '❌'} Horario ${date} ${time}: ${isAvailable ? 'DISPONIBLE' : 'OCUPADO'}`);
    
    return {
      success: true,
      available: isAvailable,
      existingAppointments: existingAppointments
    };
  } catch (error) {
    console.error('❌ Error al verificar disponibilidad:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todos los horarios ocupados para una fecha específica
export const getOccupiedTimeSlotsForDate = async (date) => {
  try {
    console.log(`📅 Obteniendo horarios ocupados para ${date}...`);
    
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      and(
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed']) // Solo citas activas
      )
    );
    
    const querySnapshot = await getDocs(q);
    const occupiedSlots = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      occupiedSlots.push({
        time: data.time,
        service: data.service,
        patientName: `${data.firstName} ${data.lastName}`,
        appointmentId: doc.id
      });
    });
    
    // Ordenar por tiempo en JavaScript para evitar necesidad de índice compuesto
    occupiedSlots.sort((a, b) => a.time.localeCompare(b.time));
    
    console.log(`🚫 ${occupiedSlots.length} horarios ocupados encontrados para ${date}`);
    
    return {
      success: true,
      occupiedSlots: occupiedSlots
    };
  } catch (error) {
    console.error('❌ Error al obtener horarios ocupados:', error);
    return { success: false, error: error.message };
  }
};

// Obtener horarios disponibles para una fecha
export const getAvailableTimeSlotsForDate = async (date) => {
  try {
    // Horarios de trabajo estándar del consultorio
    const allTimeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00'
    ];
    
    // Obtener horarios ocupados
    const occupiedResult = await getOccupiedTimeSlotsForDate(date);
    
    if (!occupiedResult.success) {
      return occupiedResult;
    }
    
    const occupiedTimes = occupiedResult.occupiedSlots.map(slot => slot.time);
    
    // Filtrar horarios disponibles
    const availableSlots = allTimeSlots.filter(time => !occupiedTimes.includes(time));
    
    console.log(`✅ ${availableSlots.length} horarios disponibles para ${date}`);
    
    return {
      success: true,
      availableSlots: availableSlots,
      occupiedSlots: occupiedResult.occupiedSlots,
      totalSlots: allTimeSlots.length
    };
  } catch (error) {
    console.error('❌ Error al obtener horarios disponibles:', error);
    return { success: false, error: error.message };
  }
};

// Escuchar cambios en tiempo real de las citas
export const subscribeToAppointments = (callback) => {
  const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('date', 'asc'));
  return onSnapshot(q, (querySnapshot) => {
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    callback(appointments);
  });
};