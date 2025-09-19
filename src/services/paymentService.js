// Payment Service - Ready for future integration with payment gateways
// Supports: Stripe, PayPal, Mercado Pago, Conekta, OpenPay, etc.

class PaymentService {
  constructor() {
    this.paymentGateway = process.env.REACT_APP_PAYMENT_GATEWAY || 'stripe';
    this.apiKey = process.env.REACT_APP_PAYMENT_API_KEY;
    this.isTestMode = process.env.REACT_APP_PAYMENT_TEST_MODE === 'true';
  }

  // Initialize payment gateway (Stripe example)
  async initializeStripe() {
    if (this.paymentGateway === 'stripe') {
      // This would load Stripe.js in production
      console.log('Initializing Stripe...');
      // const stripe = await loadStripe(this.apiKey);
      // return stripe;
    }
  }

  // Initialize MercadoPago (popular in Latin America)
  async initializeMercadoPago() {
    if (this.paymentGateway === 'mercadopago') {
      console.log('Initializing MercadoPago...');
      // Load MercadoPago SDK
    }
  }

  // Create payment intent
  async createPaymentIntent(amount, currency = 'MXN', appointmentData) {
    try {
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
        appointmentData,
        created: new Date().toISOString()
      };

      // In production, this would make an API call to your backend
      console.log('Creating payment intent:', paymentIntent);
      
      return {
        success: true,
        data: paymentIntent
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process payment
  async processPayment(paymentMethod, paymentIntentId, cardData = null) {
    try {
      // Simulate payment processing
      console.log('Processing payment...', {
        method: paymentMethod,
        intentId: paymentIntentId,
        cardData: cardData ? '****' + cardData.number.slice(-4) : null
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        id: `charge_${Date.now()}`,
        status: 'succeeded',
        amount: 0, // Would come from payment intent
        currency: 'mxn',
        payment_method: paymentMethod,
        created: new Date().toISOString()
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate card data
  validateCardData(cardData) {
    const errors = [];

    // Card number validation (basic)
    if (!cardData.number || cardData.number.length < 13) {
      errors.push('Número de tarjeta inválido');
    }

    // Expiry date validation
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      errors.push('Fecha de vencimiento requerida');
    }

    // CVV validation
    if (!cardData.cvv || cardData.cvv.length < 3) {
      errors.push('CVV inválido');
    }

    // Cardholder name validation
    if (!cardData.name || cardData.name.length < 2) {
      errors.push('Nombre del titular requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get supported payment methods
  getSupportedPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        icon: '💳',
        supported: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        supported: false // Will be enabled in future
      },
      {
        id: 'oxxo',
        name: 'OXXO',
        icon: '🏪',
        supported: false // Popular in Mexico
      },
      {
        id: 'spei',
        name: 'Transferencia SPEI',
        icon: '🏦',
        supported: false
      },
      {
        id: 'cash',
        name: 'Pago en Consultorio',
        icon: '💵',
        supported: true
      }
    ];
  }

  // Calculate fees
  calculateFees(amount, paymentMethod) {
    const feeRates = {
      card: 0.036, // 3.6% + fixed fee
      paypal: 0.049, // 4.9%
      oxxo: 12, // Fixed fee
      spei: 5, // Fixed fee
      cash: 0 // No fee
    };

    const fixedFees = {
      card: 3,
      paypal: 0,
      oxxo: 0,
      spei: 0,
      cash: 0
    };

    const feeRate = feeRates[paymentMethod] || 0;
    const fixedFee = fixedFees[paymentMethod] || 0;
    
    const fee = (amount * feeRate) + fixedFee;
    const total = amount + fee;

    return {
      subtotal: amount,
      fee: Math.round(fee * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  // Generate payment receipt
  generateReceipt(paymentData, appointmentData) {
    return {
      receiptId: `receipt_${Date.now()}`,
      paymentId: paymentData.id,
      appointmentId: appointmentData.id,
      patient: `${appointmentData.firstName} ${appointmentData.lastName}`,
      service: appointmentData.service,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.payment_method,
      status: paymentData.status,
      date: new Date().toISOString(),
      consultorio: {
        name: 'DentalCare',
        address: 'Av. Principal 123, Col. Centro, Ciudad',
        phone: '+52 (555) 123-4567',
        email: 'contacto@consultoriodental.com'
      }
    };
  }

  // Refund payment (for cancellations)
  async refundPayment(paymentId, amount = null, reason = '') {
    try {
      console.log('Processing refund...', { paymentId, amount, reason });
      
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const refund = {
        id: `re_${Date.now()}`,
        payment_id: paymentId,
        amount: amount,
        status: 'succeeded',
        reason: reason,
        created: new Date().toISOString()
      };

      return {
        success: true,
        data: refund
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PaymentService();
