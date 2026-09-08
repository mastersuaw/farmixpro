import { useState } from 'react';
import { useAuth } from '@/app/useAuth';
import { api, ApiError } from '@/api/client';
import Input from '@/shared/components/Input-Component';
import Button from '@/shared/components/Button-Component';

export default function UsersPage() {
    const { currentCompanyId, hasCompany } = useAuth();
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [removingId, setRemovingId] = useState(null);

    async function handleAdd(e) {
        e.preventDefault();
        setError('');
        setFieldError('');
        setAdding(true);
        try {
            const user = await api.post(`/companies/${currentCompanyId}/users`, { email });
            setRecentlyAdded((list) => [...list, user]);
            setEmail('');
        } catch (err) {
            if (err instanceof ApiError && err.errors?.email) {
                const raw = err.errors.email[0];
                setFieldError(raw.includes('validation.') ? 'Ese correo no pertenece a ningún usuario registrado en FarmixPro.' : raw);
            } else if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No se pudo agregar el usuario');
            }
        } finally {
            setAdding(false);
        }
    }

    async function handleRemove(userId) {
        setError('');
        setRemovingId(userId);
        try {
            await api.delete(`/companies/${currentCompanyId}/users/${userId}`);
            setRecentlyAdded((list) => list.filter((u) => u.id !== userId));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo quitar el usuario');
        } finally {
            setRemovingId(null);
        }
    }

    if (!hasCompany) {
        return (
            <div className="module-page">
                <h1>Usuarios</h1>
                <p>Necesitas crear o unirte a una empresa antes de administrar usuarios.</p>
            </div>
        );
    }

    return (
        <div className="module-page">
            <h1>Usuarios de la empresa</h1>
            <p className="empty">
                El correo debe pertenecer a alguien que ya tenga cuenta en FarmixPro. El API
                todavía no tiene un endpoint para listar todos los usuarios vinculados, así que
                aquí solo se muestran los que agregas en esta sesión.
            </p>

            <form onSubmit={handleAdd} className="users-add-form">
                <Input
                    name="Email del usuario a agregar"
                    bType="email"
                    pHolder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    name={adding ? 'Agregando…' : 'Agregar usuario'}
                    cType="btn btn-primary"
                    bType="submit"
                    btnName="addUser"
                    disabled={adding}
                />
            </form>
            {fieldError && <p className="page-center__field-error">{fieldError}</p>}

            {error && <p className="form-error">{error}</p>}

            {recentlyAdded.length === 0 && (
                <p className="empty">Todavía no has agregado a nadie en esta sesión.</p>
            )}
            {recentlyAdded.length > 0 && (
                <ul className="product-list">
                    {recentlyAdded.map((u) => (
                        <li key={u.id} className="users-list-item">
                            <span>{u.name} — {u.email}</span>
                            <button
                                className="link-button"
                                onClick={() => handleRemove(u.id)}
                                disabled={removingId === u.id}
                            >
                                {removingId === u.id ? 'Quitando…' : 'Quitar'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
