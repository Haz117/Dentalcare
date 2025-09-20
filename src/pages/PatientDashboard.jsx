import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Eye, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Mock data - en producción esto vendría de Firebase
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setAppointments([
        {
          id: '1',
          service: 'Limpieza Dental',
          date: '2024-09-25',
          time: '10:00',
          status: 'confirmed',
          doctor: 'Dr. García',
          price: 800,
          notes: 'Traer cepillo dental personal'
        },
        {
          id: '2',
          service: 'Revisión General',
          date: '2024-08-15',
          time: '14:30',
          status: 'completed',
          doctor: 'Dr. García',
          price: 600,
          notes: 'Control de rutina'
        },
        {
          id: '3',
          service: 'Blanqueamiento Dental',
          date: '2024-07-20',
          time: '11:00',
          status: 'completed',
          doctor: 'Dr. López',
          price: 2500,
          notes: 'Evitar café por 48 horas'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + 'T' + apt.time);
    const now = new Date();
    
    switch (selectedTab) {
      case 'upcoming':
        return aptDate >= now && apt.status !== 'cancelled';
      case 'history':
        return aptDate < now || apt.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando tu información...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ¡Hola, {user.displayName || user.email}!
              </h1>
              <p className="text-gray-600">Bienvenido a tu panel de paciente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Próximas Citas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter(apt => 
                    new Date(apt.date + 'T' + apt.time) >= new Date() && 
                    apt.status !== 'cancelled'
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Citas Completadas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total de Visitas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upcoming', label: 'Próximas Citas', count: appointments.filter(apt => 
                  new Date(apt.date + 'T' + apt.time) >= new Date() && 
                  apt.status !== 'cancelled'
                ).length },
                { id: 'history', label: 'Historial', count: appointments.filter(apt => 
                  new Date(apt.date + 'T' + apt.time) < new Date() || 
                  apt.status === 'completed'
                ).length },
                { id: 'all', label: 'Todas', count: appointments.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Appointments List */}
          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay citas en esta categoría
                </h3>
                <p className="text-gray-600">
                  {selectedTab === 'upcoming' 
                    ? 'No tienes citas próximas programadas.' 
                    : 'No hay citas en el historial.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.service}
                          </h3>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span>{getStatusText(appointment.status)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(parseISO(appointment.date), 'EEEE, d MMMM yyyy', { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.doctor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-medium">
                              ${appointment.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Notas:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {appointment.status === 'confirmed' && (
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reagendar
                          </button>
                        )}
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Agendar Nueva Cita</p>
                <p className="text-sm text-gray-600">Programa tu próxima visita</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
              <User className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Actualizar Perfil</p>
                <p className="text-sm text-gray-600">Modifica tus datos personales</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;