<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StoreVariantProductRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';
        $variantId = $this->route('variant')?->id;

        return [
            'products_id' => [$required, 'integer', $this->existsInCompany('products')],
            'sku' => [
                $required,
                'string',
                'max:64',
                Rule::unique('variants_products', 'sku')
                    ->where('companies_id', $this->currentCompanyId())
                    ->ignore($variantId),
            ],
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'stock' => ['sometimes', 'numeric', 'min:0'],
            'attributes' => ['sometimes', 'array'],
            'attributes.*.id' => ['sometimes', 'integer', $this->existsInCompany('variants_products_attributes')],
            'attributes.*.name' => ['required_with:attributes', 'string'],
            'attributes.*.value' => ['required_with:attributes', 'string'],
        ];
    }
}
