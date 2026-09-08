import { useState } from 'react';
import { useAuth } from '@/app/useAuth';
import { api } from '@/api/client';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';

export default function CompanyPage() {
    const { companies, currentCompanyId, selectCompany } = useAuth();
    const showToast = useToast();
    const current = companies.find((c) => String(c.id) === String(currentCompanyId)) || companies[0];

    const [form, setForm] = useState({ name: current?.name ?? '', address: current?.address ?? '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.put(`/companies/${current.id}`, { name: form.name, address: form.address || undefined });
            showToast('Empresa actualizada');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo actualizar la empresa'));
        } finally {
            setSaving(false);
        }
    }

    function handleSwitch(e) {
        selectCompany(e.target.value);
        window.location.reload();
    }

    return (
        <div className="module-page">
            <h1>Empresa</h1>

            {companies.length > 1 && (
                <div className="crud-form" style={{ marginBottom: 28 }}>
                    <label className="form-label" htmlFor="companySwitch" style={{ width: '100%' }}>
                        Estás editando
                        <select id="companySwitch" value={currentCompanyId ?? ''} onChange={handleSwitch} style={{ display: 'block', marginTop: 6, width: '100%', maxWidth: 320 }}>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            <form onSubmit={handleSubmit} className="crud-form crud-form--wide" style={{ maxWidth: 420 }}>
                <Input name="Nombre de la empresa" bType="text" pHolder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input name="Dirección" bType="text" pHolder="Opcional" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <Button name={saving ? 'Guardando…' : 'Guardar cambios'} cType="btn btn-primary" bType="submit" btnName="saveCompany" disabled={saving} />
            </form>

            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
