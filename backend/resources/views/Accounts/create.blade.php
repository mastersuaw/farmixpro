<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Nueva Cuenta | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <div class="page-header">

                <div>
                    <h1 class="page-title">Registrar Nueva Cuenta</h1>

                    <p class="page-subtitle">
                        Agrega una nueva cuenta bancaria para uno de tus clientes
                    </p>
                </div>

                <a href="{{ route('accounts.index') }}" class="btn-secondary">
                    ← Volver
                </a>

            </div>


            <div class="farmix-card form-card">

                <form action="{{ route('accounts.store') }}" method="POST">

                    @csrf


                    <div class="form-grid">

                        <div class="form-group">

                            <label>Cliente</label>

                            <select name="cliente_id" required>

                                <option value="">
                                    Seleccione un cliente
                                </option>

                                @foreach ($clientes as $cliente)

                                    <option value="{{ $cliente->id }}">

                                        {{ $cliente->nombre }}
                                        {{ $cliente->apellido }}

                                    </option>

                                @endforeach

                            </select>

                        </div>


                        <div class="form-group">

                            <label>Nombre de la cuenta</label>

                            <input
                                type="text"
                                name="nombre_cuenta"
                                required
                                placeholder="Ejemplo: Cuenta Principal">

                        </div>


                        <div class="form-group">

                            <label>Número de cuenta</label>

                            <input
                                type="text"
                                name="numero_cuenta"
                                required
                                placeholder="Ingrese el número de cuenta">

                        </div>


                        <div class="form-group">

                            <label>Balance</label>

                            <input
                                type="number"
                                name="balance"
                                step="0.01"
                                required
                                placeholder="0.00">

                        </div>


                        <div class="form-group">

                            <label>Tipo de cuenta</label>

                            <select name="tipo_cuenta" required>

                                <option value="">
                                    Seleccione el tipo
                                </option>

                                <option value="Ahorro">
                                    Ahorro
                                </option>

                                <option value="Corriente">
                                    Corriente
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="form-actions">

                        <a href="{{ route('accounts.index') }}" class="btn-secondary">
                            Cancelar
                        </a>

                        <button type="submit" class="btn-primary">
                            Guardar Cuenta
                        </button>

                    </div>

                </form>

            </div>

        </main>

    </div>

</body>

</html>