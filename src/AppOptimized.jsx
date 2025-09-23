import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PWAPrompt from './components/PWAPrompt';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy loading de componentes principales
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

// Lazy loading de páginas
const AppointmentBooking = lazy(() => import('./pages/AppointmentBooking'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const FirebaseTestPanel = lazy(() => import('./components/FirebaseTestPanel'));

// Lazy loading de componentes protegidos
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Componente de suspense personalizado
const PageSuspense = ({ children, fallback }) => (
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
);

// Componente principal optimizado
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Header />
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
          <PWAPrompt />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;