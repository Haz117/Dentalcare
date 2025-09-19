import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AppointmentBooking from './pages/AppointmentBooking'
import AdminPanel from './pages/AdminPanel'
import './index.css'

function App() {
  return (
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
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
