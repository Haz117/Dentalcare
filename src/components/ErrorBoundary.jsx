import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Captura información del error para logging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí podrías enviar el error a un servicio de logging
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
            {/* Icono de error */}
            <div className="mb-6">
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Oops! Algo salió mal
              </h1>
              <p className="text-lg text-gray-600">
                Hemos encontrado un problema inesperado. Nuestro equipo ha sido notificado.
              </p>
            </div>

            {/* Mensaje de error en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Información del error (solo visible en desarrollo):
                </h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-40">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-6 py-3 bg-dental-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Recargar página
              </button>
              
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Home className="w-5 h-5 mr-2" />
                Ir al inicio
              </Link>
            </div>

            {/* Información de contacto */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Si el problema persiste, puedes contactarnos:
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-dental-blue">
                  📞 +52 (555) 123-4567
                </p>
                <p className="text-sm font-medium text-dental-blue">
                  ✉️ contacto@consultoriodental.com
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;