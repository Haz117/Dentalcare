// API Service for backend communication
// Handles appointments, patients, payments, etc.

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.timeout = 10000; // 10 seconds
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      // Simulate API response for development
      return this.simulateAPIResponse(endpoint, options);
      
      // In production, use actual fetch:
      // const response = await fetch(url, config);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // return await response.json();
      
    } catch (error) {
      console.error('API Request failed:', error);
      throw new Error(`API Error: ${error.message}`);
    }
  }

  // Simulate API responses for development
  async simulateAPIResponse(endpoint, options) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const method = options.method || 'GET';
    
    // Simulate different endpoints
    if (endpoint === '/appointments' && method === 'POST') {
      return {
        success: true,
        data: {
          id: `apt_${Date.now()}`,
          ...JSON.parse(options.body),
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      };
    }

    if (endpoint === '/appointments/availability') {
      return {
        success: true,
        data: {
          available_slots: [
            '9:00 AM', '10:00 AM', '11:00 AM', 
            '2:00 PM', '3:00 PM', '4:00 PM'
          ]
        }
      };
    }

    if (endpoint.startsWith('/appointments/')) {
      return {
        success: true,
        data: {
          id: endpoint.split('/')[2],
          service: 'Consulta General',
          date: '2024-01-15',
          time: '10:00 AM',
          status: 'confirmed'
        }
      };
    }

    return { success: true, data: {} };
  }

  // Appointment methods
  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointment(appointmentId) {
    return this.request(`/appointments/${appointmentId}`);
  }

  async updateAppointment(appointmentId, updates) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelAppointment(appointmentId, reason = '') {
    return this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getAvailableSlots(date, serviceId) {
    return this.request(`/appointments/availability?date=${date}&service=${serviceId}`);
  }

  // Patient methods
  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async getPatient(patientId) {
    return this.request(`/patients/${patientId}`);
  }

  async updatePatient(patientId, updates) {
    return this.request(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Service methods
  async getServices() {
    return this.request('/services');
  }

  async getService(serviceId) {
    return this.request(`/services/${serviceId}`);
  }

  // Payment methods
  async createPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPayment(paymentId) {
    return this.request(`/payments/${paymentId}`);
  }

  async refundPayment(paymentId, amount, reason) {
    return this.request(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  }

  // Contact/Communication methods
  async sendContactMessage(messageData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async sendAppointmentConfirmation(appointmentId) {
    return this.request(`/appointments/${appointmentId}/send-confirmation`, {
      method: 'POST',
    });
  }

  async sendAppointmentReminder(appointmentId) {
    return this.request(`/appointments/${appointmentId}/send-reminder`, {
      method: 'POST',
    });
  }

  // Analytics/Reports (for admin dashboard)
  async getAppointmentStats(startDate, endDate) {
    return this.request(`/analytics/appointments?start=${startDate}&end=${endDate}`);
  }

  async getRevenueStats(startDate, endDate) {
    return this.request(`/analytics/revenue?start=${startDate}&end=${endDate}`);
  }

  // File upload (for patient documents, x-rays, etc.)
  async uploadFile(file, type = 'document') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it for FormData
      },
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
