import { useState } from 'react';
import { User, Clock, CreditCard, Check, ArrowLeft, ArrowRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { createAppointment } from '../services/firebaseService';
import { getCurrentUser } from '../services/authService';

const AppointmentForm = ({ isOpen, onClose, selectedDate, selectedTime, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    service: '',
    duration: '',
    price: '',
    
    // Step 2: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    
    // Step 3: Payment & Additional
    paymentMethod: 'pay-later',
    notes: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un email válido (ej: nombre@ejemplo.com)';
    return '';
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone) return 'El teléfono es requerido';
    
    // Mexican phone validation: 10 digits or +52 followed by 10 digits
    if (phone.startsWith('+52')) {
      if (cleanPhone.length !== 12) return 'Teléfono debe tener 10 dígitos después de +52';
    } else if (cleanPhone.length !== 10) {
      return 'Teléfono debe tener 10 dígitos (ej: 5551234567)';
    }
    return '';
  };

  const validateName = (name, fieldName) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!name) return `${fieldName} es requerido`;
    if (!nameRegex.test(name)) return `${fieldName} solo debe contener letras y espacios`;
    if (name.length < 2) return `${fieldName} debe tener al menos 2 caracteres`;
    return '';
  };

  const validateEmergencyContact = (phone) => {
    if (!phone) return ''; // Emergency contact is optional
    const cleanPhone = phone.replace(/\D/g, '');
    if (phone.startsWith('+52')) {
      if (cleanPhone.length !== 12) return 'Teléfono debe tener 10 dígitos después de +52';
    } else if (cleanPhone.length !== 10) {
      return 'Teléfono debe tener 10 dígitos (ej: 5551234567)';
    }
    return '';
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'firstName':
        error = validateName(value, 'El nombre');
        break;
      case 'lastName':
        error = validateName(value, 'Los apellidos');
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'emergencyContact':
        error = validateEmergencyContact(value);
        break;
      default:
        break;
    }
    return error;
  };

  const services = [
    {
      id: 'consultation',
      name: 'Consulta General',
      duration: '30 min',
      price: 500,
      description: 'Revisión completa y diagnóstico'
    },
    {
      id: 'cleaning',
      name: 'Limpieza Dental',
      duration: '45 min',
      price: 800,
      description: 'Limpieza profunda y pulido'
    },
    {
      id: 'whitening',
      name: 'Blanqueamiento',
      duration: '60 min',
      price: 2500,
      description: 'Blanqueamiento con láser'
    },
    {
      id: 'filling',
      name: 'Empaste',
      duration: '45 min',
      price: 1200,
      description: 'Restauración dental'
    },
    {
      id: 'implant',
      name: 'Consulta Implantes',
      duration: '45 min',
      price: 800,
      description: 'Evaluación para implantes'
    },
    {
      id: 'orthodontics',
      name: 'Consulta Ortodoncia',
      duration: '30 min',
      price: 600,
      description: 'Evaluación ortodóncica'
    }
  ];

  const steps = [
    { number: 1, title: 'Servicio', icon: <User className="w-4 h-4" /> },
    { number: 2, title: 'Información Personal', icon: <User className="w-4 h-4" /> },
    { number: 3, title: 'Confirmación', icon: <Check className="w-4 h-4" /> }
  ];

  const handleInputChange = (field, value) => {
    // Format phone number as user types
    if (field === 'phone' || field === 'emergencyContact') {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate field in real-time
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 10 digits for local numbers or 12 for +52 numbers
    let formatted = cleaned;
    
    if (cleaned.length <= 10) {
      // Format as (XXX) XXX-XXXX
      if (cleaned.length >= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else if (cleaned.length >= 3) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      }
    }
    
    return formatted;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleServiceSelect = (service) => {
    handleInputChange('service', service.name);
    handleInputChange('duration', service.duration);
    handleInputChange('price', service.price);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      let isValid = true;
      const newErrors = {};

      if (currentStep === 1) {
        if (!formData.service) {
          alert('Por favor selecciona un servicio');
          return;
        }
      }

      if (currentStep === 2) {
        // Validate all required fields in step 2
        const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
        
        fieldsToValidate.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });

        // Also validate emergency contact if provided
        if (formData.emergencyContact) {
          const emergencyError = validateField('emergencyContact', formData.emergencyContact);
          if (emergencyError) {
            newErrors.emergencyContact = emergencyError;
            isValid = false;
          }
        }

        if (!isValid) {
          setErrors(prev => ({ ...prev, ...newErrors }));
          setTouched(prev => ({
            ...prev,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            emergencyContact: true
          }));
          return;
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    // Validate service selection
    if (!formData.service) {
      alert('Por favor selecciona un servicio');
      setCurrentStep(1);
      return false;
    }

    // Validate personal information
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate emergency contact if provided
    if (formData.emergencyContact) {
      const emergencyError = validateField('emergencyContact', formData.emergencyContact);
      if (emergencyError) {
        newErrors.emergencyContact = emergencyError;
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      setTouched(prev => ({
        ...prev,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        emergencyContact: true
      }));
      setCurrentStep(2); // Go back to personal info step
    }

    return isValid;
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    if (!validateAllFields()) {
      alert('Por favor corrige los errores en el formulario antes de continuar');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora para la cita');
      return;
    }

    const currentUser = getCurrentUser();
    
    const appointmentData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      userId: currentUser ? currentUser.uid : null,
      userEmail: currentUser ? currentUser.email : formData.email,
      status: 'pending'
    };

    try {
      // Guardar la cita en Firebase
      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        console.log('Appointment saved to Firebase:', result.id);
        alert('¡Cita agendada exitosamente! Te enviaremos un email de confirmación.');
        onSuccess && onSuccess({ ...appointmentData, id: result.id });
        onClose();
        
        // Reset form
        setFormData({
          service: '',
          duration: '',
          price: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          paymentMethod: 'pay-later',
          notes: '',
          emergencyContact: '',
          medicalHistory: ''
        });
        setErrors({});
        setTouched({});
        setCurrentStep(1);
      } else {
        console.error('Error saving appointment:', result.error);
        alert('Error al agendar la cita. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agendar la cita. Por favor intenta de nuevo.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-dental-darkgray mb-2">
                Selecciona el Servicio
              </h3>
              <p className="text-dental-gray">Elige el tratamiento que necesitas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                    formData.service === service.name
                      ? 'border-dental-blue bg-dental-lightblue shadow-lg'
                      : 'border-gray-200 hover:border-dental-blue hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-dental-darkgray">
                      {service.name}
                    </h4>
                    <span className="text-xl font-bold text-dental-blue">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-dental-gray text-sm mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center text-dental-gray text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-dental-darkgray mb-2">
                Información Personal
              </h3>
              <p className="text-dental-gray">Completa tus datos para agendar la cita</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent ${
                    errors.firstName && touched.firstName 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                  required
                />
                {errors.firstName && touched.firstName && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent ${
                    errors.lastName && touched.lastName 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Tus apellidos"
                  required
                />
                {errors.lastName && touched.lastName && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent ${
                    errors.email && touched.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                  required
                />
                {errors.email && touched.email && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent ${
                    errors.phone && touched.phone 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                  required
                />
                {errors.phone && touched.phone && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Formato: 10 dígitos o +52 seguido de 10 dígitos
                </div>
              </div>

              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Contacto de Emergencia
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  onBlur={() => handleBlur('emergencyContact')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent ${
                    errors.emergencyContact && touched.emergencyContact 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.emergencyContact && touched.emergencyContact && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.emergencyContact}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Opcional - Formato: 10 dígitos o +52 seguido de 10 dígitos
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Historial Médico / Alergias
                </label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
                  placeholder="Menciona cualquier condición médica, alergias o medicamentos que tomes..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-dental-darkgray font-semibold mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-blue focus:border-transparent"
                  placeholder="Cualquier información adicional que consideres importante..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-dental-darkgray mb-2">
                Confirmación de Cita
              </h3>
              <p className="text-dental-gray">Revisa los detalles antes de confirmar</p>
            </div>
            
            {/* Appointment Summary */}
            <div className="bg-gradient-to-r from-dental-lightblue to-blue-50 border-2 border-dental-blue rounded-lg p-6">
              <h4 className="text-lg font-semibold text-dental-darkgray mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Resumen de tu Cita
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-dental-darkgray">Servicio:</span>
                    <p className="text-dental-gray">{formData.service}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Fecha:</span>
                    <p className="text-dental-gray">
                      {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No seleccionada'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Hora:</span>
                    <p className="text-dental-gray">{selectedTime || 'No seleccionada'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Duración:</span>
                    <p className="text-dental-gray">{formData.duration}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-dental-darkgray">Paciente:</span>
                    <p className="text-dental-gray">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Email:</span>
                    <p className="text-dental-gray">{formData.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Teléfono:</span>
                    <p className="text-dental-gray">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dental-darkgray">Total:</span>
                    <p className="text-3xl font-bold text-dental-blue">${formData.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-dental-darkgray mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Opciones de Pago
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="pay-later"
                    name="payment"
                    value="pay-later"
                    checked={formData.paymentMethod === 'pay-later'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="text-dental-blue focus:ring-dental-blue"
                  />
                  <label htmlFor="pay-later" className="text-dental-darkgray font-medium">
                    Pagar en el consultorio
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="pay-online"
                    name="payment"
                    value="pay-online"
                    checked={formData.paymentMethod === 'pay-online'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="text-dental-blue focus:ring-dental-blue"
                  />
                  <label htmlFor="pay-online" className="text-dental-darkgray">
                    Pagar en línea (próximamente)
                  </label>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 text-dental-blue focus:ring-dental-blue"
                  required
                />
                <label htmlFor="terms" className="text-sm text-dental-darkgray">
                  Acepto los términos y condiciones, y confirmo que la información proporcionada es correcta. 
                  Entiendo que podré cancelar o reprogramar mi cita con al menos 24 horas de anticipación.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Agendar Cita" 
      size="xl"
    >
      {/* Progress Steps */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-dental-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-dental-blue' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-dental-blue' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-dental-darkgray hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            disabled={currentStep === 1 && !formData.service}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Cita</span>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentForm;
