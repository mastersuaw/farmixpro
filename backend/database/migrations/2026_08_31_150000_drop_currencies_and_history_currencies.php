<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('how_paid') && Schema::hasColumn('how_paid', 'monedas_id')) {
            Schema::table('how_paid', function (Blueprint $table) {
                $table->dropConstrainedForeignId('monedas_id');
            });
        }

        Schema::dropIfExists('history_currencies');
        Schema::dropIfExists('currencies');
    }

    public function down(): void
    {
        if (! Schema::hasTable('currencies')) {
            Schema::create('currencies', function (Blueprint $table) {
                $table->id();
                $table->string('codigo');
                $table->string('nombre');
                $table->double('tasa');
                $table->timestamps();

                $table->unique('codigo');
            });
        }

        if (! Schema::hasTable('history_currencies')) {
            Schema::create('history_currencies', function (Blueprint $table) {
                $table->id();
                $table->foreignId('monedas_id')->constrained('currencies')->cascadeOnDelete();
                $table->double('tasa');
                $table->date('fecha');
                $table->timestamps();
            });
        }

        if (Schema::hasTable('how_paid') && ! Schema::hasColumn('how_paid', 'monedas_id')) {
            Schema::table('how_paid', function (Blueprint $table) {
                $table->foreignId('monedas_id')->nullable()->after('facturas_id')->constrained('history_currencies')->restrictOnDelete();
            });
        }
    }
};
