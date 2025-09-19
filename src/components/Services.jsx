import { 
  Smile, 
  Sparkles, 
  Shield, 
  Scissors, 
  Heart, 
  Baby,
  Crown,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <Smile className="w-8 h-8" />,
      title: "Odontología General",
      description: "Consultas, limpiezas, empastes y tratamientos preventivos para mantener tu salud bucal.",
      price: "Desde $500",
      features: ["Consulta inicial", "Limpieza dental", "Revisión completa"]
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Blanqueamiento Dental",
      description: "Tratamientos de blanqueamiento seguros y efectivos para una sonrisa más brillante.",
      price: "Desde $2,500",
      features: ["Blanqueamiento láser", "Kit para casa", "Seguimiento"]
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Coronas y Puentes",
      description: "Restauraciones dentales duraderas y estéticamente perfectas.",
      price: "Desde $8,000",
      features: ["Coronas de porcelana", "Puentes fijos", "Garantía 5 años"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Implantes Dentales",
      description: "Soluciones permanentes para reemplazar dientes perdidos con tecnología avanzada.",
      price: "Desde $15,000",
      features: ["Implante titanio", "Corona incluida", "Cirugía guiada"]
    },
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Cirugía Oral",
      description: "Extracciones, cirugías menores y tratamientos quirúrgicos especializados.",
      price: "Desde $1,200",
      features: ["Extracciones", "Cirugía oral", "Sedación disponible"]
    },
    {
      icon: <Baby className="w-8 h-8" />,
      title: "Odontopediatría",
      description: "Cuidado dental especializado para niños en un ambiente amigable y seguro.",
      price: "Desde $400",
      features: ["Consulta pediátrica", "Selladores", "Educación dental"]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Endodoncia",
      description: "Tratamientos de conducto para salvar dientes dañados o infectados.",
      price: "Desde $3,500",
      features: ["Tratamiento conducto", "Anestesia local", "Corona temporal"]
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Periodoncia",
      description: "Tratamiento especializado de encías y estructuras de soporte dental.",
      price: "Desde $2,000",
      features: ["Limpieza profunda", "Tratamiento encías", "Mantenimiento"]
    }
  ];

  return (
    <section id="servicios" className="bg-gray-50 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dental-darkgray mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-dental-gray max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios dentales utilizando la tecnología más avanzada 
            y técnicas modernas para garantizar tu comodidad y los mejores resultados.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card group">
              {/* Icon */}
              <div className="bg-dental-lightblue text-dental-blue rounded-lg w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-dental-blue group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-dental-darkgray">
                  {service.title}
                </h3>
                
                <p className="text-dental-gray text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-dental-gray flex items-center">
                      <div className="w-2 h-2 bg-dental-blue rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-dental-blue mb-4">
                    {service.price}
                  </div>
                  
                  <button className="w-full bg-white border-2 border-dental-blue text-dental-blue py-2 px-4 rounded-lg hover:bg-dental-blue hover:text-white transition-colors duration-200 text-sm font-semibold">
                    Más Información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-dental-darkgray mb-4">
              ¿No encuentras el servicio que necesitas?
            </h3>
            <p className="text-dental-gray mb-8 text-lg">
              Contamos con especialistas en todas las áreas de la odontología. 
              Contáctanos para una consulta personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/agendar" className="btn-primary">
                Agendar Consulta
              </Link>
              <a href="tel:+52555123456" className="btn-secondary">
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
