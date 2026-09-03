<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Editar Cuenta | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <!-- ENCABEZADO -->
            <div class="page-header">

                <div>
                    <h1 class="page-title">Editar Cuenta</h1>

                    <p class="page-subtitle">
                        Actualiza la información de la cuenta bancaria
                    </p>
                </div>

                <a href="{{ route('accounts.index') }}" class="btn-secondary">
                    ← Volver
                </a>

            </div>


            <!-- FORMULARIO -->
            <div class="farmix-card">

                <form action="{{ route('accounts.update', $account->id) }}"
                      method="POST"
                      class="farmix-form">

                    @csrf
                    @method('PUT')


                    <div class="form-grid">


                        <!-- CLIENTE -->
                        <div class="form-group">

                            <label>Cliente</label>

                            <select name="cliente_id" required>

                                @foreach ($clientes as $cliente)

                                    <option value="{{ $cliente->id }}"
                                        {{ $account->cliente_id == $cliente->id ? 'selected' : '' }}>

                                        {{ $cliente->nombre }} {{ $cliente->apellido }}

                                    </option>

                                @endforeach

                            </select>

                        </div>


                        <!-- NOMBRE DE LA CUENTA -->
                        <div class="form-group">

                            <label>Nombre de la cuenta</label>

                            <input type="text"
                                   name="nombre_cuenta"
                                   value="{{ $account->nombre_cuenta }}"
                                   required>

                        </div>


                        <!-- NÚMERO DE CUENTA -->
                        <div class="form-group">

                            <label>Número de cuenta</label>

                            <input type="text"
                                   name="numero_cuenta"
                                   value="{{ $account->numero_cuenta }}"
                                   required>

                        </div>


                        <!-- BALANCE -->
                        <div class="form-group">

                            <label>Balance</label>

                            <input type="number"
                                   name="balance"
                                   step="0.01"
                                   value="{{ $account->balance }}"
                                   required>

                        </div>


                        <!-- TIPO DE CUENTA -->
                        <div class="form-group">

                            <label>Tipo de cuenta</label>

                            <select name="tipo_cuenta" required>

                                <option value="Ahorro"
                                    {{ strtolower($account->tipo_cuenta) == 'ahorro' ? 'selected' : '' }}>
                                    Ahorro
                                </option>

                                <option value="Corriente"
                                    {{ strtolower($account->tipo_cuenta) == 'corriente' ? 'selected' : '' }}>
                                    Corriente
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- BOTONES -->
                    <div class="form-actions">

                        <a href="{{ route('accounts.index') }}"
                           class="btn-secondary">
                            Cancelar
                        </a>

                        <button type="submit"
                                class="btn-primary">
                            Actualizar Cuenta
                        </button>

                    </div>

                </form>

            </div>

        </main>

    </div>

</body>

</html>