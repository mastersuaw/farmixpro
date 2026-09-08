import { useMemo, useState } from 'react';
import { useCrud } from '@/shared/useCrud';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

const empty = { nombre: '', tasa: '' };

export default function TaxesPage() {
    const { items, create, update, remove } = useCrud('/taxes');
    const showToast = useToast();
    const [form, setForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [toDelete, setToDelete] = useState(null);

    const filtered = useMemo(() => {
        if (!items) return items;
        const q = search.trim().toLowerCase();
        return q ? items.filter((t) => t.nombre?.toLowerCase().includes(q)) : items;
    }, [items, search]);

    function startEdit(tax) {
        setEditingId(tax.id);
        setForm({ nombre: tax.nombre ?? '', tasa: tax.tasa ?? '' });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(empty);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = { nombre: form.nombre, tasa: Number(form.tasa) };
            if (editingId) {
                await update(editingId, payload);
            } else {
                await create(payload);
            }
            cancelEdit();
            showToast(editingId ? 'Impuesto actualizado' : 'Impuesto agregado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo guardar el impuesto'));
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        try {
            await remove(toDelete);
            showToast('Impuesto eliminado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo eliminar el impuesto'));
        } finally {
            setToDelete(null);
        }
    }

    return (
        <div className="module-page">
            <h1>Impuestos</h1>

            <form onSubmit={handleSubmit} className="crud-form">
                <Input name="Nombre" bType="text" pHolder="ITBIS, IVA..." value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                <Input name="Tasa (%)" bType="text" pHolder="18" value={form.tasa} onChange={(e) => setForm({ ...form, tasa: e.target.value })} />
                <div className="crud-form__actions">
                    <Button name={saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar impuesto'} cType="btn btn-primary" bType="submit" btnName="saveTax" disabled={saving} />
                    {editingId && <button type="button" className="link-button" onClick={cancelEdit}>Cancelar</button>}
                </div>
            </form>

            {error && <p className="form-error">{error}</p>}

            {items?.length > 0 && (
                <input className="list-search" placeholder="Buscar impuesto…" value={search} onChange={(e) => setSearch(e.target.value)} />
            )}

            {items === null && <p className="empty">Cargando…</p>}
            {items?.length === 0 && <p className="empty">Aún no has registrado impuestos.</p>}
            {filtered?.length > 0 && (
                <div className="crud-table">
                    {filtered.map((t) => (
                        <div key={t.id} className="crud-row">
                            <div className="crud-row__main">
                                <span className="crud-row__title">{t.nombre}</span>
                            </div>
                            <span className="badge">{t.tasa}%</span>
                            <div className="crud-row__actions">
                                <button className="link-button" onClick={() => startEdit(t)}>Editar</button>
                                <button className="link-button link-button--danger" onClick={() => setToDelete(t.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={toDelete !== null}
                title="Eliminar impuesto"
                message="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarlo?"
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
