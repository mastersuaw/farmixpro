import { useState } from 'react';
import { useCrud } from '@/shared/useCrud';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

export default function PaymentMethodsPage() {
    const { items, create, update, remove } = useCrud('/methods-payments');
    const showToast = useToast();
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toDelete, setToDelete] = useState(null);

    function startEdit(method) {
        setEditingId(method.id);
        setNombre(method.nombre ?? '');
    }

    function cancelEdit() {
        setEditingId(null);
        setNombre('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (editingId) {
                await update(editingId, { nombre });
            } else {
                await create({ nombre });
            }
            cancelEdit();
            showToast(editingId ? 'Método actualizado' : 'Método agregado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo guardar el método de pago'));
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        try {
            await remove(toDelete);
            showToast('Método de pago eliminado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo eliminar el método de pago'));
        } finally {
            setToDelete(null);
        }
    }

    return (
        <div className="module-page">
            <h1>Métodos de pago</h1>

            <form onSubmit={handleSubmit} className="crud-form">
                <Input name="Nombre" bType="text" pHolder="Efectivo, Tarjeta..." value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <div className="crud-form__actions">
                    <Button name={saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar método'} cType="btn btn-primary" bType="submit" btnName="saveMethod" disabled={saving} />
                    {editingId && <button type="button" className="link-button" onClick={cancelEdit}>Cancelar</button>}
                </div>
            </form>

            {error && <p className="form-error">{error}</p>}

            {items === null && <p className="empty">Cargando…</p>}
            {items?.length === 0 && <p className="empty">Aún no has registrado métodos de pago.</p>}
            {items?.length > 0 && (
                <div className="crud-table">
                    {items.map((m) => (
                        <div key={m.id} className="crud-row">
                            <div className="crud-row__main">
                                <span className="crud-row__title">{m.nombre}</span>
                            </div>
                            <div className="crud-row__actions">
                                <button className="link-button" onClick={() => startEdit(m)}>Editar</button>
                                <button className="link-button link-button--danger" onClick={() => setToDelete(m.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={toDelete !== null}
                title="Eliminar método de pago"
                message="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarlo?"
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
