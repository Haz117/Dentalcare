import { useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import LoadingSpinner from './LoadingSpinner';

const AuthComponent = () => {
  const { user, login, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ya no necesitamos useEffect aquí porque el contexto maneja el estado de autenticación

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (showAdminLogin) {
        // Verificar contraseña de administrador
        const correctAdminPassword = 'admin123';
        if (formData.adminPassword !== correctAdminPassword) {
          setError('Contraseña de administrador incorrecta');
          setLoading(false);
          return;
        }
        
        // Autenticar como administrador
        login({
          email: 'admin@dentalcare.com',
          displayName: 'Administrador',
          isAdmin: true
        });
        
        // Limpiar formulario y resetear estados
        setShowAdminLogin(false);
        setFormData({
          email: '',
          password: '',
          displayName: '',
          adminPassword: ''
        });
      } else if (isLoginMode) {
        const result = await loginUser(formData.email, formData.password);
        if (!result.success) {
          setError(result.error);
        }
      } else {
        const result = await registerUser(formData.email, formData.password, formData.displayName);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (!result.success) {
      setError(result.error);
    }
    
    // Usar el contexto para hacer logout
    logout();
    
    // Resetear todos los estados
    setShowAdminLogin(false);
    setIsLoginMode(true);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      adminPassword: ''
    });
    setError('');
  };

  const handleAdminButtonClick = () => {
    console.log('Admin button clicked!'); // Para debug
    setShowAdminLogin(true);
    setIsLoginMode(true);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      adminPassword: ''
    });
    setError('');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Bienvenido</h2>
        <p className="mb-4">
          Hola, {user.displayName || user.email}!
          {user.isAdmin && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>}
        </p>
        {user.isAdmin && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
            <p className="text-sm">Tienes acceso de administrador al panel de control.</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si se está mostrando el login de admin, usar el componente AdminLogin
  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLogin={(adminData) => {
          login(adminData);
          setShowAdminLogin(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {showAdminLogin ? 'Acceso de Administrador' : (isLoginMode ? 'Iniciar Sesión' : 'Registrarse')}
      </h2>
      
      {/* Botones de modo - solo mostrar si NO estamos en login de admin */}
      {!showAdminLogin && (
        <div className="mb-4 flex justify-center space-x-4">
          <button
            onClick={() => {
              setIsLoginMode(true);
              setError('');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isLoginMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Usuario
          </button>
          <button
            onClick={handleAdminButtonClick}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
          >
            🔐 Administrador
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {showAdminLogin ? (
          // Formulario SOLO para contraseña de administrador
          <>
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="text-sm font-medium">⚠️ Área Restringida</p>
              <p className="text-xs">Solo personal autorizado puede acceder</p>
            </div>
            <div className="mb-6">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                id="adminPassword"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingresa la contraseña"
                required
                autoFocus
              />
            </div>
          </>
        ) : (
          // Formulario para usuarios normales
          <>
            {!isLoginMode && (
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isLoginMode}
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
            showAdminLogin
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <LoadingSpinner size="sm" text="Verificando..." />
          ) : (
            showAdminLogin ? '🔓 Acceder como Admin' : 
            (isLoginMode ? 'Iniciar Sesión' : 'Registrarse')
          )}
        </button>
      </form>

      {/* Botón para volver si estamos en modo admin */}
      {showAdminLogin && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setShowAdminLogin(false);
              setFormData({ ...formData, adminPassword: '' });
              setError('');
            }}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            ← Volver al inicio de sesión normal
          </button>
        </div>
      )}

      {/* Toggle login/register solo para usuarios normales */}
      {!showAdminLogin && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;