<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->timestamps();
        });

        Schema::create('users_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('users_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['users_id', 'companies_id']);
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->string('nombre');
            $table->string('card_id')->nullable();
            $table->text('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('nombre');
            $table->string('codigo')->nullable();
            $table->string('descripcion')->nullable();
            $table->timestamps();

            $table->index('parent_id');
            $table->foreign('parent_id')->references('id')->on('accounts')->nullOnDelete();
        });

        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('codigo');
            $table->string('nombre');
            $table->double('tasa');
            $table->timestamps();

            $table->unique('codigo');
        });

        Schema::create('history_currencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monedas_id')->constrained('currencies')->cascadeOnDelete();
            $table->double('tasa');
            $table->date('fecha');
            $table->timestamps();
        });

        Schema::create('taxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->double('tasa');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->double('precio')->default(0);
            $table->timestamps();
        });

        Schema::create('variants_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('products_id')->constrained('products')->cascadeOnDelete();
            $table->string('sku');
            $table->string('name');
            $table->string('description')->nullable();
            $table->double('stock')->default(0);
            $table->timestamps();

            $table->unique(['companies_id', 'sku']);
        });

        Schema::create('variants_products_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('variants_products_id')->constrained('variants_products')->cascadeOnDelete();
            $table->text('name');
            $table->text('value');
            $table->timestamps();
        });

        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('variants_products_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('variants_products_id')->constrained('variants_products')->cascadeOnDelete();
            $table->foreignId('channels_id')->constrained('channels')->cascadeOnDelete();
            $table->double('price')->default(0);
            $table->double('stock')->default(0);
            $table->boolean('is_avaliable')->default(true);
            $table->timestamps();

            $table->unique(['variants_products_id', 'channels_id'], 'vpc_variant_channel_unique');
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('who_open')->constrained('users')->restrictOnDelete();
            $table->unsignedBigInteger('who_close')->nullable();
            $table->foreignId('clientes_id')->constrained('customers')->restrictOnDelete();
            $table->date('fecha');
            $table->double('total')->default(0);
            $table->double('subtotal')->default(0);
            $table->string('status', 32)->default('open');
            $table->timestamps();

            $table->index('who_close');
            $table->foreign('who_close')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('invoces_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('users_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('facturas_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('variants_id')->constrained('variants_products')->restrictOnDelete();
            $table->double('cantidad');
            $table->double('precio');
            $table->double('descuento')->default(0);
            $table->timestamps();
        });

        Schema::create('invoces_taxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('facturas_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('impuestos_id')->constrained('taxes')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('methods_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('how_paid', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('metodos_pagos_id')->constrained('methods_payments')->restrictOnDelete();
            $table->foreignId('facturas_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('monedas_id')->constrained('history_currencies')->restrictOnDelete();
            $table->double('amount');
            $table->double('discount')->default(0);
            $table->double('rate')->default(1);
            $table->timestamps();
        });

        Schema::create('balance_cuentas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('cuentas_id')->constrained('accounts')->restrictOnDelete();
            $table->string('referencia')->nullable();
            $table->string('tipo_referencia', 32);
            $table->double('debito')->default(0);
            $table->double('credito')->default(0);
            $table->timestamp('fecha');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('balance_cuentas');
        Schema::dropIfExists('how_paid');
        Schema::dropIfExists('methods_payments');
        Schema::dropIfExists('invoces_taxes');
        Schema::dropIfExists('invoces_products');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('variants_products_channels');
        Schema::dropIfExists('channels');
        Schema::dropIfExists('variants_products_attributes');
        Schema::dropIfExists('variants_products');
        Schema::dropIfExists('products');
        Schema::dropIfExists('taxes');
        Schema::dropIfExists('history_currencies');
        Schema::dropIfExists('currencies');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('users_companies');
        Schema::dropIfExists('companies');
    }
};
