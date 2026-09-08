export function formatApiError(err, fallback) {
    if (err?.errors) {
        const field = Object.keys(err.errors)[0];
        const raw = err.errors[field]?.[0];
        if (raw) {
            return raw.startsWith('validation.') ? `El campo "${field}" no pasó la validación del backend.` : raw;
        }
    }
    return err?.message ?? fallback;
}
