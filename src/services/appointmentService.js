import { 
  createAppointment, 
  getAppointments, 
  updateAppointment, 
  deleteAppointment, 
  subscribeToAppointments 
} from './firebaseService';

// Formatear datos de cita para mostrar en el admin
const formatAppointmentForAdmin = (appointment) => {
  return {
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    service: appointment.service,
    patient: {
      name: `${appointment.firstName} ${appointment.lastName}`,
      email: appointment.email || appointment.userEmail,
      phone: appointment.phone,
      address: appointment.address || 'No especificada'
    },
    status: appointment.status || 'pending',
    paymentMethod: appointment.paymentMethod === 'pay-later' ? 'Pagar después' : 
                   appointment.paymentMethod === 'cash' ? 'Efectivo' :
                   appointment.paymentMethod === 'card' ? 'Tarjeta' :
                   appointment.paymentMethod === 'transfer' ? 'Transferencia' :
                   appointment.paymentMethod || 'No especificado',
    notes: appointment.notes || '',
    createdAt: appointment.createdAt,
    price: appointment.price,
    duration: appointment.duration,
    emergencyContact: appointment.emergencyContact,
    medicalHistory: appointment.medicalHistory,
    birthDate: appointment.birthDate
  };
};

// Obtener todas las citas formateadas para el admin
export const getAppointmentsForAdmin = async () => {
  try {
    const result = await getAppointments();
    if (result.success) {
      const formattedAppointments = result.appointments.map(formatAppointmentForAdmin);
      return { success: true, appointments: formattedAppointments };
    }
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear nueva cita
export const createNewAppointment = async (appointmentData) => {
  try {
    const result = await createAppointment(appointmentData);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar estado de una cita
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const result = await updateAppointment(appointmentId, { status });
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar una cita
export const removeAppointment = async (appointmentId) => {
  try {
    const result = await deleteAppointment(appointmentId);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Escuchar cambios en tiempo real y formatear para admin
export const subscribeToAppointmentsForAdmin = (callback) => {
  return subscribeToAppointments((appointments) => {
    const formattedAppointments = appointments.map(formatAppointmentForAdmin);
    callback(formattedAppointments);
  });
};

// Obtener estadísticas para el dashboard
export const getAppointmentStats = (appointments) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    today: appointments.filter(apt => apt.date === today).length,
    tomorrow: appointments.filter(apt => apt.date === tomorrow).length
  };
};