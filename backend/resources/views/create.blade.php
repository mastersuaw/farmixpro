<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Nuevo Cliente | FarmixPro</title>

    <link rel="stylesheet" href="{{ asset('css/farmix.css') }}">
</head>

<body>

    <div class="farmix-layout">

        <main class="farmix-content">

            <div class="page-header">

                <div>
                    <h1 class="page-title">Registrar Nuevo Cliente</h1>

                    <p class="page-subtitle">
                        Agrega la información de un nuevo cliente al sistema
                    </p>
                </div>

                <a href="{{ route('clientes.index') }}" class="btn-secondary">
                    ← Volver
                </a>

            </div>


            <div class="farmix-card form-card">

                <form action="{{ route('clientes.store') }}" method="POST">

                    @csrf


                    <div class="form-grid">

                        <div class="form-group">

                            <label>Nombre</label>

                            <input
                                type="text"
                                name="nombre"
                                required
                                placeholder="Ingrese el nombre">

                        </div>


                        <div class="form-group">

                            <label>Apellido</label>

                            <input
                                type="text"
                                name="apellido"
                                required
                                placeholder="Ingrese el apellido">

                        </div>


                        <div class="form-group">

                            <label>Cédula</label>

                            <input
                                type="text"
                                name="cedula"
                                required
                                placeholder="000-0000000-0">

                        </div>


                        <div class="form-group">

                            <label>Teléfono</label>

                            <input
                                type="text"
                                name="telefono"
                                required
                                placeholder="809-000-0000">

                        </div>


                        <div class="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="correo@email.com">

                        </div>


                        <div class="form-group">

                            <label>Dirección</label>

                            <input
                                type="text"
                                name="direccion"
                                required
                                placeholder="Ingrese la dirección">

                        </div>

                    </div>


                    <div class="form-actions">

                        <a href="{{ route('clientes.index') }}" class="btn-secondary">
                            Cancelar
                        </a>

                        <button type="submit" class="btn-primary">
                            Guardar Cliente
                        </button>

                    </div>

                </form>

            </div>

        </main>

    </div>

</body>

</html>