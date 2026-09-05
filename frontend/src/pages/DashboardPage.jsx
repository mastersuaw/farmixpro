import { useEffect, useState } from 'react';
import { useAuth } from '@/app/useAuth';
import { api, ApiError } from '@/api/client';
import Button from '@/shared/components/Button-Component';
import Favicon from '@/shared/components/Favicon-Component';

export default function DashboardPage() {
  const { user, companies, currentCompanyId, hasCompany, selectCompany, logout } = useAuth();
  const [products, setProducts] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadingProducts = hasCompany && products === null;

  useEffect(() => {
    if (!hasCompany) return;
    api
      .get('/products')
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, [hasCompany, currentCompanyId]);

  async function handleCreateCompany(e) {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const company = await api.post('/companies', { name: companyName });
      selectCompany(company.id);
      window.location.reload();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'No se pudo crear la empresa');
    } finally {
      setCreating(false);
    }
  }

  function handleSwitchCompany(e) {
    selectCompany(e.target.value);
    window.location.reload();
  }

  const currentCompany =
    companies.find((c) => String(c.id) === String(currentCompanyId)) || companies[0];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Favicon variant="color" size="sm" />
        <div className="dashboard-header__user">
          <span>{user?.name}</span>
          <button className="link-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-greeting">
          <h1>Hola, {user?.name?.split(' ')[0]}</h1>
          <p>
            {hasCompany
              ? `Empresa actual: ${currentCompany?.name ?? ''}`
              : 'Todavía no tienes una empresa vinculada.'}
          </p>
        </div>

        {companies.length > 1 && (
          <div className="form-group" style={{ maxWidth: 280, marginTop: 20 }}>
            <label htmlFor="company" className="form-label">Cambiar de empresa</label>
            <select id="company" value={currentCompanyId ?? ''} onChange={handleSwitchCompany}>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!hasCompany && (
          <div className="company-prompt">
            <h2>Crea tu primera empresa</h2>
            <p>Necesitas una empresa vinculada para registrar productos y facturas.</p>
            {createError && <div className="form-error">{createError}</div>}
            <form onSubmit={handleCreateCompany}>
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">Nombre de la empresa</label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <Button name={creating ? 'Creando…' : 'Crear empresa'} cType="btn btn-primary" bType="submit" btnName="createCompany" disabled={creating} />
            </form>
          </div>
        )}

        {hasCompany && (
          <div className="product-preview">
            <h2>Productos</h2>
            {loadingProducts && <p className="empty">Cargando…</p>}
            {!loadingProducts && products?.length === 0 && (
              <p className="empty">Aún no has registrado productos.</p>
            )}
            {!loadingProducts && products?.length > 0 && (
              <ul className="product-list">
                {products.slice(0, 5).map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
