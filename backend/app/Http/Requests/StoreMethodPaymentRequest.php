<?php

namespace App\Http\Requests;

class StoreMethodPaymentRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'nombre' => [$required, 'string', 'max:255'],
        ];
    }
}
