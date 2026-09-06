const API_BASE_URL = 'http://localhost:8000/api';

const TOKEN_KEY = 'farmixpro_token';
const COMPANY_KEY = 'farmixpro_company_id';

/**
 * Error personalizado para las peticiones que fallan.
 * Guardamos "errors" aparte del mensaje general porque el backend,
 * en una respuesta 422, manda un objeto con el detalle de qué campo
 * falló y por qué — eso es lo que necesitamos para pintar los
 * mensajes de validación debajo de cada input en los formularios.
 */
export class ApiError extends Error {
  constructor(message, errors, status) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors; // objeto { campo: [mensajes] } o null
    this.status = status; // 401, 422, etc.
  }
}

/**
 * Función central: arma la petición, agrega los headers necesarios,
 * y desempaqueta el envelope { success, message, data, errors } que
 * usa todo el API de FarmixPro.
 */
async function request(endpoint, { method = 'GET', body } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const companyId = localStorage.getItem(COMPANY_KEY);
  if (companyId) {
    headers['X-Company-Id'] = companyId;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. ¿Está corriendo el backend?',
      null,
      0
    );
  }

  const json = await response.json();

  if (!json.success) {
    throw new ApiError(json.message || 'Ocurrió un error', json.errors ?? null, response.status);
  }

  return json.data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setCurrentCompany(companyId) {
  localStorage.setItem(COMPANY_KEY, String(companyId));
}

export function getCurrentCompanyId() {
  return localStorage.getItem(COMPANY_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(COMPANY_KEY);
}
