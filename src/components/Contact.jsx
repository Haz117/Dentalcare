import { MapPin, Phone, Mail, Clock, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Dirección",
      details: ["Av. Principal 123", "Col. Centro, Ciudad", "CP 12345"],
      action: "Ver en Google Maps",
      actionLink: "https://maps.google.com"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Teléfonos",
      details: ["+52 (555) 123-4567", "+52 (555) 987-6543", "Urgencias: +52 (555) 911-2211"],
      action: "Llamar Ahora",
      actionLink: "tel:+525551234567"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      details: ["contacto@consultoriodental.com", "citas@consultoriodental.com", "urgencias@consultoriodental.com"],
      action: "Enviar Email",
      actionLink: "mailto:contacto@consultoriodental.com"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horarios de Atención",
      details: ["Lun - Vie: 8:00 AM - 7:00 PM", "Sábados: 9:00 AM - 2:00 PM", "Domingos: Solo urgencias"],
      action: "Agendar Cita",
      actionLink: "/agendar"
    }
  ];

  const features = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Equipo Profesional",
      description: "Dentistas certificados con más de 15 años de experiencia"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Tecnología Avanzada",
      description: "Equipos de última generación para tratamientos precisos"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Atención Personalizada",
      description: "Cada paciente recibe un plan de tratamiento único"
    }
  ];
  return (
    <section id="contacto" className="bg-gradient-to-br from-gray-50 to-white section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-dental-darkgray mb-6">
            Contáctanos
          </h2>
          <p className="text-xl text-dental-gray max-w-4xl mx-auto leading-relaxed">
            Estamos aquí para atenderte con la mejor atención dental. Agenda tu cita o contáctanos 
            para cualquier consulta. ¡Tu sonrisa es nuestra prioridad!
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {contactInfo.map((info, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-dental-blue to-blue-600 text-white rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                {info.icon}
              </div>
              
              <h4 className="font-bold text-dental-darkgray mb-4 text-xl">
                {info.title}
              </h4>
              
              <div className="space-y-2 mb-6">
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-dental-gray">
                    {detail}
                  </p>
                ))}
              </div>
              
              {info.actionLink.startsWith('/') ? (
                <Link 
                  to={info.actionLink}
                  className="inline-flex items-center text-dental-blue hover:text-blue-600 font-semibold transition-colors"
                >
                  {info.action} →
                </Link>
              ) : (
                <a 
                  href={info.actionLink}
                  className="inline-flex items-center text-dental-blue hover:text-blue-600 font-semibold transition-colors"
                >
                  {info.action} →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-20">
          <h3 className="text-3xl font-bold text-dental-darkgray text-center mb-12">
            ¿Por qué elegir nuestro consultorio?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-dental-lightblue text-dental-blue rounded-2xl p-6 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-dental-darkgray mb-4 text-xl">
                  {feature.title}
                </h4>
                <p className="text-dental-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-dental-blue to-blue-600 rounded-3xl p-12 text-center text-white mb-20">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para mejorar tu sonrisa?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Agenda tu cita hoy mismo y descubre por qué somos el consultorio dental de confianza 
            de miles de pacientes satisfechos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agendar" className="bg-white text-dental-blue hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors">
              Agendar Cita Online
            </Link>
            <a href="tel:+525551234567" className="border-2 border-white text-white hover:bg-white hover:text-dental-blue px-8 py-4 rounded-lg font-semibold transition-colors">
              Llamar Ahora
            </a>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border-l-8 border-red-500 rounded-r-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h4 className="font-bold text-red-800 mb-2 text-xl">
                🚨 ¿Tienes una urgencia dental?
              </h4>
              <p className="text-red-700 mb-4 md:mb-0">
                Atendemos emergencias las 24 horas del día, los 7 días de la semana.
              </p>
            </div>
            <a 
              href="tel:+525559112211"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Llamar Urgencias
            </a>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h3 className="text-3xl font-bold text-dental-darkgray text-center mb-8">
              Encuéntranos
            </h3>
          </div>
          
          <div className="h-96 bg-gradient-to-br from-dental-lightblue to-blue-100 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-white rounded-full p-6 w-fit mx-auto mb-6 shadow-lg">
                <MapPin className="w-16 h-16 text-dental-blue" />
              </div>
              <h4 className="text-2xl font-bold text-dental-darkgray mb-4">
                Consultorio DentalCare
              </h4>
              <p className="text-dental-gray text-lg mb-6">
                Av. Principal 123, Col. Centro, Ciudad
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-dental-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
