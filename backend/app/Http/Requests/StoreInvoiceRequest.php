<?php

namespace App\Http\Requests;

use App\Enums\InvoiceStatus;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'fecha' => [$required, 'date'],
            'total' => ['nullable', 'numeric', 'min:0'],
            'subtotal' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', Rule::enum(InvoiceStatus::class)],
            'who_close' => ['nullable', 'integer', 'exists:users,id'],
            'products' => ['sometimes', 'array'],
            'products.*.variants_id' => ['required', 'integer', $this->existsInCompany('variants_products')],
            'products.*.cantidad' => ['required', 'numeric'],
            'products.*.precio' => ['required', 'numeric', 'min:0'],
            'products.*.descuento' => ['nullable', 'numeric', 'min:0'],
            'taxes' => ['sometimes', 'array'],
            'taxes.*.impuestos_id' => ['required', 'integer', $this->existsInCompany('taxes')],
            'payments' => ['sometimes', 'array'],
            'payments.*.metodos_pagos_id' => ['required', 'integer', $this->existsInCompany('methods_payments')],
            'payments.*.monedas_id' => ['required', 'integer', 'exists:history_currencies,id'],
            'payments.*.amount' => ['required', 'numeric', 'min:0'],
            'payments.*.discount' => ['nullable', 'numeric', 'min:0'],
            'payments.*.rate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
