import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen(!isUserMenuOpen);
  }, [isUserMenuOpen]);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
  }, [logout]);

  const closeMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar con información de contacto */}
      <div className="bg-dental-blue text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+52 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>contacto@consultoriodental.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <MapPin size={14} />
              <span>Av. Principal 123, Ciudad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-dental-blue">
              DentalCare
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-8" role="navigation" aria-label="Navegación principal">
              <Link 
                to="/" 
                className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                aria-label="Ir a la página de inicio"
              >
                Inicio
              </Link>
              <a 
                href="#servicios" 
                className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                aria-label="Ver nuestros servicios dentales"
              >
                Servicios
              </a>
              <a 
                href="#nosotros" 
                className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                aria-label="Conocer más sobre nosotros"
              >
                Nosotros
              </a>
              <a 
                href="#contacto" 
                className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                aria-label="Información de contacto"
              >
                Contacto
              </a>
              
              {/* Navegación para usuario autenticado */}
              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  {/* Enlaces específicos del usuario */}
                  {isAdmin() ? (
                    <Link 
                      to="/admin" 
                      className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Acceder al panel de administrador"
                    >
                      Panel Admin
                    </Link>
                  ) : (
                    <Link 
                      to="/paciente" 
                      className="text-emerald-600 hover:text-emerald-700 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      aria-label="Acceder a mi panel de paciente"
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span>Mi Panel</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/agendar" 
                    className="btn-primary focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                    aria-label="Agendar una nueva cita dental"
                  >
                    Agendar Cita
                  </Link>

                  {/* User Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={handleUserMenuToggle}
                      className="flex items-center space-x-2 text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                      aria-label={`Menú de usuario: ${user?.displayName || 'Usuario'}`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center" aria-hidden="true">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>{user?.displayName || 'Usuario'}</span>
                    </button>

                    {isUserMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        role="menu"
                        aria-label="Menú de usuario"
                      >
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          {user?.email}
                          {user?.isAdmin && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
                          )}
                        </div>
                        {!isAdmin() && (
                          <Link 
                            to="/paciente" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Mi Panel</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Navegación para usuarios no autenticados
                <div className="flex items-center space-x-4">
                  <Link to="/admin" className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors">
                    Acceso Admin
                  </Link>
                  <Link to="/agendar" className="btn-primary">
                    Agendar Cita
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-dental-darkgray hover:text-dental-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dental-blue"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-4" role="navigation" aria-label="Navegación móvil">
              <Link 
                to="/" 
                className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                onClick={closeMenus}
                aria-label="Ir a la página de inicio"
              >
                Inicio
              </Link>
              <a 
                href="#servicios" 
                className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                onClick={closeMenus}
                aria-label="Ver nuestros servicios dentales"
              >
                Servicios
              </a>
              <a 
                href="#nosotros" 
                className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                onClick={closeMenus}
                aria-label="Conocer más sobre nosotros"
              >
                Nosotros
              </a>
              <a 
                href="#contacto" 
                className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                onClick={closeMenus}
                aria-label="Información de contacto"
              >
                Contacto
              </a>
              {isAdmin() ? (
                <Link 
                  to="/admin" 
                  className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                  onClick={closeMenus}
                  aria-label="Acceder al panel de administrador"
                >
                  Panel Admin
                </Link>
              ) : (
                <Link 
                  to="/admin" 
                  className="text-red-600 hover:text-red-700 block px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={closeMenus}
                  aria-label="Acceso para administradores"
                >
                  Acceso Admin
                </Link>
              )}
              <Link 
                to="/agendar" 
                className="btn-primary w-full mt-4 block text-center focus:outline-none focus:ring-2 focus:ring-dental-blue focus:ring-offset-2"
                onClick={closeMenus}
                aria-label="Agendar una nueva cita dental"
              >
                Agendar Cita
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
