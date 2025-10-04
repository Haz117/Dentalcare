import { useState } from 'react';

const AppointmentBookingTest = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dental-darkgray mb-8">
            📅 Página de Agendamiento de Citas
          </h2>
          <p className="text-dental-gray mb-8">
            La página de agendamiento está funcionando correctamente.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-dental-darkgray mb-4">
              ✅ Componentes que deberían cargar aquí:
            </h3>
            <ul className="space-y-2 text-dental-gray">
              <li>• Calendario interactivo</li>
              <li>• Selector de horarios</li>
              <li>• Formulario de citas</li>
              <li>• Panel lateral con información</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingTest;