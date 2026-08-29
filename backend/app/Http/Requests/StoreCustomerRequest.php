<?php

namespace App\Http\Requests;

class StoreCustomerRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'nombre' => [$required, 'string', 'max:255'],
            'card_id' => ['nullable', 'string', 'max:64'],
            'direccion' => ['nullable', 'string'],
            'telefono' => ['nullable', 'string', 'max:64'],
        ];
    }
}
