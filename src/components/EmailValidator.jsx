import { useState, useCallback, useEffect } from 'react';
import { checkEmailExists } from '../services/authService';
import { Check, X, Loader2, AlertTriangle, Mail } from 'lucide-react';

const EmailValidator = ({ 
  email, 
  onValidationChange, 
  disabled = false,
  showSuggestions = true 
}) => {
  const [status, setStatus] = useState('idle'); // idle, checking, valid, invalid, exists
  const [message, setMessage] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce para evitar muchas consultas mientras el usuario escribe
  const debounceCheck = useCallback(
    async (emailToCheck) => {
      if (!emailToCheck || emailToCheck.length < 5) {
        setStatus('idle');
        setMessage('');
        return;
      }

      // Validar formato básico primero
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToCheck)) {
        setStatus('invalid');
        setMessage('Formato de email inválido');
        onValidationChange?.(false, 'Formato de email inválido');
        return;
      }

      setStatus('checking');
      setMessage('Verificando disponibilidad...');

      try {
        const result = await checkEmailExists(emailToCheck);
        
        if (result.exists) {
          setStatus('exists');
          setMessage('Este email ya está registrado');
          onValidationChange?.(false, 'Este email ya está registrado');
        } else {
          setStatus('valid');
          setMessage('Email disponible');
          onValidationChange?.(true, '');
        }
      } catch (error) {
        setStatus('invalid');
        setMessage('Error al verificar el email');
        onValidationChange?.(false, 'Error al verificar el email');
      }
    },
    [onValidationChange]
  );

  // Effect para manejar el debounce
  useEffect(() => {
    if (!email || disabled) {
      setStatus('idle');
      setMessage('');
      return;
    }

    setIsDebouncing(true);
    const timeoutId = setTimeout(() => {
      setIsDebouncing(false);
      debounceCheck(email);
    }, 800); // Esperar 800ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [email, debounceCheck, disabled]);

  const getIcon = () => {
    if (disabled) return null;
    
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'valid':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'invalid':
      case 'exists':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return isDebouncing ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin" /> : null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600';
      case 'valid':
        return 'text-green-600';
      case 'invalid':
      case 'exists':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getSuggestions = () => {
    if (!showSuggestions || status !== 'exists') return null;

    return (
      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 font-medium text-sm mb-2">
              Ya tienes una cuenta con este email
            </p>
            <div className="space-y-1">
              <button className="text-blue-600 hover:text-blue-800 text-sm underline block">
                🔑 Iniciar sesión en su lugar
              </button>
              <button className="text-purple-600 hover:text-purple-800 text-sm underline block">
                🔄 ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!email || disabled) return null;

  return (
    <div className="mt-1">
      {(status !== 'idle' || isDebouncing) && (
        <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
          {getIcon()}
          <span>{message}</span>
        </div>
      )}
      {getSuggestions()}
    </div>
  );
};

export default EmailValidator;