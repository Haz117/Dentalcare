import { Calendar, Shield, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="inicio" className="bg-gradient-to-br from-dental-lightblue via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-dental-blue/10 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dental-darkgray leading-tight">
                Tu Sonrisa es 
                <span className="text-dental-blue bg-gradient-to-r from-dental-blue to-blue-600 bg-clip-text text-transparent"> Nuestra</span>
                <br />
                <span className="relative">
                  Prioridad
                  <div className="absolute bottom-0 left-0 w-full h-3 bg-dental-blue/20 -z-10 transform -skew-x-12"></div>
                </span>
              </h1>
              <p className="text-xl text-dental-gray mt-6 leading-relaxed">
                Ofrecemos servicios dentales de alta calidad con tecnología de vanguardia 
                y un equipo de profesionales altamente capacitados para cuidar tu salud bucal.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/agendar" className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4">
                <Calendar size={24} />
                <span>Agendar Cita</span>
              </Link>
              <a href="#servicios" className="btn-secondary text-lg px-8 py-4">
                Conocer Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-dental-blue pulse-slow group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-dental-gray text-sm font-medium">Años de Experiencia</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-dental-blue pulse-slow group-hover:scale-110 transition-transform duration-300">5000+</div>
                <div className="text-dental-gray text-sm font-medium">Pacientes Satisfechos</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-dental-blue pulse-slow group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-dental-gray text-sm font-medium">Éxito en Tratamientos</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative z-10 floating-animation">
              {/* Contenedor principal mejorado */}
              <div className="glass-effect rounded-3xl p-8 aspect-square flex items-center justify-center backdrop-blur-lg border border-white/30">
                <div className="text-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-dental-blue to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84l.89 1.22C9.83 19.03 12 21.5 12 21.5s2.17-2.47 4.7-6.44l.89-1.22C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-dental-darkgray mb-3 bg-gradient-to-r from-dental-darkgray to-gray-600 bg-clip-text text-transparent">
                    Cuidamos tu Salud
                  </h3>
                  <p className="text-dental-gray text-lg leading-relaxed">
                    Con tecnología avanzada y atención personalizada para toda la familia
                  </p>
                  
                  {/* Indicadores adicionales */}
                  <div className="flex justify-center space-x-4 mt-6">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-medium">Disponible</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-700 font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards mejoradas */}
            <div className="absolute -top-6 -left-6 glass-effect rounded-xl p-4 z-20 floating-animation border border-white/30" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-dental-darkgray">100% Seguro</div>
                  <div className="text-xs text-dental-gray">Protocolos COVID</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 glass-effect rounded-xl p-4 z-20 floating-animation border border-white/30" style={{animationDelay: '3s'}}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-3 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-dental-darkgray">Certificados</div>
                  <div className="text-xs text-dental-gray">Profesionales</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-10 glass-effect rounded-xl p-4 z-20 floating-animation border border-white/30" style={{animationDelay: '5s'}}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-dental-darkgray">24/7</div>
                  <div className="text-xs text-dental-gray">Emergencias</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
