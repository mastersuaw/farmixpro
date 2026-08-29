<?php

namespace App\Http\Requests;

class StoreProductRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'nombre' => [$required, 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'precio' => [$required, 'numeric', 'min:0'],
        ];
    }
}
