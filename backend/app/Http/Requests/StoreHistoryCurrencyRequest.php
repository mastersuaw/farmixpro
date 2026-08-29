<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHistoryCurrencyRequest extends FormRequest
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

        return [
            'monedas_id' => [$required, 'integer', 'exists:currencies,id'],
            'tasa' => [$required, 'numeric', 'min:0'],
            'fecha' => [$required, 'date'],
        ];
    }
}
