import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday, 
  isBefore, 
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';
import LoadingSpinner from './LoadingSpinner';
import { getAvailableTimeSlotsForDate, getOccupiedTimeSlotsForDate } from '../services/firebaseService';

const Calendar = forwardRef(({ selectedDate, onDateSelect, selectedTime, onTimeSelect }, ref) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [occupiedSlots, setOccupiedSlots] = useState({});
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDate, setLoadingDate] = useState(null);

  // Horarios de trabajo del consultorio
  const allTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Obtener disponibilidad real de Firebase
  const loadAvailabilityForDate = async (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const result = await getAvailableTimeSlotsForDate(dateStr);
      
      if (result.success) {
        setAvailableSlots(prev => ({
          ...prev,
          [dateStr]: {
            available: result.availableSlots.length > 0,
            slots: result.availableSlots,
            totalSlots: result.totalSlots
          }
        }));
        
        setOccupiedSlots(prev => ({
          ...prev,
          [dateStr]: result.occupiedSlots
        }));
      }
    } catch (error) {
      console.error('Error loading availability for', dateStr, error);
    }
  };

  // Cargar disponibilidad para el mes actual
  useEffect(() => {
    const loadMonthAvailability = async () => {
      setLoading(true);
      
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      
      const promises = [];
      let day = calendarStart;
      
      while (day <= calendarEnd) {
        // Solo cargar para días que no sean domingo y que sean futuros
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (day.getDay() !== 0 && !isBefore(day, today)) {
          promises.push(loadAvailabilityForDate(day));
        } else {
          // Marcar domingos como no disponibles
          const dateStr = format(day, 'yyyy-MM-dd');
          setAvailableSlots(prev => ({
            ...prev,
            [dateStr]: { available: false, slots: [], totalSlots: 0 }
          }));
        }
        day = addDays(day, 1);
      }
      
      await Promise.all(promises);
      setLoading(false);
    };

    loadMonthAvailability();
  }, [currentMonth]);

  // Exponer función de refresh para el componente padre
  useImperativeHandle(ref, () => ({
    refreshAvailability: async (date) => {
      if (date) {
        await loadAvailabilityForDate(new Date(date));
      } else {
        // Refrescar todo el mes
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        
        let day = calendarStart;
        while (day <= calendarEnd) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (day.getDay() !== 0 && !isBefore(day, today)) {
            await loadAvailabilityForDate(day);
          }
          day = addDays(day, 1);
        }
      }
    }
  }));

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = async (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Si no tenemos datos para esta fecha, cargarlos
    if (!availableSlots[dateStr]) {
      setLoadingDate(dateStr);
      await loadAvailabilityForDate(date);
      setLoadingDate(null);
    }
    
    const dayAvailability = availableSlots[dateStr];
    
    if (dayAvailability && dayAvailability.available) {
      setSelectedCalendarDate(date);
      setShowTimeModal(true);
    }
  };

  const handleTimeSelect = (time) => {
    const dateStr = format(selectedCalendarDate, 'yyyy-MM-dd');
    onDateSelect(dateStr);
    onTimeSelect(time);
    setShowTimeModal(false);
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayAvailability = availableSlots[dateStr];
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDate = selectedDate && isSameDay(day, parseISO(selectedDate + 'T00:00:00'));
        
        // Crear fecha de hoy correctamente para comparación
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayToCompare = new Date(day);
        dayToCompare.setHours(0, 0, 0, 0);
        
        const isPastDate = dayToCompare < today;
        const isAvailable = dayAvailability && dayAvailability.available && !isPastDate;
        const isTodayDate = isToday(day);

        days.push(
          <div
            key={day}
            className={`
              relative h-16 flex flex-col items-center justify-center cursor-pointer text-lg font-medium transition-all duration-300 border border-gray-100 hover:shadow-lg
              ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : 'bg-white'}
              ${isPastDate ? 'text-gray-300 cursor-not-allowed bg-gray-50' : ''}
              ${isAvailable ? 'hover:bg-dental-blue hover:text-white hover:scale-105' : ''}
              ${!isAvailable && isCurrentMonth && !isPastDate ? 'text-gray-400 cursor-not-allowed bg-red-50' : ''}
              ${isSelectedDate ? 'bg-dental-blue text-white shadow-lg ring-2 ring-dental-blue ring-opacity-50' : ''}
              ${isTodayDate && !isSelectedDate ? 'bg-dental-lightblue text-dental-blue font-bold ring-2 ring-dental-blue ring-opacity-30' : ''}
            `}
            onClick={() => isAvailable && handleDateClick(day)}
          >
            <span className="text-xl mb-1">{formattedDate}</span>
            {/* Indicadores de disponibilidad */}
            {isCurrentMonth && !isPastDate && (
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {/* Indicador de citas limitadas */}
                {isAvailable && dayAvailability && dayAvailability.slots.length <= 5 && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-dental-darkgray mb-3">
          Selecciona una Fecha
        </h3>
        <p className="text-dental-gray text-lg">
          Haz clic en un día disponible para ver los horarios. Los días con mejor disponibilidad están resaltados.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando disponibilidad..." />
        </div>
      ) : (
        <>
          {/* Navegación del calendario */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevMonth}
              className="p-3 hover:bg-dental-lightblue rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6 text-dental-darkgray" />
            </button>
            
            <h2 className="text-2xl font-bold text-dental-darkgray capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-3 hover:bg-dental-lightblue rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="w-6 h-6 text-dental-darkgray" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="h-12 flex items-center justify-center text-dental-darkgray font-bold text-lg bg-dental-lightblue">
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          {renderCalendarDays()}

          {/* Leyenda mejorada */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold text-dental-darkgray mb-4 text-lg">Leyenda</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-dental-darkgray font-medium">Disponible</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="text-dental-darkgray font-medium">Pocas citas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-dental-darkgray font-medium">No disponible</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-dental-blue rounded-full shadow-sm"></div>
                <span className="text-dental-darkgray font-medium">Seleccionado</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de selección de hora */}
      {showTimeModal && selectedCalendarDate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-dental-darkgray">
                Horarios disponibles
              </h3>
              <button
                onClick={() => setShowTimeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-dental-gray" />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-dental-lightblue rounded-lg">
              <p className="text-dental-darkgray font-semibold text-lg">
                {format(selectedCalendarDate, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}
              </p>
              {occupiedSlots[format(selectedCalendarDate, 'yyyy-MM-dd')] && (
                <p className="text-sm text-dental-gray mt-2">
                  {occupiedSlots[format(selectedCalendarDate, 'yyyy-MM-dd')].length} horarios ocupados
                </p>
              )}
            </div>

            {availableSlots[format(selectedCalendarDate, 'yyyy-MM-dd')]?.slots.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {availableSlots[format(selectedCalendarDate, 'yyyy-MM-dd')]?.slots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-4 text-lg rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-medium ${
                      selectedTime === time
                        ? 'bg-dental-blue text-white border-dental-blue shadow-lg scale-105'
                        : 'bg-white text-dental-darkgray border-gray-200 hover:border-dental-blue hover:bg-dental-lightblue hover:scale-105'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-dental-darkgray mb-2">
                  No hay horarios disponibles
                </h4>
                <p className="text-dental-gray">
                  Todos los horarios están ocupados para este día. 
                  Por favor selecciona otra fecha.
                </p>
              </div>
            )}
            
            {/* Mostrar horarios ocupados */}
            {occupiedSlots[format(selectedCalendarDate, 'yyyy-MM-dd')] && 
             occupiedSlots[format(selectedCalendarDate, 'yyyy-MM-dd')].length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-dental-darkgray mb-3 text-sm">
                  Horarios Ocupados:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {occupiedSlots[format(selectedCalendarDate, 'yyyy-MM-dd')].map((slot, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <span className="text-sm text-red-700 font-medium">{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default Calendar;
