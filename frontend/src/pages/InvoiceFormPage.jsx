import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '@/shared/useCrud';
import { api } from '@/api/client';
import { formatApiError } from '@/shared/formatApiError';
import { useToast } from '@/shared/useToast';
import Button from '@/shared/components/Button-Component';

export default function InvoiceFormPage() {
    const navigate = useNavigate();
    const showToast = useToast();
    const { items: variants } = useCrud('/variants-products');
    const { items: taxes } = useCrud('/taxes');
    const { items: methods } = useCrud('/methods-payments');

    const [lines, setLines] = useState([{ variants_id: '', cantidad: 1, precio: '', descuento: 0 }]);
    const [taxId, setTaxId] = useState('');
    const [methodId, setMethodId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const selectedTax = taxes?.find((t) => String(t.id) === taxId);

    const subtotal = useMemo(() => {
        return lines.reduce((sum, l) => {
            const qty = Number(l.cantidad) || 0;
            const price = Number(l.precio) || 0;
            const discount = Number(l.descuento) || 0;
            return sum + (qty * price - discount);
        }, 0);
    }, [lines]);

    const taxAmount = selectedTax ? subtotal * (Number(selectedTax.tasa ?? 0) / 100) : 0;
    const total = subtotal + taxAmount;

    function addLine() {
        setLines((l) => [...l, { variants_id: '', cantidad: 1, precio: '', descuento: 0 }]);
    }

    function updateLine(index, field, value) {
        setLines((l) => l.map((line, i) => {
            if (i !== index) return line;
            const updated = { ...line, [field]: value };
            if (field === 'variants_id') {
                const variant = variants?.find((v) => String(v.id) === value);
                if (variant?.product?.precio != null) updated.precio = variant.product.precio;
            }
            return updated;
        }));
    }

    function removeLine(index) {
        setLines((l) => l.filter((_, i) => i !== index));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = {
                fecha: new Date().toISOString().slice(0, 10),
                products: lines.map((l) => ({
                    variants_id: Number(l.variants_id),
                    cantidad: Number(l.cantidad),
                    precio: Number(l.precio),
                    descuento: Number(l.descuento) || 0,
                })),
                taxes: taxId ? [{ impuestos_id: Number(taxId) }] : [],
                payments: methodId ? [{ metodos_pagos_id: Number(methodId), amount: Number(paymentAmount) || total }] : [],
            };
            await api.post('/invoices', payload);
            showToast('Factura creada');
            navigate('/facturas');
        } catch (err) {
            setError(formatApiError(err, 'No se pudo crear la factura'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="module-page">
            <h1>Nueva factura</h1>

            <form onSubmit={handleSubmit} className="crud-form crud-form--wide">
                {lines.map((line, i) => (
                    <div key={i} className="invoice-line">
                        <select value={line.variants_id} onChange={(e) => updateLine(i, 'variants_id', e.target.value)} required>
                            <option value="">Producto…</option>
                            {variants?.map((v) => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                        <input type="number" min="1" placeholder="Cant." value={line.cantidad} onChange={(e) => updateLine(i, 'cantidad', e.target.value)} required />
                        <input type="number" step="0.01" placeholder="Precio" value={line.precio} onChange={(e) => updateLine(i, 'precio', e.target.value)} required />
                        <input type="number" step="0.01" placeholder="Descuento" value={line.descuento} onChange={(e) => updateLine(i, 'descuento', e.target.value)} />
                        <span className="invoice-line__subtotal">${((Number(line.cantidad) || 0) * (Number(line.precio) || 0) - (Number(line.descuento) || 0)).toFixed(2)}</span>
                        {lines.length > 1 && <button type="button" className="link-button link-button--danger" onClick={() => removeLine(i)}>Quitar</button>}
                    </div>
                ))}

                <button type="button" className="link-button" onClick={addLine}>+ Agregar producto</button>

                <div className="invoice-form__row">
                    <select value={taxId} onChange={(e) => setTaxId(e.target.value)}>
                        <option value="">Sin impuesto</option>
                        {taxes?.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre} ({t.tasa}%)</option>
                        ))}
                    </select>
                    <select value={methodId} onChange={(e) => setMethodId(e.target.value)}>
                        <option value="">Sin método de pago</option>
                        {methods?.map((m) => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                    {methodId && (
                        <input type="number" step="0.01" placeholder="Monto pagado" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                    )}
                </div>

                <div className="invoice-summary">
                    <div className="invoice-summary__row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {selectedTax && (
                        <div className="invoice-summary__row">
                            <span>{selectedTax.nombre} ({selectedTax.tasa}%)</span>
                            <span>${taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="invoice-summary__row invoice-summary__row--total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <Button
                    name={saving ? 'Creando…' : 'Crear factura'}
                    cType="btn btn-primary"
                    bType="submit"
                    btnName="createInvoice"
                    disabled={saving}
                />
            </form>
        </div>
    );
}
