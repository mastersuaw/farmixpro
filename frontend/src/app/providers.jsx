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
  // login manda el token directo, register lo anida en data.user.token
  return data?.token ?? data?.user?.token ?? null;
}

function extractCompanies(data) {
  return data?.companies ?? data?.user?.companies ?? [];
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [currentCompanyId, setCurrentCompanyIdState] = useState(getCurrentCompanyId());
  const [loading, setLoading] = useState(() => !!getToken());

  function applyCompanies(list) {
    setCompanies(list);
    const stored = getCurrentCompanyId();
    const stillValid = stored && list.some((c) => String(c.id) === String(stored));
    const resolved = stillValid ? stored : list[0]?.id ?? null;
    if (resolved) setCurrentCompany(resolved);
    setCurrentCompanyIdState(resolved);
  }

  useEffect(() => {
    if (!getToken()) return; // sin token no hay nada que restaurar

    api
      .get('/auth/me')
      .then((data) => {
        setUser(data.user);
        applyCompanies(extractCompanies(data));
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    saveToken(extractToken(data));
    setUser(data.user);
    applyCompanies(extractCompanies(data));
    return data;
  }

  async function register(name, email, password, password_confirmation) {
    const data = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    saveToken(extractToken(data));
    setUser(data.user);
    applyCompanies(extractCompanies(data));
    return data;
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

// envuelve la app; si se agrega otro provider global entra aquí
export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
