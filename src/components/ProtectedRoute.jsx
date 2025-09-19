import { useAuth } from '../contexts/AuthContext';
import AuthComponent from './AuthComponent';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dental-blue"></div>
      </div>
    );
  }

  // Si no está autenticado, mostrar componente de autenticación
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="text-center">
              <strong>Acceso restringido:</strong> Debes iniciar sesión para acceder a esta página.
            </p>
          </div>
          <AuthComponent />
        </div>
      </div>
    );
  }

  // Si requiere admin y el usuario no es admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-center">
              <strong>Acceso denegado:</strong> Solo los administradores pueden acceder a esta página.
            </p>
          </div>
          <AuthComponent />
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el componente protegido
  return children;
};

export default ProtectedRoute;