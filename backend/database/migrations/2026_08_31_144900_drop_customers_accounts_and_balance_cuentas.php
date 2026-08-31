<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('balance_cuentas');

        if (Schema::hasTable('invoices') && Schema::hasColumn('invoices', 'clientes_id')) {
            Schema::table('invoices', function (Blueprint $table) {
                $table->dropConstrainedForeignId('clientes_id');
            });
        }

        Schema::dropIfExists('customers');
        Schema::dropIfExists('accounts');
    }

    public function down(): void
    {
        if (! Schema::hasTable('customers')) {
            Schema::create('customers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('companies_id')->constrained('companies')->cascadeOnDelete();
                $table->string('nombre');
                $table->string('card_id')->nullable();
                $table->text('direccion')->nullable();
                $table->string('telefono')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('accounts')) {
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
        }

        if (Schema::hasTable('invoices') && ! Schema::hasColumn('invoices', 'clientes_id')) {
            Schema::table('invoices', function (Blueprint $table) {
                $table->foreignId('clientes_id')->nullable()->after('who_close')->constrained('customers')->restrictOnDelete();
            });
        }

        if (! Schema::hasTable('balance_cuentas')) {
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
    }
};
