<?php

namespace App\Http\Requests;

class StoreVariantProductChannelRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'variants_products_id' => [$required, 'integer', $this->existsInCompany('variants_products')],
            'channels_id' => [$required, 'integer', $this->existsInCompany('channels')],
            'price' => [$required, 'numeric', 'min:0'],
            'stock' => ['sometimes', 'numeric', 'min:0'],
            'is_avaliable' => ['sometimes', 'boolean'],
            'is_available' => ['sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->exists('is_available') && ! $this->exists('is_avaliable')) {
            $this->merge([
                'is_avaliable' => $this->boolean('is_available'),
            ]);
        }
    }
}
