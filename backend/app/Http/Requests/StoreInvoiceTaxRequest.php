<?php

namespace App\Http\Requests;

class StoreInvoiceTaxRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'facturas_id' => [$required, 'integer', $this->existsInCompany('invoices')],
            'impuestos_id' => [$required, 'integer', $this->existsInCompany('taxes')],
        ];
    }
}
