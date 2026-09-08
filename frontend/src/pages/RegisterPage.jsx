import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';
import { ApiError } from '@/api/client';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';
import Favicon from '@/shared/components/Favicon-Component';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('No se pudo completar el registro');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-center">
      <Favicon variant="color" size="auth" />
      <div className="auth-container">
        <h2>Crear cuenta</h2>
        <p>Regístrate para empezar a usar FarmixPro</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input name="Nombre" bType="text" pHolder="Tu nombre" value={form.name} onChange={update('name')} />
            {fieldErrors.name && <p className="page-center__field-error">{fieldErrors.name[0]}</p>}
          </div>
          <div className="form-group">
            <Input name="Email" bType="email" pHolder="Enter your email" value={form.email} onChange={update('email')} />
            {fieldErrors.email && <p className="page-center__field-error">{fieldErrors.email[0]}</p>}
          </div>
          <div className="form-group">
            <Input name="Password" bType="password" pHolder="Enter your password" value={form.password} onChange={update('password')} />
            {fieldErrors.password && <p className="page-center__field-error">{fieldErrors.password[0]}</p>}
          </div>
          <div className="form-group">
            <Input name="Confirmar Password" bType="password" pHolder="Confirm your password" value={form.password_confirmation} onChange={update('password_confirmation')} />
          </div>
          <Button name="Crear cuenta" cType="btn btn-primary" bType="submit" btnName="register" disabled={submitting} />
        </form>
      </div>
      {formError && <p className="page-center__error">{formError}</p>}
      <p className="page-center__switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
