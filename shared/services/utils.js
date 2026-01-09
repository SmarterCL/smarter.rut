// shared/services/utils.js
// Utilidades compartidas entre Next.js e Ionic

// Función para limpiar el RUT
export const cleanRut = (rut) => {
  return rut.replace(/[^0-9kK]/g, '').toLowerCase();
};

// Función para validar el RUT
export const validateRut = (rut) => {
  if (!rut) return false;

  const cleanRutValue = cleanRut(rut);
  if (cleanRutValue.length < 2) return false;

  const body = cleanRutValue.slice(0, -1);
  const digit = cleanRutValue.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDigit = 11 - (sum % 11);
  const actualDigit = digit === 'k' ? 10 : parseInt(digit);

  return expectedDigit === actualDigit || (expectedDigit === 11 && actualDigit === 0);
};

// Función para formatear el RUT
export const formatRut = (rut) => {
  const cleanValue = cleanRut(rut);
  if (cleanValue.length <= 1) return cleanValue;

  const body = cleanValue.slice(0, -1);
  const digit = cleanValue.slice(-1);

  // Agregar puntos al cuerpo del RUT
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${digit}`;
};

// Función para validar email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Función para validar contraseña
export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

// Función para formatear fechas
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Función para formatear números
export const formatNumber = (number, locale = 'es-CL') => {
  return new Intl.NumberFormat(locale).format(number);
};

// Función para formatear moneda
export const formatCurrency = (amount, currency = 'CLP', locale = 'es-CL') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Función para esperar (delay)
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Función para hacer peticiones con reintentos
export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Esperar antes de reintentar (exponential backoff)
      await delay(Math.pow(2, i) * 1000);
    }
  }

  // This line should never be reached due to the loop logic, but added for JavaScript compliance
  throw new Error('Unexpected error in fetchWithRetry');
};