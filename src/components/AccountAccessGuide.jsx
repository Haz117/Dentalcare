import { useState } from 'react';
import { User, Mail, Lock, Info, CheckCircle, AlertCircle } from 'lucide-react';

const AccountAccessGuide = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6" />
            <h3 className="text-xl font-bold">¿Cómo acceder a mi cuenta?</h3>
          </div>
          <Info className={`w-5 h-5 transform transition-transform ${showGuide ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showGuide && (
        <div className="p-6 space-y-6">
          {/* Pasos para acceder */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Pasos para iniciar sesión:</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="font-semibold text-blue-900">Ve a "Iniciar Sesión"</h5>
                  <p className="text-sm text-blue-700">Busca el botón "Usuario" en la página principal o en el menú</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="font-semibold text-emerald-900">Ingresa tus datos</h5>
                  <div className="text-sm text-emerald-700 space-y-1">
                    <p>📧 <strong>Email:</strong> El mismo que usaste al agendar</p>
                    <p>🔒 <strong>Contraseña:</strong> La que creaste en el formulario</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="font-semibold text-purple-900">¡Accede a tu cuenta!</h5>
                  <p className="text-sm text-purple-700">Podrás ver tu historial de citas y gestionar tus próximas visitas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información sobre emails */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Sobre los emails de verificación:</h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">¿No recibiste el email de verificación?</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Revisa tu carpeta de SPAM o correo no deseado</li>
                    <li>• El email puede tardar hasta 5-10 minutos en llegar</li>
                    <li>• Verifica que escribiste correctamente tu email</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">¡No te preocupes!</p>
                  <p className="text-sm text-green-700">Puedes usar tu cuenta sin verificar el email. La verificación es opcional pero recomendada para mayor seguridad.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Enlaces útiles:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="/#auth" 
                className="flex items-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Ir a Iniciar Sesión</span>
              </a>
              <a 
                href="/agendar" 
                className="flex items-center space-x-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Agendar Nueva Cita</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountAccessGuide;