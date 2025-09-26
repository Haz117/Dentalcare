#  DentalCare - Consultorio Dental

Una página web moderna y completa para consultorios dentales, desarrollada con React, Vite y Tailwind CSS. Incluye sistema de citas, información de servicios, y está preparada para integración con pasarelas de pago.

##  Características

###  Funcionalidades Actuales
- **Página Principal Completa**: Hero section, servicios, información del equipo
- **Sistema de Citas Avanzado**: Formulario paso a paso para agendar citas
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Información de Servicios**: Catálogo completo con precios y descripciones
- **Formulario de Contacto**: Con validación y múltiples opciones de comunicación
- **Secciones Informativas**: Sobre nosotros, equipo médico, valores

###  Preparado para el Futuro
- **Estructura para Pagos**: Base preparada para Stripe, PayPal, MercadoPago
- **API Service**: Configuración lista para backend
- **Escalabilidad**: Arquitectura modular y extensible
- **SEO Optimizado**: Meta tags y estructura semántica

##  Tecnologías

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form (ready to implement)
- **Routing**: React Router DOM (ready to implement)
- **Payment**: Stripe/PayPal integration ready

##  Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [tu-repositorio]
   cd consultorio-dental
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:3000`

##  Estructura del Proyecto

```
consultorio-dental/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx       # Navegación principal
│   │   ├── Hero.jsx         # Sección hero
│   │   ├── Services.jsx     # Catálogo de servicios
│   │   ├── About.jsx        # Información del consultorio
│   │   ├── Contact.jsx      # Formulario de contacto
│   │   └── Footer.jsx       # Pie de página
│   ├── pages/               # Páginas completas
│   │   └── AppointmentBooking.jsx  # Sistema de citas
│   ├── services/            # Servicios y APIs
│   │   ├── apiService.js    # Comunicación con backend
│   │   └── paymentService.js # Gestión de pagos
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── .env.example             # Variables de entorno ejemplo
└── README.md               # Este archivo
```

##  Personalización

### Colores del Tema
El proyecto usa un sistema de colores personalizable definido en `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Verde para elementos principales */ },
  dental: {
    blue: '#1e40af',      // Azul principal
    lightblue: '#dbeafe', // Azul claro
    white: '#ffffff',     // Blanco
    gray: '#6b7280',      // Gris texto
    darkgray: '#374151'   // Gris oscuro
  }
}
```

### Componentes Personalizables
- **Header**: Logo, menú de navegación, información de contacto
- **Services**: Servicios ofrecidos, precios, descripciones
- **About**: Información del equipo médico, valores, misión
- **Contact**: Formularios, información de contacto, horarios

##  Integración de Pagos

El proyecto está preparado para integrar múltiples pasarelas de pago:

### Configuración de Stripe
```javascript
// En .env
REACT_APP_PAYMENT_GATEWAY=stripe
REACT_APP_PAYMENT_API_KEY=pk_test_...
```

### Métodos de Pago Soportados
- Tarjetas de crédito/débito
- PayPal (próximamente)
- OXXO (México)
- Transferencias SPEI
- Pago en consultorio

##  Funcionalidades Móviles

- Menú hamburguesa responsivo
- Botón de llamada de emergencia flotante
- Formularios optimizados para móvil
- Navegación touch-friendly

##  Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter de código
```

##  Despliegue

### Netlify/Vercel
```bash
npm run build
# Subir carpeta dist/
```

### Manual
```bash
npm run build
# Servir archivos de dist/ con cualquier servidor web
```

##  Próximas Funcionalidades

### Corto Plazo
- [ ] Sistema de autenticación de pacientes
- [ ] Panel de administración
- [ ] Integración de calendario real
- [ ] Notificaciones por email/SMS
- [ ] Chat en tiempo real

### Mediano Plazo
- [ ] Historiales médicos digitales
- [ ] Integración con sistemas de facturación
- [ ] App móvil complementaria
- [ ] Telemedicina básica
- [ ] Sistema de recordatorios automáticos

### Largo Plazo
- [ ] IA para diagnósticos preliminares
- [ ] Integración con laboratorios
- [ ] Marketplace de servicios dentales
- [ ] Sistema de seguros médicos

##  Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

##  Contacto

Para consultas sobre el proyecto:
- Email: hazelalmaraz91@gmail.com
- Teléfono: 7731135626

##  Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Tu sonrisa es nuestra prioridad! **
