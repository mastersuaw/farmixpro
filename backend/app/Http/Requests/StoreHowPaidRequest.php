<?php

namespace App\Http\Requests;

class StoreHowPaidRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'metodos_pagos_id' => [$required, 'integer', $this->existsInCompany('methods_payments')],
            'facturas_id' => [$required, 'integer', $this->existsInCompany('invoices')],
            'monedas_id' => [$required, 'integer', 'exists:history_currencies,id'],
            'amount' => [$required, 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'rate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
