import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors">
                Inicio
              </Link>
              <a href="#servicios" className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors">
                Servicios
              </a>
              <a href="#nosotros" className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors">
                Nosotros
              </a>
              <a href="#contacto" className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors">
                Contacto
              </a>
              <Link to="/admin" className="text-dental-darkgray hover:text-dental-blue px-3 py-2 text-sm font-medium transition-colors">
                Admin
              </Link>
              <Link to="/agendar" className="btn-primary">
                Agendar Cita
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-dental-darkgray hover:text-dental-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dental-blue"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-4">
              <Link to="/" className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium">
                Inicio
              </Link>
              <a href="#servicios" className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium">
                Servicios
              </a>
              <a href="#nosotros" className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium">
                Nosotros
              </a>
              <a href="#contacto" className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium">
                Contacto
              </a>
              <Link to="/admin" className="text-dental-darkgray hover:text-dental-blue block px-3 py-2 text-base font-medium">
                Admin
              </Link>
              <Link to="/agendar" className="btn-primary w-full mt-4 block text-center">
                Agendar Cita
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
