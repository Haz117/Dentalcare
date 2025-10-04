// Versión sin lazy loading para casos problemáticos
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import EmergencyButton from './components/EmergencyButton';
import Breadcrumbs from './components/Breadcrumbs';
import { BackToTopButton } from './components/BackToTopButton';
import { useSEO } from './hooks/useSEO';
import { useAnalyticsTracking } from './services/analyticsService';
import { AuthProvider } from './contexts/AuthContext';

// Importación directa (sin lazy loading)
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import AppointmentBooking from './pages/AppointmentBooking';
import AdminPanel from './pages/AdminPanel';
import PatientDashboard from './pages/PatientDashboard';
import FirebaseTestPanel from './components/FirebaseTestPanel';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  // Hooks para SEO y Analytics
  useSEO();
  const { trackEvent } = useAnalyticsTracking();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Header />
          <Breadcrumbs />
          
          <Routes>
            {/* Página principal */}
            <Route 
              path="/" 
              element={
                <main>
                  <Hero />
                  <Services />
                  <About />
                  <Contact />
                </main>
              } 
            />
            
            {/* Páginas directas */}
            <Route path="/agendar" element={<AppointmentBooking />} />
            <Route path="/paciente" element={<PatientDashboard />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-firebase" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <FirebaseTestPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
          {/* Componentes globales */}
          <EmergencyButton />
          <BackToTopButton />
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;