<?php

namespace Database\Seeders;

use App\Enums\InvoiceStatus;
use App\Enums\TipoReferencia;
use App\Models\Accounts;
use App\Models\BalanceCuentas;
use App\Models\Channels;
use App\Models\Companies;
use App\Models\Currencies;
use App\Models\Customers;
use App\Models\HistoryCurrencies;
use App\Models\HowPaid;
use App\Models\InvocesProducts;
use App\Models\InvocesTaxes;
use App\Models\Invoices;
use App\Models\MethodsPayments;
use App\Models\Products;
use App\Models\Taxes;
use App\Models\User;
use App\Models\UsersCompanies;
use App\Models\VariantsProducts;
use App\Models\VariantsProductsAttributes;
use App\Models\VariantsProductsChannels;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->create([
            'name' => 'Admin FarmixPro',
            'email' => 'admin@farmixpro.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $company = Companies::query()->create([
            'name' => 'FarmixPro SAS',
            'address' => 'Cra 23 # 65-12, Manizales, Caldas',
        ]);

        UsersCompanies::query()->create([
            'users_id' => $user->id,
            'companies_id' => $company->id,
        ]);

        $customer = Customers::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Café del Parque',
            'card_id' => '900123456',
            'direccion' => 'Cra 15 # 8-40, Manizales',
            'telefono' => '3001234567',
        ]);

        Customers::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Mercado Campesino',
            'card_id' => '890987654',
            'direccion' => 'Plaza de mercado, Armenia',
            'telefono' => '3109876543',
        ]);

        $caja = Accounts::query()->create([
            'companies_id' => $company->id,
            'parent_id' => null,
            'nombre' => 'Activos',
            'codigo' => '1',
            'descripcion' => 'Cuenta padre de activos',
        ]);

        Accounts::query()->create([
            'companies_id' => $company->id,
            'parent_id' => $caja->id,
            'nombre' => 'Caja',
            'codigo' => '1105',
            'descripcion' => 'Efectivo en caja',
        ]);

        $cop = Currencies::query()->create([
            'codigo' => 'COP',
            'nombre' => 'Peso colombiano',
            'tasa' => 1,
        ]);

        Currencies::query()->create([
            'codigo' => 'USD',
            'nombre' => 'Dólar estadounidense',
            'tasa' => 4100,
        ]);

        $copHistory = HistoryCurrencies::query()->create([
            'monedas_id' => $cop->id,
            'tasa' => 1,
            'fecha' => now()->toDateString(),
        ]);

        $iva = Taxes::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'IVA 19%',
            'descripcion' => 'Impuesto al valor agregado',
            'tasa' => 19,
        ]);

        $coffee = Products::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Café pergamino',
            'descripcion' => 'Café pergamino seco de finca',
            'precio' => 18500,
        ]);

        $tomato = Products::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Tomate chonto',
            'descripcion' => 'Tomate fresco para mercado local',
            'precio' => 3200,
        ]);

        $premium = VariantsProducts::query()->create([
            'companies_id' => $company->id,
            'products_id' => $coffee->id,
            'sku' => 'CAFE-PERG-PREM',
            'name' => 'Premium',
            'description' => 'Grano seleccionado',
            'stock' => 1250.5,
        ]);

        VariantsProducts::query()->create([
            'companies_id' => $company->id,
            'products_id' => $coffee->id,
            'sku' => 'CAFE-PERG-STD',
            'name' => 'Estándar',
            'description' => 'Grano comercial',
            'stock' => 800,
        ]);

        VariantsProductsAttributes::query()->create([
            'companies_id' => $company->id,
            'variants_products_id' => $premium->id,
            'name' => 'presentacion',
            'value' => 'saco 70kg',
        ]);

        $pos = Channels::query()->create([
            'companies_id' => $company->id,
            'name' => 'POS',
            'description' => 'Punto de venta local',
        ]);

        VariantsProductsChannels::query()->create([
            'companies_id' => $company->id,
            'variants_products_id' => $premium->id,
            'channels_id' => $pos->id,
            'price' => 19000,
            'stock' => 200,
            'is_avaliable' => true,
        ]);

        $cash = MethodsPayments::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Efectivo',
        ]);

        MethodsPayments::query()->create([
            'companies_id' => $company->id,
            'nombre' => 'Transferencia',
        ]);

        $invoice = Invoices::query()->create([
            'companies_id' => $company->id,
            'who_open' => $user->id,
            'who_close' => null,
            'clientes_id' => $customer->id,
            'fecha' => now()->toDateString(),
            'subtotal' => 37000,
            'total' => 44030,
            'status' => InvoiceStatus::Open,
        ]);

        InvocesProducts::query()->create([
            'companies_id' => $company->id,
            'users_id' => $user->id,
            'facturas_id' => $invoice->id,
            'variants_id' => $premium->id,
            'cantidad' => 2,
            'precio' => 18500,
            'descuento' => 0,
        ]);

        InvocesTaxes::query()->create([
            'companies_id' => $company->id,
            'facturas_id' => $invoice->id,
            'impuestos_id' => $iva->id,
        ]);

        HowPaid::query()->create([
            'companies_id' => $company->id,
            'metodos_pagos_id' => $cash->id,
            'facturas_id' => $invoice->id,
            'monedas_id' => $copHistory->id,
            'amount' => 44030,
            'discount' => 0,
            'rate' => 1,
        ]);

        BalanceCuentas::query()->create([
            'companies_id' => $company->id,
            'cuentas_id' => $caja->id,
            'referencia' => 'INV-'.$invoice->id,
            'tipo_referencia' => TipoReferencia::Invoice,
            'debito' => 44030,
            'credito' => 0,
            'fecha' => now(),
        ]);
    }
}
