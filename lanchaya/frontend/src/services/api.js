// Servicio central de acceso a la API (fetch). Lanza Error con el mensaje del backend.
// Adjunta el JWT guardado y avisa a la app cuando la sesión deja de ser válida (401).
const BASE = '/api';
const CLAVE_TOKEN = 'lanchaya_token';

export const getToken = () => localStorage.getItem(CLAVE_TOKEN);
export const setToken = (t) => (t ? localStorage.setItem(CLAVE_TOKEN, t) : localStorage.removeItem(CLAVE_TOKEN));

let onSesionExpirada = () => {};
export const alExpirarSesion = (fn) => { onSesionExpirada = fn; };

async function request(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
  let res;
  try {
    res = await fetch(BASE + url, { ...options, headers });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  // 401 con sesión activa = token vencido/inválido (en el login un 401 son credenciales malas, no se cierra nada)
  if (res.status === 401 && token && url !== '/auth/login') onSesionExpirada();
  if (!res.ok) throw new Error(data.mensaje || `Error ${res.status}`);
  return data;
}

export const login = (usuario, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ usuario, password }) });
export const getMe = () => request('/auth/me');

export const getSalidas = (filtros = {}) => {
  const qs = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v)).toString();
  return request('/salidas' + (qs ? `?${qs}` : ''));
};
export const getDestinos = () => request('/destinos');
export const crearSalida = (s) => request('/salidas', { method: 'POST', body: JSON.stringify(s) });
export const actualizarSalida = (id, s) => request(`/salidas/${id}`, { method: 'PUT', body: JSON.stringify(s) });
export const eliminarSalida = (id) => request(`/salidas/${id}`, { method: 'DELETE' });
