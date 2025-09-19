import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Filter, Search, CheckCircle, XCircle, Edit, Eye, AlertCircle, Users, CalendarDays, TrendingUp } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAppointmentsForAdmin, updateAppointmentStatus, subscribeToAppointmentsForAdmin, getAppointmentStats } from '../services/appointmentService';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    tomorrow: 0
  });

  // Cargar citas reales desde Firebase
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const result = await getAppointmentsForAdmin();
        if (result.success) {
          setAppointments(result.appointments);
          setStats(getAppointmentStats(result.appointments));
        } else {
          console.error('Error loading appointments:', result.error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToAppointmentsForAdmin((appointments) => {
      setAppointments(appointments);
      setStats(getAppointmentStats(appointments));
    });

    return () => unsubscribe();
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
          <p className="text-dental-gray">Cargando citas...</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              className="btn-secondary flex items-center justify-center gap-2"
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
            <div className="overflow-x-auto">
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => showAppointmentDetails(appointment)}
                              className="p-2 text-dental-blue hover:bg-dental-lightblue rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {appointment.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirmar cita"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
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