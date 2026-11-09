import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(!!api.getToken()); // validando token guardado al abrir

  const logout = useCallback(() => { api.setToken(null); setUsuario(null); }, []);

  useEffect(() => {
    api.alExpirarSesion(logout);
    if (!api.getToken()) return;
    api.getMe()
      .then((d) => setUsuario(d.usuario))
      .catch(() => api.setToken(null)) // token vencido o servidor caído: queda como visitante
      .finally(() => setVerificando(false));
  }, [logout]);

  const login = async (user, pass) => {
    const d = await api.login(user, pass);
    api.setToken(d.token);
    setUsuario(d.usuario);
  };

  return <AuthContext.Provider value={{ usuario, verificando, login, logout }}>{children}</AuthContext.Provider>;
}
