import { Link } from 'react-router-dom';
import { useCrud } from '@/shared/useCrud';

export default function InvoicesListPage() {
    const { items: invoices } = useCrud('/invoices');

    return (
        <div className="module-page">
            <div className="module-page__header">
                <h1>Facturas</h1>
                <Link to="/facturas/nueva" className="btn btn-primary module-page__cta">Nueva factura</Link>
            </div>

            {invoices === null && <p className="empty">Cargando…</p>}
            {invoices?.length === 0 && <p className="empty">Aún no tienes facturas. Crea la primera con el botón de arriba.</p>}
            {invoices?.length > 0 && (
                <div className="crud-table">
                    {invoices.map((inv) => (
                        <div key={inv.id} className="crud-row">
                            <span className="crud-row__title">Factura #{inv.id}</span>
                            <span className={`invoice-status invoice-status--${inv.status ?? 'open'}`}>{inv.status ?? 'open'}</span>
                            <span className="invoice-total">${Number(inv.total ?? 0).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
