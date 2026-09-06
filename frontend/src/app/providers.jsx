import { useState, useEffect } from 'react';
import {
  api,
  saveToken,
  getToken,
  setCurrentCompany,
  getCurrentCompanyId,
  clearSession,
} from '@/api/client';
import { AuthContext } from './auth-context';

function extractToken(data) {
  // register anida el token en data.user.token; por si login no lo
  // hace igual, cubrimos las dos formas.
  return data?.token ?? data?.user?.token ?? null;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [currentCompanyId, setCurrentCompanyIdState] = useState(getCurrentCompanyId());
  const [loading, setLoading] = useState(() => !!getToken());

  useEffect(() => {
    if (!getToken()) return; // sin token no hay nada que restaurar

    api
      .get('/auth/me')
      .then((data) => {
        setUser(data.user);
        setCompanies(data.companies || []);
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    saveToken(extractToken(data));
    const me = await api.get('/auth/me');
    setUser(me.user);
    setCompanies(me.companies || []);
    return me;
  }

  async function register(name, email, password, password_confirmation) {
    const data = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    saveToken(extractToken(data));
    const me = await api.get('/auth/me');
    setUser(me.user);
    setCompanies(me.companies || []);
    return me;
  }

  function logout() {
    api.post('/auth/logout').catch(() => {});
    clearSession();
    setUser(null);
    setCompanies([]);
    setCurrentCompanyIdState(null);
  }

  function selectCompany(companyId) {
    setCurrentCompany(companyId);
    setCurrentCompanyIdState(companyId);
  }

  const value = {
    user,
    companies,
    currentCompanyId,
    loading,
    isAuthenticated: !!user,
    hasCompany: companies.length > 0,
    login,
    register,
    logout,
    selectCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Punto único de entrada para envolver la app. Hoy solo trae el
// auth, pero si el grupo agrega más contexto global (tema, etc.)
// entra aquí sin tocar App.jsx.
export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
