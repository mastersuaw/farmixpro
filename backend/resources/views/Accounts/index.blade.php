<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Lista de Cuentas | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <div class="page-header">

                <div>
                    <h1 class="page-title">Lista de Cuentas</h1>

                    <p class="page-subtitle">
                        Administra las cuentas bancarias de tus clientes
                    </p>
                </div>

                <a href="{{ route('accounts.create') }}" class="btn-primary">
                    + Nueva Cuenta
                </a>

            </div>


            <div class="farmix-card">

                <table class="farmix-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CLIENTE</th>
                            <th>NOMBRE DE CUENTA</th>
                            <th>NÚMERO DE CUENTA</th>
                            <th>BALANCE</th>
                            <th>TIPO DE CUENTA</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse ($accounts as $account)

                            <tr>

                                <td>{{ $account->id }}</td>

                                <td>
                                    {{ $account->cliente->nombre ?? '' }}
                                    {{ $account->cliente->apellido ?? '' }}
                                </td>

                                <td>{{ $account->nombre_cuenta }}</td>

                                <td>{{ $account->numero_cuenta }}</td>

                                <td class="balance">
                                    $ {{ number_format($account->balance, 2) }}
                                </td>

                                <td>

                                    @if (strtolower($account->tipo_cuenta) == 'ahorro')

                                        <span class="badge-ahorro">
                                            {{ $account->tipo_cuenta }}
                                        </span>

                                    @else

                                        <span class="badge-corriente">
                                            {{ $account->tipo_cuenta }}
                                        </span>

                                    @endif

                                </td>

                                <td>

                                    <a href="{{ route('accounts.edit', $account->id) }}"
                                       class="btn-edit">
                                        Editar
                                    </a>

                                    <form action="{{ route('accounts.destroy', $account->id) }}"
                                          method="POST"
                                          style="display: inline;">

                                        @csrf
                                        @method('DELETE')

                                        <button type="submit"
                                                class="btn-delete"
                                                onclick="return confirm('¿Seguro que deseas eliminar esta cuenta?')">
                                            Eliminar
                                        </button>

                                    </form>

                                </td>

                            </tr>

                        @empty

                            <tr>

                                <td colspan="7" style="text-align: center; padding: 30px;">
                                    No hay cuentas registradas todavía.
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