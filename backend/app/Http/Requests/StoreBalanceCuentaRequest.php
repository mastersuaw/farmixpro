<?php

namespace App\Http\Requests;

use App\Enums\TipoReferencia;
use Illuminate\Validation\Rule;

class StoreBalanceCuentaRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'cuentas_id' => [$required, 'integer', $this->existsInCompany('accounts')],
            'referencia' => ['nullable', 'string', 'max:255'],
            'tipo_referencia' => [$required, Rule::enum(TipoReferencia::class)],
            'debito' => ['sometimes', 'numeric', 'min:0'],
            'credito' => ['sometimes', 'numeric', 'min:0'],
            'fecha' => [$required, 'date'],
        ];
    }
}
