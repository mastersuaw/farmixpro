export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="confirm-dialog__actions">
                    <button className="link-button" onClick={onCancel}>Cancelar</button>
                    <button className="btn-danger-solid" onClick={onConfirm}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}
