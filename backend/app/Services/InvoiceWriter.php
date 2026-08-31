<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\HowPaid;
use App\Models\InvocesProducts;
use App\Models\InvocesTaxes;
use App\Models\Invoices;
use Illuminate\Support\Facades\DB;

class InvoiceWriter
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, int $userId): Invoices
    {
        return DB::transaction(function () use ($data, $companyId, $userId) {
            $status = $this->statusFrom($data['status'] ?? InvoiceStatus::Open);

            $invoice = Invoices::query()->create([
                'companies_id' => $companyId,
                'who_open' => $userId,
                'who_close' => $this->whoClose($status, $data, $userId),
                'fecha' => $data['fecha'],
                'subtotal' => $data['subtotal'] ?? 0,
                'total' => $data['total'] ?? 0,
                'status' => $status,
            ]);

            $this->syncNested($invoice, $data, $companyId, $userId, creating: true);
            $this->recalculate($invoice, $data);

            return $invoice->fresh($this->relations());
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Invoices $invoice, array $data, int $companyId, int $userId): Invoices
    {
        return DB::transaction(function () use ($invoice, $data, $companyId, $userId) {
            $status = array_key_exists('status', $data)
                ? $this->statusFrom($data['status'])
                : $invoice->status;

            $payload = collect($data)->only([
                'fecha',
                'subtotal',
                'total',
            ])->all();

            $payload['status'] = $status;
            $payload['who_close'] = array_key_exists('who_close', $data)
                ? $data['who_close']
                : $this->whoClose($status, $data, $userId, $invoice->who_close);

            $invoice->update($payload);
            $this->syncNested($invoice, $data, $companyId, $userId, creating: false);
            $this->recalculate($invoice->fresh($this->relations()), $data);

            return $invoice->fresh($this->relations());
        });
    }

    /**
     * @return list<string>
     */
    public function relations(): array
    {
        return [
            'opener',
            'closer',
            'invocesProducts.variant',
            'invocesTaxes.tax',
            'howPaid.methodPayment',
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function syncNested(Invoices $invoice, array $data, int $companyId, int $userId, bool $creating): void
    {
        if ($creating || array_key_exists('products', $data)) {
            $invoice->invocesProducts()->delete();

            foreach ($data['products'] ?? [] as $line) {
                InvocesProducts::query()->create([
                    'companies_id' => $companyId,
                    'users_id' => $userId,
                    'facturas_id' => $invoice->id,
                    'variants_id' => $line['variants_id'],
                    'cantidad' => $line['cantidad'],
                    'precio' => $line['precio'],
                    'descuento' => $line['descuento'] ?? 0,
                ]);
            }
        }

        if ($creating || array_key_exists('taxes', $data)) {
            $invoice->invocesTaxes()->delete();

            foreach ($data['taxes'] ?? [] as $tax) {
                InvocesTaxes::query()->create([
                    'companies_id' => $companyId,
                    'facturas_id' => $invoice->id,
                    'impuestos_id' => $tax['impuestos_id'],
                ]);
            }
        }

        if ($creating || array_key_exists('payments', $data)) {
            $invoice->howPaid()->delete();

            foreach ($data['payments'] ?? [] as $payment) {
                HowPaid::query()->create([
                    'companies_id' => $companyId,
                    'metodos_pagos_id' => $payment['metodos_pagos_id'],
                    'facturas_id' => $invoice->id,
                    'amount' => $payment['amount'],
                    'discount' => $payment['discount'] ?? 0,
                    'rate' => $payment['rate'] ?? 1,
                ]);
            }
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function recalculate(Invoices $invoice, array $data): void
    {
        $invoice->load(['invocesProducts', 'invocesTaxes.tax']);

        $computedSubtotal = $invoice->invocesProducts->sum(
            fn (InvocesProducts $line): float => ($line->cantidad * $line->precio) - $line->descuento,
        );

        $taxAmount = $invoice->invocesTaxes->sum(
            fn (InvocesTaxes $row): float => $computedSubtotal * (((float) ($row->tax?->tasa ?? 0)) / 100),
        );

        $updates = [];

        if (! array_key_exists('subtotal', $data) || $data['subtotal'] === null) {
            $updates['subtotal'] = $computedSubtotal;
        }

        if (! array_key_exists('total', $data) || $data['total'] === null) {
            $subtotal = $updates['subtotal'] ?? $invoice->subtotal ?? $computedSubtotal;
            $updates['total'] = $subtotal + $taxAmount;
        }

        if ($updates !== []) {
            $invoice->update($updates);
        }
    }

    private function statusFrom(mixed $status): InvoiceStatus
    {
        if ($status instanceof InvoiceStatus) {
            return $status;
        }

        return InvoiceStatus::from((string) $status);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function whoClose(InvoiceStatus $status, array $data, int $userId, mixed $existing = null): mixed
    {
        if (array_key_exists('who_close', $data)) {
            return $data['who_close'];
        }

        if ($status === InvoiceStatus::Closed) {
            return $existing ?? $userId;
        }

        return $status === InvoiceStatus::Open ? null : $existing;
    }
}
