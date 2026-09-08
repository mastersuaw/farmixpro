import { useMemo, useState } from 'react';
import { useCrud } from '@/shared/useCrud';
import { api } from '@/api/client';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

const empty = { nombre: '', precio: '', descripcion: '' };

export default function ProductsPage() {
    const { items, create, update, remove } = useCrud('/products');
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
        return q ? items.filter((p) => p.nombre?.toLowerCase().includes(q)) : items;
    }, [items, search]);

    function startEdit(product) {
        setEditingId(product.id);
        setForm({
            nombre: product.nombre ?? '',
            precio: product.precio ?? '',
            descripcion: product.descripcion ?? '',
        });
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
            const payload = { nombre: form.nombre, precio: Number(form.precio), descripcion: form.descripcion || undefined };
            if (editingId) {
                await update(editingId, payload);
            } else {
                const product = await create(payload);
                // las facturas referencian variantes, no productos directo;
                // dejamos una variante por defecto lista para poder facturarlo
                await api.post('/variants-products', {
                    products_id: product.id,
                    sku: `SKU-${product.id}`,
                    name: product.nombre,
                    stock: 0,
                });
            }
            cancelEdit();
            showToast(editingId ? 'Producto actualizado' : 'Producto agregado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo guardar el producto'));
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        try {
            await remove(toDelete);
            showToast('Producto eliminado');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo eliminar el producto'));
        } finally {
            setToDelete(null);
        }
    }

    return (
        <div className="module-page">
            <h1>Productos</h1>

            <form onSubmit={handleSubmit} className="crud-form">
                <Input name="Nombre" bType="text" pHolder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                <Input name="Precio" bType="text" pHolder="0.00" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                <Input name="Descripción" bType="text" pHolder="Opcional" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                <div className="crud-form__actions">
                    <Button name={saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar producto'} cType="btn btn-primary" bType="submit" btnName="saveProduct" disabled={saving} />
                    {editingId && <button type="button" className="link-button" onClick={cancelEdit}>Cancelar</button>}
                </div>
            </form>

            {error && <p className="form-error">{error}</p>}

            {items?.length > 0 && (
                <input className="list-search" placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />
            )}

            {items === null && <p className="empty">Cargando…</p>}
            {items?.length === 0 && <p className="empty">Aún no has registrado productos.</p>}
            {items?.length > 0 && filtered.length === 0 && <p className="empty">Ningún producto coincide con "{search}".</p>}
            {filtered?.length > 0 && (
                <div className="crud-table">
                    {filtered.map((p) => (
                        <div key={p.id} className="crud-row">
                            <div className="crud-row__main">
                                <span className="crud-row__title">{p.nombre}</span>
                                {p.descripcion && <span className="crud-row__subtitle">{p.descripcion}</span>}
                            </div>
                            <span className="crud-row__price">${Number(p.precio).toFixed(2)}</span>
                            <div className="crud-row__actions">
                                <button className="link-button" onClick={() => startEdit(p)}>Editar</button>
                                <button className="link-button link-button--danger" onClick={() => setToDelete(p.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={toDelete !== null}
                title="Eliminar producto"
                message="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarlo?"
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
