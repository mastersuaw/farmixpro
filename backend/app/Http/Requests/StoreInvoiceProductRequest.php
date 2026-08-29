<?php

namespace App\Http\Requests;

class StoreInvoiceProductRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'facturas_id' => [$required, 'integer', $this->existsInCompany('invoices')],
            'variants_id' => [$required, 'integer', $this->existsInCompany('variants_products')],
            'cantidad' => [$required, 'numeric'],
            'precio' => [$required, 'numeric', 'min:0'],
            'descuento' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
