import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Filter, Search, CheckCircle, XCircle, Edit, Eye, AlertCircle, Users, CalendarDays, TrendingUp } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { updateAppointmentStatus } from '../services/appointmentService';
import realtimeService from '../services/realtimeService';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'reconnecting', 'error'
  const subscriptionRef = useRef(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    tomorrow: 0
  });

  // Función para calcular estadísticas
  const calculateStats = (appointmentsList) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      total: appointmentsList.length,
      pending: appointmentsList.filter(apt => apt.status === 'pending').length,
      confirmed: appointmentsList.filter(apt => apt.status === 'confirmed').length,
      completed: appointmentsList.filter(apt => apt.status === 'completed').length,
      cancelled: appointmentsList.filter(apt => apt.status === 'cancelled').length,
      today: appointmentsList.filter(apt => apt.date === today).length,
      tomorrow: appointmentsList.filter(apt => apt.date === tomorrow).length
    };
  };

  // Función para formatear cita para el admin
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

  // Configurar suscripción en tiempo real
  useEffect(() => {
    console.log('🚀 Iniciando AdminPanel con tiempo real...');
    setLoading(true);
    setError(null);
    setConnectionStatus('connecting');

    try {
      // Suscribirse a cambios en tiempo real usando realtimeService
      const subscriptionId = realtimeService.subscribeToAppointments(
        'admin', // userId (admin puede ver todas)
        (result) => {
          console.log('📡 Datos recibidos en AdminPanel:', result);
          
          if (result.error) {
            console.error('❌ Error en suscripción:', result.error);
            
            if (result.isPermissionError) {
              setError('Error de permisos: No tienes autorización para ver las citas.');
              setConnectionStatus('error');
            } else if (result.isNetworkError) {
              setError('Error de conexión. Reintentando...');
              setConnectionStatus('reconnecting');
              // No setear loading a false para errores de red, mantener UI funcionando
            } else if (result.isConnectionError) {
              setError('No se pudo establecer conexión con el servidor.');
              setConnectionStatus('error');
            } else {
              setError(result.error);
              setConnectionStatus('error');
            }
            
            // Solo setear loading a false para errores que no son de red
            if (!result.isNetworkError) {
              setLoading(false);
            }
            return;
          }

          if (result.appointments) {
            // Formatear las citas para el admin
            const formattedAppointments = result.appointments.map(formatAppointmentForAdmin);
            
            console.log(`✅ Citas formateadas: ${formattedAppointments.length}`);
            
            setAppointments(formattedAppointments);
            setStats(calculateStats(formattedAppointments));
            setLoading(false);
            setError(null);
            setConnectionStatus(result.isConnected ? 'connected' : 'reconnecting');
          }
        },
        true // isAdmin = true
      );

      subscriptionRef.current = subscriptionId;
      console.log(`✅ Suscripción creada: ${subscriptionId}`);

    } catch (error) {
      console.error('❌ Error al crear suscripción:', error);
      setError(error.message);
      setConnectionStatus('error');
      setLoading(false);
    }

    // Cleanup al desmontar
    return () => {
      if (subscriptionRef.current) {
        console.log(`🧹 Limpiando suscripción: ${subscriptionRef.current}`);
        realtimeService.unsubscribe(subscriptionRef.current);
      }
    };
  }, []);

  // Filtrar citas
  useEffect(() => {
    let filtered = appointments;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(appointment => {
        const appointmentDate = parseISO(appointment.date + 'T00:00:00');
        switch (dateFilter) {
          case 'today':
            return isToday(appointmentDate);
          case 'tomorrow':
            return isTomorrow(appointmentDate);
          case 'week':
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            return appointmentDate >= today && appointmentDate <= weekFromNow;
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'confirmed':
        return { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'completed':
        return { label: 'Completada', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const formatRelativeDate = (dateStr) => {
    const date = parseISO(dateStr + 'T00:00:00');
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isYesterday(date)) return 'Ayer';
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus);
      if (result.success) {
        // El estado se actualizará automáticamente a través de la suscripción en tiempo real
        console.log('Status updated successfully');
      } else {
        console.error('Error updating status:', result.error);
        alert('Error al actualizar el estado de la cita');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado de la cita');
    }
  };

  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dental-blue mx-auto mb-4"></div>
          <p className="text-dental-gray">Conectando al sistema en tiempo real...</p>
          <p className="text-sm text-dental-gray mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error && connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error de Conexión</h2>
          <p className="text-dental-gray mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-dental-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reintentar Conexión
            </button>
            <p className="text-xs text-dental-gray">
              Si el problema persiste, verifica tu conexión a internet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-dental-blue to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Panel de Administración
              </h1>
              <p className="text-xl text-blue-100">
                Gestiona todas las citas y pacientes del consultorio
              </p>
              {/* Indicador de tiempo real */}
              <div className="flex items-center mt-2 space-x-2">
                {connectionStatus === 'connected' && (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">Conectado en tiempo real</span>
                  </>
                )}
                {connectionStatus === 'connecting' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">Conectando...</span>
                  </>
                )}
                {connectionStatus === 'reconnecting' && (
                  <>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">Reconectando...</span>
                  </>
                )}
                {connectionStatus === 'error' && (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-blue-100">Error de conexión</span>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-dental-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-dental-darkgray">{stats.total}</div>
            <div className="text-sm text-dental-gray">Total Citas</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CalendarDays className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-dental-darkgray">{stats.today}</div>
            <div className="text-sm text-dental-gray">Citas Hoy</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-dental-darkgray">{stats.pending}</div>
            <div className="text-sm text-dental-gray">Pendientes</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-dental-darkgray">{stats.completed}</div>
            <div className="text-sm text-dental-gray">Completadas</div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dental-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar paciente, email o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>

            {/* Filtro por fecha */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="tomorrow">Mañana</option>
              <option value="week">Esta semana</option>
            </select>

            {/* Botón limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Filter className="w-5 h-5" />
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-dental-lightblue border-b">
            <h3 className="text-xl font-bold text-dental-darkgray">
              Citas Agendadas ({filteredAppointments.length})
            </h3>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-dental-gray text-lg">
                No se encontraron citas con los filtros seleccionados
              </p>
            </div>
          ) : (
            <>
              {/* Vista de tabla para desktop */}
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const statusInfo = getStatusInfo(appointment.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-dental-lightblue p-2 rounded-full mr-3">
                              <User className="w-5 h-5 text-dental-blue" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-dental-darkgray">
                                {appointment.patient.name}
                              </div>
                              <div className="text-sm text-dental-gray">
                                {appointment.patient.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-dental-darkgray">
                            {formatRelativeDate(appointment.date)}
                          </div>
                          <div className="text-sm text-dental-gray flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-dental-darkgray">
                          {appointment.service}
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => showAppointmentDetails(appointment)}
                              className="btn-action-view"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {appointment.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                className="btn-action-confirm"
                                title="Confirmar cita"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="btn-action-cancel"
                                title="Cancelar cita"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para móvil */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-dental-blue rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.patient.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-dental-darkgray truncate">
                            {appointment.patient.name}
                          </div>
                          <div className="text-xs text-dental-gray truncate">
                            {appointment.patient.email}
                          </div>
                          <div className="text-xs text-dental-gray mt-1">
                            {appointment.service}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ml-2`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-dental-gray">
                        <span>{formatRelativeDate(appointment.date)}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => showAppointmentDetails(appointment)}
                          className="btn-action-view"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="btn-action-confirm"
                            title="Confirmar cita"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="btn-action-cancel"
                            title="Cancelar cita"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-dental-darkgray">
                Detalles de la Cita
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-dental-gray" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información del paciente */}
              <div className="bg-dental-lightblue p-6 rounded-lg">
                <h4 className="font-bold text-dental-darkgray mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información del Paciente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dental-gray">Nombre:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Email:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.patient.email}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Teléfono:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Dirección:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.patient.address}</p>
                  </div>
                </div>
              </div>

              {/* Información de la cita */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="font-bold text-dental-darkgray mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Información de la Cita
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dental-gray">Fecha:</p>
                    <p className="font-semibold text-dental-darkgray">{formatRelativeDate(selectedAppointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Hora:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Servicio:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-dental-gray">Método de Pago:</p>
                    <p className="font-semibold text-dental-darkgray">{selectedAppointment.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedAppointment.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h4 className="font-bold text-dental-darkgray mb-2">Notas:</h4>
                  <p className="text-dental-gray">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Estado actual */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(selectedAppointment.status).color}`}>
                    Estado: {getStatusInfo(selectedAppointment.status).label}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary"
              >
                Cerrar
              </button>
              {selectedAppointment.status === 'pending' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedAppointment.id, 'confirmed');
                    setShowDetailsModal(false);
                  }}
                  className="btn-primary"
                >
                  Confirmar Cita
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;