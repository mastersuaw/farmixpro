<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Cliente;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::with('cliente')->get();

        return view('Accounts.index', compact('accounts'));
    }

    public function create()
    {
        $clientes = Cliente::all();

        return view('Accounts.create', compact('clientes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'nombre_cuenta' => 'required|string|max:255',
            'numero_cuenta' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'tipo_cuenta' => 'required|string|max:255',
        ]);

        Account::create($request->all());

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Cuenta registrada correctamente.');
    }

    public function edit($id)
    {
        $account = Account::findOrFail($id);

        $clientes = Cliente::all();

        return view('Accounts.edit', compact('account', 'clientes'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'nombre_cuenta' => 'required|string|max:255',
            'numero_cuenta' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'tipo_cuenta' => 'required|string|max:255',
        ]);

        $account = Account::findOrFail($id);

        $account->update($request->all());

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Cuenta actualizada correctamente.');
    }

    public function destroy($id)
    {
        $account = Account::findOrFail($id);

        $account->delete();

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Cuenta eliminada correctamente.');
    }
}