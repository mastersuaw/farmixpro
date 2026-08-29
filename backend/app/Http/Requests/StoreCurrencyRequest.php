<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCurrencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';
        $currencyId = $this->route('currency')?->id;

        return [
            'codigo' => [$required, 'string', 'max:16', Rule::unique('currencies', 'codigo')->ignore($currencyId)],
            'nombre' => [$required, 'string', 'max:255'],
            'tasa' => [$required, 'numeric', 'min:0'],
        ];
    }
}
