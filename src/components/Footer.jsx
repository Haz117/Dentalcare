import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Servicios", href: "#servicios" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
    { name: "Agendar Cita", href: "#contacto" }
  ];

  const services = [
    { name: "Odontología General", href: "#servicios" },
    { name: "Blanqueamiento Dental", href: "#servicios" },
    { name: "Implantes Dentales", href: "#servicios" },
    { name: "Ortodoncia", href: "#servicios" },
    { name: "Cirugía Oral", href: "#servicios" }
  ];

  const legalLinks = [
    { name: "Política de Privacidad", href: "/privacy" },
    { name: "Términos y Condiciones", href: "/terms" },
    { name: "Política de Cookies", href: "/cookies" },
    { name: "Aviso Legal", href: "/legal" }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", name: "Instagram" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", name: "YouTube" }
  ];

  return (
    <footer className="bg-dental-darkgray text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                DentalCare
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Tu consultorio dental de confianza. Ofrecemos servicios de alta calidad 
                con tecnología avanzada y un equipo profesional comprometido con tu salud bucal.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-white mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-gray-700 hover:bg-dental-blue p-3 rounded-lg transition-colors duration-200"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-dental-blue rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6">Servicios</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-dental-blue rounded-full mr-3"></span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-dental-blue mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Av. Principal 123</p>
                  <p>Col. Centro, Ciudad</p>
                  <p>CP 12345</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-dental-blue flex-shrink-0" />
                <div className="text-gray-300">
                  <p>+52 (555) 123-4567</p>
                  <p className="text-sm">Urgencias: +52 (555) 911-2211</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-dental-blue flex-shrink-0" />
                <div className="text-gray-300">
                  <p>contacto@consultoriodental.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-dental-blue mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Lun - Vie: 8:00 AM - 7:00 PM</p>
                  <p>Sáb: 9:00 AM - 2:00 PM</p>
                  <p>Dom: Solo urgencias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="font-semibold text-white mb-2">
                Suscríbete a nuestro boletín
              </h4>
              <p className="text-gray-300 text-sm">
                Recibe consejos de salud dental y ofertas especiales
              </p>
            </div>

            <div className="flex max-w-md">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dental-blue focus:border-transparent"
              />
              <button className="bg-dental-blue hover:bg-blue-700 px-6 py-2 rounded-r-lg font-semibold transition-colors duration-200">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-gray-300 text-sm">
              <p className="flex items-center">
                © {currentYear} DentalCare. Todos los derechos reservados. 
                <span className="mx-2">Hecho con</span>
                <Heart className="w-4 h-4 text-red-500 mx-1" />
                <span>para tu sonrisa.</span>
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex flex-wrap gap-4">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
