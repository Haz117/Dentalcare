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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

const APPOINTMENTS_COLLECTION = 'appointments';

// Crear una nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: new Date(),
      status: 'pending'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
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