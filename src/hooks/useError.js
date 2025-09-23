import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejo de errores
 * Proporciona estado de error y funciones para manejar errores de forma consistente
 */
export const useError = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const showError = useCallback((errorMessage, details = null) => {
    setError({
      message: errorMessage,
      details: details,
      timestamp: new Date().toISOString()
    });
    setIsError(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const handleAsyncError = useCallback(async (asyncFunction, customErrorMessage = 'Ha ocurrido un error') => {
    try {
      clearError();
      return await asyncFunction();
    } catch (err) {
      console.error('Error capturado por useError:', err);
      
      let errorMessage = customErrorMessage;
      
      // Manejo específico para diferentes tipos de errores
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'El email ya está en uso';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es muy débil';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Error de conexión. Verifica tu internet';
            break;
          default:
            errorMessage = err.message || customErrorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      showError(errorMessage, err);
      throw err; // Re-lanzar para que el componente pueda manejarlo si es necesario
    }
  }, [showError, clearError]);

  return {
    error,
    isError,
    showError,
    clearError,
    handleAsyncError
  };
};

/**
 * Hook para validaciones de formularios
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password) => {
    return password.length >= 6;
  }, []);

  const validateRequired = useCallback((value) => {
    return value && value.trim().length > 0;
  }, []);

  const validateField = useCallback((fieldName, value, validationRules) => {
    const fieldErrors = [];

    validationRules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (!validateRequired(value)) {
            fieldErrors.push(rule.message || 'Este campo es requerido');
          }
          break;
        case 'email':
          if (value && !validateEmail(value)) {
            fieldErrors.push(rule.message || 'Email inválido');
          }
          break;
        case 'password':
          if (value && !validatePassword(value)) {
            fieldErrors.push(rule.message || 'La contraseña debe tener al menos 6 caracteres');
          }
          break;
        case 'minLength':
          if (value && value.length < rule.value) {
            fieldErrors.push(rule.message || `Mínimo ${rule.value} caracteres`);
          }
          break;
        case 'maxLength':
          if (value && value.length > rule.value) {
            fieldErrors.push(rule.message || `Máximo ${rule.value} caracteres`);
          }
          break;
        case 'custom':
          if (rule.message) {
            fieldErrors.push(rule.message);
          }
          break;
      }
    });

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));

    return fieldErrors.length === 0;
  }, [validateEmail, validatePassword, validateRequired]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    clearErrors,
    clearFieldError,
    validateEmail,
    validatePassword,
    validateRequired
  };
};

export default useError;