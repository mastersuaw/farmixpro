import { useCallback, useEffect, useState } from 'react';
import { api } from '@/api/client';

export function useCrud(endpoint) {
    const [items, setItems] = useState(null);
    const [error, setError] = useState('');

    const load = useCallback(() => {
        api.get(endpoint).then((data) => setItems(Array.isArray(data) ? data : [])).catch(() => setItems([]));
    }, [endpoint]);

    useEffect(() => {
        load();
    }, [load]);

    async function create(payload) {
        const created = await api.post(endpoint, payload);
        load();
        return created;
    }

    async function update(id, payload) {
        await api.put(`${endpoint}/${id}`, payload);
        load();
    }

    async function remove(id) {
        await api.delete(`${endpoint}/${id}`);
        load();
    }

    return { items, error, setError, create, update, remove, reload: load };
}
