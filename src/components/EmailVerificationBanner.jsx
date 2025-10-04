import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendVerificationEmail, reloadUser } from '../services/emailVerificationService';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSent, setLastSent] = useState(null);

  useEffect(() => {
    if (user) {
      setIsVerified(user.emailVerified || false);
    }
  }, [user]);

  const handleSendVerification = async () => {
    if (!user) return;

    // Prevenir spam de emails (cooldown de 60 segundos)
    const now = Date.now();
    if (lastSent && (now - lastSent) < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSent)) / 1000);
      setMessage(`⏱️ Espera ${remaining} segundos antes de enviar otro email`);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await sendVerificationEmail(user);
      if (result.success) {
        setMessage('📧 Email de verificación enviado. Revisa tu bandeja de entrada');
        setLastSent(now);
      } else {
        setMessage('❌ Error al enviar email: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Error inesperado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await reloadUser();
      if (result.success) {
        setIsVerified(result.emailVerified);
        if (result.emailVerified) {
          setMessage('✅ ¡Email verificado exitosamente!');
        } else {
          setMessage('⏳ Email aún no verificado. Revisa tu correo');
        }
      }
    } catch (error) {
      setMessage('❌ Error al verificar estado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // No mostrar el banner si no hay usuario o si ya está verificado
  if (!user || isVerified) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <h4 className="text-amber-800 font-semibold mb-1">
            Email sin verificar
          </h4>
          <p className="text-amber-700 text-sm mb-3">
            Para mayor seguridad, verifica tu dirección de email <strong>{user.email}</strong>
          </p>
          
          {message && (
            <div className="mb-3 p-2 bg-white rounded text-sm">
              {message}
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={handleSendVerification}
              disabled={loading}
              className="bg-amber-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-1" />
              )}
              {loading ? 'Enviando...' : 'Enviar email'}
            </button>
            
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Ya verifiqué
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;