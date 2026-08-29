<?php

namespace App\Http\Requests;

class StoreAccountRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'parent_id' => ['nullable', 'integer', $this->existsInCompany('accounts')],
            'nombre' => [$required, 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:64'],
            'descripcion' => ['nullable', 'string', 'max:255'],
        ];
    }
}
