import { useEffect, useState } from 'react';
import { useAuth } from '@/app/useAuth';
import { api, ApiError } from '@/api/client';
import Button from '@/shared/components/Button-Component';

export default function DashboardPage() {
  const { user, companies, currentCompanyId, hasCompany, selectCompany } = useAuth();
  const [products, setProducts] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!hasCompany) return;
    api.get('/products').then((data) => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
    api.get('/invoices').then((data) => setInvoices(Array.isArray(data) ? data : [])).catch(() => setInvoices([]));
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

  const currentCompany = companies.find((c) => String(c.id) === String(currentCompanyId)) || companies[0];

  if (!hasCompany) {
    return (
      <div className="module-page">
        <div className="dashboard-greeting">
          <h1>Hola, {user?.name?.split(' ')[0]}</h1>
          <p>Todavía no tienes una empresa vinculada.</p>
        </div>
        <div className="company-prompt">
          <h2>Crea tu primera empresa</h2>
          <p>Necesitas una empresa vinculada para registrar productos y facturas.</p>
          {createError && <div className="form-error">{createError}</div>}
          <form onSubmit={handleCreateCompany}>
            <div className="form-group">
              <label htmlFor="companyName" className="form-label">Nombre de la empresa</label>
              <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <Button name={creating ? 'Creando…' : 'Crear empresa'} cType="btn btn-primary" bType="submit" btnName="createCompany" disabled={creating} />
          </form>
        </div>
      </div>
    );
  }

  const recentInvoices = invoices?.slice(0, 5) ?? [];

  return (
    <div className="module-page">
      <div className="dashboard-greeting">
        <h1>Hola, {user?.name?.split(' ')[0]}</h1>
        <p>{currentCompany?.name}{currentCompany?.address ? ` · ${currentCompany.address}` : ''}</p>
      </div>

      {companies.length > 1 && (
        <div className="form-group" style={{ maxWidth: 280, marginTop: 20 }}>
          <label htmlFor="company" className="form-label">Cambiar de empresa</label>
          <select id="company" value={currentCompanyId ?? ''} onChange={handleSwitchCompany}>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="stat-row">
        <div className="stat-block stat-block--primary">
          <span className="stat-value">{products === null ? '—' : products.length}</span>
          <span className="stat-label">Productos</span>
        </div>
        <div className="stat-block stat-block--accent">
          <span className="stat-value">{invoices === null ? '—' : invoices.length}</span>
          <span className="stat-label">Facturas</span>
        </div>
      </div>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <h2>Facturas recientes</h2>
          {invoices === null && <p className="empty">Cargando…</p>}
          {invoices?.length === 0 && (
            <p className="empty">Aún no tienes facturas. Registra la primera desde el módulo de Facturas.</p>
          )}
          {recentInvoices.length > 0 && (
            <ul className="invoice-list">
              {recentInvoices.map((inv) => (
                <li key={inv.id} className="invoice-list__item">
                  <span className={`invoice-status invoice-status--${inv.status ?? 'open'}`}>{inv.status ?? 'open'}</span>
                  <span className="invoice-total">${Number(inv.total ?? 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-panel">
          <h2>Productos</h2>
          {products === null && <p className="empty">Cargando…</p>}
          {products?.length === 0 && (
            <p className="empty">Aún no has registrado productos. Anímate a crear el primero desde el módulo de Productos.</p>
          )}
          {products?.length > 0 && (
            <ul className="product-list">
              {products.slice(0, 5).map((p) => (
                <li key={p.id}>{p.nombre}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
