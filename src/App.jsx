import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AppointmentBooking from './pages/AppointmentBooking'
import AdminPanel from './pages/AdminPanel'
import PatientDashboard from './pages/PatientDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Services />
                <About />
                <Contact />
              </main>
            } />
            <Route path="/agendar" element={<AppointmentBooking />} />
            <Route path="/paciente" element={
              <ProtectedRoute requireAdmin={false}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
