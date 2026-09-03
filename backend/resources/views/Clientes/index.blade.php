<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Clientes | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <div class="page-header">

                <div>
                    <h1 class="page-title">Lista de Clientes</h1>

                    <p class="page-subtitle">
                        Administra la información de tus clientes
                    </p>
                </div>

                <a href="{{ route('clientes.create') }}" class="btn-primary">
                    + Nuevo Cliente
                </a>

            </div>


            <div class="farmix-card">

                <table class="farmix-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>APELLIDO</th>
                            <th>CÉDULA</th>
                            <th>TELÉFONO</th>
                            <th>EMAIL</th>
                            <th>DIRECCIÓN</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse ($clientes as $cliente)

                            <tr>

                                <td>{{ $cliente->id }}</td>

                                <td>{{ $cliente->nombre }}</td>

                                <td>{{ $cliente->apellido }}</td>

                                <td>{{ $cliente->cedula }}</td>

                                <td>{{ $cliente->telefono }}</td>

                                <td>{{ $cliente->email }}</td>

                                <td>{{ $cliente->direccion }}</td>

                                <td>

                                    <a href="{{ route('clientes.edit', $cliente->id) }}"
                                       class="btn-edit">
                                        Editar
                                    </a>

                                    <form action="{{ route('clientes.destroy', $cliente->id) }}"
                                          method="POST"
                                          style="display: inline;">

                                        @csrf
                                        @method('DELETE')

                                        <button type="submit"
                                                class="btn-delete"
                                                onclick="return confirm('¿Seguro que deseas eliminar este cliente?')">
                                            Eliminar
                                        </button>

                                    </form>

                                </td>

                            </tr>

                        @empty

                            <tr>
                                <td colspan="8" style="text-align: center; padding: 30px;">
                                    No hay clientes registrados todavía.
                                </td>
                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>

        </main>

    </div>

</body>

</html>