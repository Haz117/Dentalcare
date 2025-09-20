import { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, Stethoscope, Activity, Calendar, Users } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular autenticación
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'dental2024') {
        onLogin({
          email: 'admin@dentalcare.com',
          displayName: 'Dr. Administrador',
          isAdmin: true
        });
      } else {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f9ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="w-full max-w-md relative">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel Administrativo</h1>
          <p className="text-gray-600">Consultorio Dental</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with stats preview */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6">
            <div className="text-center text-white">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h2 className="text-xl font-semibold">Acceso Seguro</h2>
              <p className="text-blue-100 text-sm mt-1">Administración del consultorio</p>
            </div>
            
            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mx-auto text-white mb-1" />
                  <div className="text-white text-xs font-medium">Citas Hoy</div>
                  <div className="text-white text-sm font-bold">12</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <Users className="w-5 h-5 mx-auto text-white mb-1" />
                  <div className="text-white text-xs font-medium">Pacientes</div>
                  <div className="text-white text-sm font-bold">156</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <Activity className="w-5 h-5 mx-auto text-white mb-1" />
                  <div className="text-white text-xs font-medium">Estado</div>
                  <div className="text-emerald-200 text-sm font-bold">Activo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-emerald-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                ¿Olvidaste tu contraseña?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contacta al soporte técnico
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 Consultorio Dental. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;