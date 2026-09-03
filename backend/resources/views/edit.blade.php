<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Editar Cliente | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <div class="page-header">

                <div>
                    <h1 class="page-title">Editar Cliente</h1>

                    <p class="page-subtitle">
                        Actualiza la información del cliente
                    </p>
                </div>

                <a href="{{ route('clientes.index') }}" class="btn-secondary">
                    ← Volver
                </a>

            </div>


            <div class="farmix-card form-card">

                <form action="{{ route('clientes.update', $cliente->id) }}" method="POST">

                    @csrf
                    @method('PUT')


                    <div class="form-grid">

                        <div class="form-group">

                            <label>Nombre</label>

                            <input
                                type="text"
                                name="nombre"
                                value="{{ $cliente->nombre }}"
                                required>

                        </div>


                        <div class="form-group">

                            <label>Apellido</label>

                            <input
                                type="text"
                                name="apellido"
                                value="{{ $cliente->apellido }}"
                                required>

                        </div>


                        <div class="form-group">

                            <label>Cédula</label>

                            <input
                                type="text"
                                name="cedula"
                                value="{{ $cliente->cedula }}"
                                required>

                        </div>


                        <div class="form-group">

                            <label>Teléfono</label>

                            <input
                                type="text"
                                name="telefono"
                                value="{{ $cliente->telefono }}"
                                required>

                        </div>


                        <div class="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value="{{ $cliente->email }}"
                                required>

                        </div>


                        <div class="form-group">

                            <label>Dirección</label>

                            <input
                                type="text"
                                name="direccion"
                                value="{{ $cliente->direccion }}"
                                required>

                        </div>

                    </div>


                    <div class="form-actions">

                        <a href="{{ route('clientes.index') }}" class="btn-secondary">
                            Cancelar
                        </a>

                        <button type="submit" class="btn-primary">
                            Actualizar Cliente
                        </button>

                    </div>

                </form>

            </div>

        </main>

    </div>

</body>

</html>