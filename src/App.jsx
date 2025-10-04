import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import EmergencyButton from './components/EmergencyButton';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingSpinner from './components/LoadingSpinner';
import { BackToTopButton } from './components/BackToTopButton';
import { useSEO } from './hooks/useSEO';
import { useAnalyticsTracking } from './services/analyticsService';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy loading de componentes principales con manejo de errores
const Hero = lazy(() => 
  import('./components/Hero').catch(err => {
    console.error('Error loading Hero:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar el hero</div> };
  })
);

const Services = lazy(() => 
  import('./components/Services').catch(err => {
    console.error('Error loading Services:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar los servicios</div> };
  })
);

const About = lazy(() => 
  import('./components/About').catch(err => {
    console.error('Error loading About:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar la información</div> };
  })
);

const Contact = lazy(() => 
  import('./components/Contact').catch(err => {
    console.error('Error loading Contact:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar el contacto</div> };
  })
);

// Lazy loading de páginas con manejo de errores
const AppointmentBooking = lazy(() => 
  import('./pages/AppointmentBooking').catch(err => {
    console.error('Error loading AppointmentBooking:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar la página de citas</div> };
  })
);

const AdminPanel = lazy(() => 
  import('./pages/AdminPanel').catch(err => {
    console.error('Error loading AdminPanel:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar el panel de administración</div> };
  })
);

const PatientDashboard = lazy(() => 
  import('./pages/PatientDashboard').catch(err => {
    console.error('Error loading PatientDashboard:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar el dashboard del paciente</div> };
  })
);

const FirebaseTestPanel = lazy(() => 
  import('./components/FirebaseTestPanel').catch(err => {
    console.error('Error loading FirebaseTestPanel:', err);
    return { default: () => <div className="p-8 text-center text-red-600">Error al cargar el panel de pruebas</div> };
  })
);

// Importación directa de componentes que usan contexto
import ProtectedRoute from './components/ProtectedRoute';

// Componente de suspense personalizado con manejo de errores
const PageSuspense = ({ children, fallback }) => (
  <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">Error al cargar el componente</div>}>
    <Suspense 
      fallback={
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="lg" text="Cargando..." />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

function App() {
  // Hooks para SEO y Analytics
  useSEO(); // SEO dinámico por página
  const { trackEvent } = useAnalyticsTracking(); // Analytics tracking

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Header />
          <Breadcrumbs />
          
          <Routes>
            {/* Página principal con componentes lazy */}
            <Route 
              path="/" 
              element={
                <main>
                  <PageSuspense
                    fallback={
                      <div className="h-screen flex items-center justify-center">
                        <LoadingSpinner size="lg" text="Cargando página principal..." />
                      </div>
                    }
                  >
                    <Hero />
                  </PageSuspense>
                  
                  <PageSuspense
                    fallback={
                      <div className="h-96 flex items-center justify-center">
                        <LoadingSpinner text="Cargando servicios..." />
                      </div>
                    }
                  >
                    <Services />
                  </PageSuspense>
                  
                  <PageSuspense
                    fallback={
                      <div className="h-96 flex items-center justify-center">
                        <LoadingSpinner text="Cargando información..." />
                      </div>
                    }
                  >
                    <About />
                  </PageSuspense>
                  
                  <PageSuspense
                    fallback={
                      <div className="h-96 flex items-center justify-center">
                        <LoadingSpinner text="Cargando contacto..." />
                      </div>
                    }
                  >
                    <Contact />
                  </PageSuspense>
                </main>
              } 
            />
            
            {/* Páginas con lazy loading */}
            <Route 
              path="/agendar" 
              element={
                <PageSuspense>
                  <AppointmentBooking />
                </PageSuspense>
              } 
            />
            
            <Route 
              path="/paciente" 
              element={
                <PageSuspense>
                  <ProtectedRoute requireAdmin={false}>
                    <PatientDashboard />
                  </ProtectedRoute>
                </PageSuspense>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <PageSuspense>
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                </PageSuspense>
              } 
            />
            
            <Route 
              path="/firebase-test" 
              element={
                <PageSuspense>
                  <FirebaseTestPanel />
                </PageSuspense>
              } 
            />
          </Routes>
          
          <Footer />
          <EmergencyButton />
          <BackToTopButton />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
