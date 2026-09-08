import { useCallback, useState } from 'react';
import { ToastContext } from './toast-context';

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, tone = 'success') => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, message, tone }]);
        setTimeout(() => {
            setToasts((t) => t.filter((toast) => toast.id !== id));
        }, 3200);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-stack">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast--${t.tone}`}>{t.message}</div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
