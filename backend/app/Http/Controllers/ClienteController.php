<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();

        return view('Clientes.index', compact('clientes'));
    }

    public function create()
    {
        return view('Clientes.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'apellido' => 'nullable',
            'cedula' => 'required|unique:clientes',
            'telefono' => 'nullable',
            'email' => 'required|email|unique:clientes',
            'direccion' => 'nullable',
        ]);

        Cliente::create($request->all());

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente registrado correctamente.');
    }

    public function edit(Cliente $cliente)
    {
        return view('Clientes.edit', compact('cliente'));
    }

    public function update(Request $request, Cliente $cliente)
    {
        $request->validate([
            'nombre' => 'required',
            'apellido' => 'nullable',
            'cedula' => 'required|unique:clientes,cedula,' . $cliente->id,
            'telefono' => 'nullable',
            'email' => 'required|email|unique:clientes,email,' . $cliente->id,
            'direccion' => 'nullable',
        ]);

        $cliente->update($request->all());

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado correctamente.');
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente eliminado correctamente.');
    }
}