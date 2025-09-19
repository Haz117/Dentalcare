import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Info } from 'lucide-react';
import Calendar from '../components/Calendar';
import AppointmentForm from '../components/AppointmentForm';

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // Abrir el modal automáticamente cuando selecciona una hora
    setShowAppointmentForm(true);
  };

  const handleAppointmentSuccess = (appointmentData) => {
    setAppointments(prev => [...prev, appointmentData]);
    // Reset selections
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dental-blue to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Agenda tu Cita Dental
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Selecciona el día y hora que mejor te convenga. Nuestro calendario muestra la disponibilidad en tiempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendario Principal */}
          <div className="lg:col-span-3">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Información de la cita seleccionada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-dental-darkgray mb-4 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-dental-blue" />
                Tu Selección
              </h3>
              
              {selectedDate || selectedTime ? (
                <div className="space-y-4">
                  {selectedDate && (
                    <div className="flex items-center p-3 bg-dental-lightblue rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-dental-blue mr-3" />
                      <div>
                        <p className="text-sm text-dental-gray">Fecha</p>
                        <p className="font-semibold text-dental-darkgray">
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-green-600">Hora</p>
                        <p className="font-semibold text-green-800">{selectedTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-dental-gray">
                    Selecciona una fecha y hora en el calendario
                  </p>
                </div>
              )}
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Cómo Agendar
              </h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                  Haz clic en un día disponible (punto verde)
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                  Selecciona tu horario preferido y el formulario se abrirá automáticamente
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                  Completa tus datos en el formulario
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                  ¡Confirma tu cita!
                </li>
              </ul>
            </div>

            {/* Información del consultorio */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold text-dental-darkgray mb-3">
                📍 Información del Consultorio
              </h4>
              <div className="text-sm text-dental-gray space-y-2">
                <p><strong>Horarios:</strong></p>
                <p>• Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p>• Sábados: 8:00 AM - 12:00 PM</p>
                <p>• Domingos: Cerrado</p>
                <p className="mt-3"><strong>Teléfono:</strong> (555) 123-4567</p>
                <p><strong>Email:</strong> info@consultoriodental.com</p>
              </div>
            </div>

            {/* Políticas */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-3">
                ⚠️ Políticas Importantes
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Cancela con 24h de anticipación</li>
                <li>• Llega 15 minutos antes</li>
                <li>• Trae identificación oficial</li>
                <li>• Informa sobre alergias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Citas agendadas (si hay) */}
        {appointments.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-dental-darkgray mb-6 flex items-center">
              <CheckCircle className="w-7 h-7 mr-3 text-green-500" />
              Citas Agendadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dental-darkgray">
                      {appointment.service}
                    </h4>
                    <span className="text-green-600 font-bold">
                      ${appointment.price}
                    </span>
                  </div>
                  <div className="text-sm text-dental-gray space-y-1">
                    <p><strong>Fecha:</strong> {new Date(appointment.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                    <p><strong>Hora:</strong> {appointment.time}</p>
                    <p><strong>Paciente:</strong> {appointment.firstName} {appointment.lastName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      <AppointmentForm
        isOpen={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSuccess={handleAppointmentSuccess}
      />
    </div>
  );
};

export default AppointmentBooking;
