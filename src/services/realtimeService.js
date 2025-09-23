import React from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.activeSubscriptions = new Set();
  }

  // Escuchar cambios en tiempo real de citas
  subscribeToAppointments(userId, callback, isAdmin = false) {
    const subscriptionId = `appointments_${userId}_${isAdmin}`;
    
    // Si ya existe una suscripción, cancelarla primero
    this.unsubscribe(subscriptionId);

    try {
      let appointmentsQuery;
      
      if (isAdmin) {
        // Admin ve todas las citas
        appointmentsQuery = query(
          collection(db, 'appointments'),
          orderBy('date', 'asc'),
          orderBy('time', 'asc')
        );
      } else {
        // Paciente ve solo sus citas
        appointmentsQuery = query(
          collection(db, 'appointments'),
          where('userId', '==', userId),
          orderBy('date', 'asc')
        );
      }

      const unsubscribe = onSnapshot(
        appointmentsQuery,
        (snapshot) => {
          const appointments = [];
          const changes = [];

          snapshot.docChanges().forEach((change) => {
            const appointmentData = {
              id: change.doc.id,
              ...change.doc.data(),
              // Convertir timestamps a fechas
              createdAt: change.doc.data().createdAt?.toDate(),
              updatedAt: change.doc.data().updatedAt?.toDate()
            };

            changes.push({
              type: change.type, // 'added', 'modified', 'removed'
              data: appointmentData,
              oldIndex: change.oldIndex,
              newIndex: change.newIndex
            });

            if (change.type !== 'removed') {
              appointments.push(appointmentData);
            }
          });

          // Ordenar citas por fecha y hora
          appointments.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
          });

          console.log(`📋 Actualizaciones de citas recibidas (${changes.length} cambios):`, changes);

          callback({
            appointments,
            changes,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('❌ Error en suscripción de citas:', error);
          callback({ error: error.message });
        }
      );

      this.listeners.set(subscriptionId, unsubscribe);
      this.activeSubscriptions.add(subscriptionId);
      
      console.log(`✅ Suscripción a citas activada: ${subscriptionId}`);
      return subscriptionId;

    } catch (error) {
      console.error('❌ Error al crear suscripción de citas:', error);
      throw error;
    }
  }

  // Escuchar cambios en estado de disponibilidad
  subscribeToAvailability(callback) {
    const subscriptionId = 'availability';
    this.unsubscribe(subscriptionId);

    try {
      const availabilityQuery = query(
        collection(db, 'availability'),
        orderBy('date', 'asc')
      );

      const unsubscribe = onSnapshot(
        availabilityQuery,
        (snapshot) => {
          const availability = {};
          
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            availability[data.date] = {
              id: doc.id,
              ...data,
              updatedAt: data.updatedAt?.toDate()
            };
          });

          console.log('📅 Disponibilidad actualizada:', Object.keys(availability).length, 'fechas');
          
          callback({
            availability,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('❌ Error en suscripción de disponibilidad:', error);
          callback({ error: error.message });
        }
      );

      this.listeners.set(subscriptionId, unsubscribe);
      this.activeSubscriptions.add(subscriptionId);
      
      return subscriptionId;

    } catch (error) {
      console.error('❌ Error al crear suscripción de disponibilidad:', error);
      throw error;
    }
  }

  // Escuchar notificaciones en tiempo real
  subscribeToNotifications(userId, callback) {
    const subscriptionId = `notifications_${userId}`;
    this.unsubscribe(subscriptionId);

    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const notifications = [];
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const notification = {
                id: change.doc.id,
                ...change.doc.data(),
                createdAt: change.doc.data().createdAt?.toDate()
              };
              notifications.push(notification);
            }
          });

          if (notifications.length > 0) {
            console.log(`🔔 Nuevas notificaciones recibidas: ${notifications.length}`);
            
            callback({
              notifications,
              timestamp: new Date()
            });
          }
        },
        (error) => {
          console.error('❌ Error en suscripción de notificaciones:', error);
          callback({ error: error.message });
        }
      );

      this.listeners.set(subscriptionId, unsubscribe);
      this.activeSubscriptions.add(subscriptionId);
      
      return subscriptionId;

    } catch (error) {
      console.error('❌ Error al crear suscripción de notificaciones:', error);
      throw error;
    }
  }

  // Escuchar estadísticas del admin en tiempo real
  subscribeToAdminStats(callback) {
    const subscriptionId = 'admin_stats';
    this.unsubscribe(subscriptionId);

    try {
      // Suscribirse a múltiples colecciones para estadísticas
      const today = new Date().toISOString().split('T')[0];
      
      const todayAppointmentsQuery = query(
        collection(db, 'appointments'),
        where('date', '==', today)
      );

      const unsubscribe = onSnapshot(
        todayAppointmentsQuery,
        async (snapshot) => {
          const todayAppointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Obtener estadísticas adicionales
          const stats = await this.calculateAdminStats(todayAppointments);
          
          console.log('📊 Estadísticas actualizadas:', stats);
          
          callback({
            stats,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('❌ Error en suscripción de estadísticas:', error);
          callback({ error: error.message });
        }
      );

      this.listeners.set(subscriptionId, unsubscribe);
      this.activeSubscriptions.add(subscriptionId);
      
      return subscriptionId;

    } catch (error) {
      console.error('❌ Error al crear suscripción de estadísticas:', error);
      throw error;
    }
  }

  // Calcular estadísticas para admin
  async calculateAdminStats(todayAppointments) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Estadísticas del día actual
      const todayStats = {
        total: todayAppointments.length,
        confirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
        pending: todayAppointments.filter(a => a.status === 'pending').length,
        cancelled: todayAppointments.filter(a => a.status === 'cancelled').length,
        completed: todayAppointments.filter(a => a.status === 'completed').length
      };

      // Obtener estadísticas del mes
      const monthlyQuery = query(
        collection(db, 'appointments'),
        where('date', '>=', thisMonth + '-01'),
        where('date', '<', thisMonth + '-32')
      );
      
      const monthlySnapshot = await getDocs(monthlyQuery);
      const monthlyAppointments = monthlySnapshot.docs.map(doc => doc.data());

      const monthlyStats = {
        total: monthlyAppointments.length,
        revenue: monthlyAppointments
          .filter(a => a.status === 'completed')
          .reduce((sum, a) => sum + (a.price || 0), 0)
      };

      return {
        today: todayStats,
        monthly: monthlyStats,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('❌ Error al calcular estadísticas:', error);
      return {
        today: { total: 0, confirmed: 0, pending: 0, cancelled: 0, completed: 0 },
        monthly: { total: 0, revenue: 0 },
        error: error.message
      };
    }
  }

  // Actualizar cita en tiempo real
  async updateAppointment(appointmentId, updates) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      
      await updateDoc(appointmentRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log(`✅ Cita actualizada en tiempo real: ${appointmentId}`);
      return true;

    } catch (error) {
      console.error('❌ Error al actualizar cita:', error);
      throw error;
    }
  }

  // Crear notificación en tiempo real
  async createNotification(userId, notification) {
    try {
      const notificationRef = await addDoc(collection(db, 'notifications'), {
        userId,
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });

      console.log(`✅ Notificación creada: ${notificationRef.id}`);
      return notificationRef.id;

    } catch (error) {
      console.error('❌ Error al crear notificación:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });

      console.log(`✅ Notificación marcada como leída: ${notificationId}`);
      return true;

    } catch (error) {
      console.error('❌ Error al marcar notificación:', error);
      throw error;
    }
  }

  // Cancelar una suscripción específica
  unsubscribe(subscriptionId) {
    if (this.listeners.has(subscriptionId)) {
      const unsubscribe = this.listeners.get(subscriptionId);
      unsubscribe();
      this.listeners.delete(subscriptionId);
      this.activeSubscriptions.delete(subscriptionId);
      console.log(`🔕 Suscripción cancelada: ${subscriptionId}`);
    }
  }

  // Cancelar todas las suscripciones
  unsubscribeAll() {
    console.log(`🔕 Cancelando ${this.listeners.size} suscripciones activas`);
    
    this.listeners.forEach((unsubscribe, subscriptionId) => {
      unsubscribe();
      console.log(`   - ${subscriptionId}`);
    });
    
    this.listeners.clear();
    this.activeSubscriptions.clear();
  }

  // Obtener estado de suscripciones activas
  getActiveSubscriptions() {
    return Array.from(this.activeSubscriptions);
  }

  // Verificar si una suscripción está activa
  isSubscriptionActive(subscriptionId) {
    return this.activeSubscriptions.has(subscriptionId);
  }
}

// Exportar instancia singleton
export const realtimeService = new RealtimeService();

// Hook para usar el servicio en tiempo real
export const useRealtime = () => {
  const [isConnected, setIsConnected] = React.useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = React.useState([]);

  React.useEffect(() => {
    // Monitorear estado de conexión
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Actualizar lista de suscripciones activas cada 5 segundos
    const interval = setInterval(() => {
      setActiveSubscriptions(realtimeService.getActiveSubscriptions());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const subscribeToAppointments = (userId, callback, isAdmin = false) => {
    return realtimeService.subscribeToAppointments(userId, callback, isAdmin);
  };

  const subscribeToAvailability = (callback) => {
    return realtimeService.subscribeToAvailability(callback);
  };

  const subscribeToNotifications = (userId, callback) => {
    return realtimeService.subscribeToNotifications(userId, callback);
  };

  const subscribeToAdminStats = (callback) => {
    return realtimeService.subscribeToAdminStats(callback);
  };

  const unsubscribe = (subscriptionId) => {
    realtimeService.unsubscribe(subscriptionId);
  };

  const unsubscribeAll = () => {
    realtimeService.unsubscribeAll();
  };

  return {
    isConnected,
    activeSubscriptions,
    subscribeToAppointments,
    subscribeToAvailability,
    subscribeToNotifications,
    subscribeToAdminStats,
    unsubscribe,
    unsubscribeAll
  };
};