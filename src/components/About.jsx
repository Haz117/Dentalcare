import { Users, Award, Clock, Heart, CheckCircle, Star } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. María González",
      specialty: "Directora y Odontóloga General",
      experience: "15 años de experiencia",
      education: "Universidad Nacional de Odontología",
      image: "/api/placeholder/300/300" // Placeholder
    },
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Especialista en Implantes",
      experience: "12 años de experiencia",
      education: "Maestría en Cirugía Oral",
      image: "/api/placeholder/300/300" // Placeholder
    },
    {
      name: "Dra. Ana López",
      specialty: "Odontopediatra",
      experience: "10 años de experiencia",
      education: "Especialidad en Odontopediatría",
      image: "/api/placeholder/300/300" // Placeholder
    }
  ];

  const achievements = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "5000+",
      description: "Pacientes Atendidos"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "15+",
      description: "Años de Experiencia"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7",
      description: "Urgencias Disponibles"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "98%",
      description: "Satisfacción del Cliente"
    }
  ];

  const values = [
    {
      title: "Excelencia Profesional",
      description: "Nos comprometemos a brindar servicios de la más alta calidad utilizando las mejores técnicas y tecnologías disponibles."
    },
    {
      title: "Atención Personalizada",
      description: "Cada paciente es único, por lo que adaptamos nuestros tratamientos a las necesidades específicas de cada persona."
    },
    {
      title: "Tecnología Avanzada",
      description: "Invertimos en equipos de última generación para ofrecer tratamientos más precisos, cómodos y eficaces."
    },
    {
      title: "Ambiente Cálido",
      description: "Creamos un ambiente relajado y acogedor para que te sientas cómodo durante tu visita."
    }
  ];

  return (
    <section id="nosotros" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dental-darkgray mb-6">
            Conoce Nuestro Equipo
          </h2>
          <p className="text-xl text-dental-gray max-w-3xl mx-auto">
            Somos un equipo de profesionales altamente capacitados, comprometidos con 
            brindarte la mejor atención dental en un ambiente cálido y profesional.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-dental-lightblue to-white rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-dental-darkgray mb-6">
                Nuestra Misión
              </h3>
              <p className="text-dental-gray text-lg leading-relaxed mb-6">
                Transformar vidas a través de sonrisas saludables, brindando atención dental 
                integral con los más altos estándares de calidad, tecnología avanzada y un 
                toque humano que hace la diferencia.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dental-darkgray">Atención integral y personalizada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dental-darkgray">Tecnología de vanguardia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-dental-darkgray">Profesionales certificados</span>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-dental-lightblue text-dental-blue rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl font-bold text-dental-blue mb-2">
                    {achievement.title}
                  </div>
                  <div className="text-dental-gray text-sm">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-dental-darkgray text-center mb-12">
            Nuestro Equipo Profesional
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center">
                {/* Photo placeholder */}
                <div className="w-32 h-32 bg-dental-lightblue rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-dental-blue" />
                </div>
                
                <h4 className="text-xl font-bold text-dental-darkgray mb-2">
                  {member.name}
                </h4>
                
                <p className="text-dental-blue font-semibold mb-2">
                  {member.specialty}
                </p>
                
                <p className="text-dental-gray text-sm mb-2">
                  {member.experience}
                </p>
                
                <p className="text-dental-gray text-sm mb-4">
                  {member.education}
                </p>

                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <button className="text-dental-blue hover:text-dental-darkgray text-sm font-semibold">
                  Ver Perfil Completo
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-3xl font-bold text-dental-darkgray text-center mb-12">
            Nuestros Valores
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex space-x-4">
                <div className="bg-dental-lightblue rounded-lg p-3 h-fit">
                  <CheckCircle className="w-6 h-6 text-dental-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-dental-darkgray mb-3">
                    {value.title}
                  </h4>
                  <p className="text-dental-gray leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-dental-darkgray mb-4">
            ¿Listo para conocernos?
          </h3>
          <p className="text-dental-gray mb-8">
            Agenda una consulta y descubre por qué somos la mejor opción para tu salud dental.
          </p>
          <button className="btn-primary">
            Agendar Consulta Gratuita
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
