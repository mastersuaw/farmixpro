import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';
import { ApiError } from '@/api/client';
import Login from '@/features/auth/components/Login.Component';
import Favicon from '@/shared/components/Favicon-Component';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-center">
      <Favicon variant="color" size="auth" />
      <Login
        subtitle="Entra con tu cuenta de FarmixPro"
        onSubmit={handleSubmit}
        email={email}
        onEmailChange={(e) => setEmail(e.target.value)}
        password={password}
        onPasswordChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
      />
      {error && <p className="page-center__error">{error}</p>}
      <p className="page-center__switch">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}
