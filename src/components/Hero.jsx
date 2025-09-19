import { Calendar, Shield, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="inicio" className="bg-gradient-to-r from-dental-lightblue to-white">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dental-darkgray leading-tight">
                Tu Sonrisa es 
                <span className="text-dental-blue"> Nuestra</span>
                <br />
                Prioridad
              </h1>
              <p className="text-xl text-dental-gray mt-6 leading-relaxed">
                Ofrecemos servicios dentales de alta calidad con tecnología de vanguardia 
                y un equipo de profesionales altamente capacitados para cuidar tu salud bucal.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/agendar" className="btn-primary flex items-center justify-center space-x-2">
                <Calendar size={20} />
                <span>Agendar Cita</span>
              </Link>
              <a href="#servicios" className="btn-secondary">
                Conocer Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-dental-blue">15+</div>
                <div className="text-dental-gray text-sm">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-dental-blue">5000+</div>
                <div className="text-dental-gray text-sm">Pacientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-dental-blue">98%</div>
                <div className="text-dental-gray text-sm">Éxito en Tratamientos</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Placeholder para imagen - puedes reemplazar con una imagen real */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-dental-lightblue rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-16 h-16 text-dental-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-dental-darkgray mb-2">
                    Cuidamos tu Salud
                  </h3>
                  <p className="text-dental-gray">
                    Con tecnología avanzada y atención personalizada
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">100% Seguro</div>
                  <div className="text-xs text-gray-500">Protocolos COVID</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Certificados</div>
                  <div className="text-xs text-gray-500">Profesionales</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">24/7</div>
                  <div className="text-xs text-gray-500">Emergencias</div>
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
