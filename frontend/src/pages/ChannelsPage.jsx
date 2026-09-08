import { useState } from 'react';
import { useCrud } from '@/shared/useCrud';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

const empty = { name: '', description: '' };

export default function ChannelsPage() {
    const { items, create, update, remove } = useCrud('/channels');
    const showToast = useToast();
    const [form, setForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toDelete, setToDelete] = useState(null);

    function startEdit(channel) {
        setEditingId(channel.id);
        setForm({ name: channel.name ?? '', description: channel.description ?? '' });
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
            const payload = { name: form.name, description: form.description || undefined };
            if (editingId) {
                await update(editingId, payload);
            } else {
                await create(payload);
            }
            cancelEdit();
            showToast(editingId ? 'Canal actualizado' : 'Canal agregado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo guardar el canal'));
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        try {
            await remove(toDelete);
            showToast('Canal eliminado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo eliminar el canal'));
        } finally {
            setToDelete(null);
        }
    }

    return (
        <div className="module-page">
            <h1>Canales de venta</h1>

            <form onSubmit={handleSubmit} className="crud-form">
                <Input name="Nombre" bType="text" pHolder="Tienda física, Online..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input name="Descripción" bType="text" pHolder="Opcional" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="crud-form__actions">
                    <Button name={saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar canal'} cType="btn btn-primary" bType="submit" btnName="saveChannel" disabled={saving} />
                    {editingId && <button type="button" className="link-button" onClick={cancelEdit}>Cancelar</button>}
                </div>
            </form>

            {error && <p className="form-error">{error}</p>}

            {items === null && <p className="empty">Cargando…</p>}
            {items?.length === 0 && <p className="empty">Aún no has registrado canales de venta.</p>}
            {items?.length > 0 && (
                <div className="crud-table">
                    {items.map((c) => (
                        <div key={c.id} className="crud-row">
                            <div className="crud-row__main">
                                <span className="crud-row__title">{c.name}</span>
                                {c.description && <span className="crud-row__subtitle">{c.description}</span>}
                            </div>
                            <div className="crud-row__actions">
                                <button className="link-button" onClick={() => startEdit(c)}>Editar</button>
                                <button className="link-button link-button--danger" onClick={() => setToDelete(c.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={toDelete !== null}
                title="Eliminar canal"
                message="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarlo?"
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
