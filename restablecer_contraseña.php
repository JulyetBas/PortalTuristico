
<?php
date_default_timezone_set("America/Bogota");
require_once __DIR__ . "/config/conexion.php";

$mensaje = "";
$token = "";
$tokenValido = false;
$mostrarFormulario = false;

// Comprobar el token recibido por el enlace.
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $token = $_GET["token"] ?? "";

    if (preg_match('/^[a-f0-9]{64}$/', $token)) {
        $tokenHash = hash("sha256", $token);

        $sql = "SELECT id_recuperacion
                FROM recuperacion_contraseña
                WHERE token_hash = ?
                  AND usado = 0
                  AND fecha_expiracion > NOW()";

        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("s", $tokenHash);
        $stmt->execute();
        $resultado = $stmt->get_result();

        $tokenValido = $resultado->num_rows === 1;
        $stmt->close();
    }

    if ($tokenValido) {
        $mostrarFormulario = true;
    } else {
        $mensaje = "El enlace no es válido, ya fue utilizado o ha expirado. Solicita uno nuevo.";
    }
}

// Procesar el formulario enviado.
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $token = $_POST["token"] ?? "";
    $clave = $_POST["contrasena"] ?? "";
    $confirmar = $_POST["confirmar_contrasena"] ?? "";

    if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
        $mensaje = "El enlace no es válido. Solicita uno nuevo.";
    } elseif (strlen($clave) < 8) {
        $mensaje = "La contraseña debe tener al menos 8 caracteres.";
        $mostrarFormulario = true;
    } elseif ($clave !== $confirmar) {
        $mensaje = "Las contraseñas no coinciden.";
        $mostrarFormulario = true;
    } else {
        $tokenHash = hash("sha256", $token);

        try {
            $conexion->begin_transaction();

            // Bloquear el registro para evitar reutilizar el token.
            $sql = "SELECT id_recuperacion, id_usuario
                    FROM recuperacion_contraseña
                    WHERE token_hash = ?
                      AND usado = 0
                      AND fecha_expiracion > NOW()
                    FOR UPDATE";

            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $tokenHash);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $recuperacion = $resultado->fetch_assoc();
            $stmt->close();

            if (!$recuperacion) {
                $conexion->rollback();
                $mensaje = "El enlace ya no es válido. Solicita uno nuevo.";
            } else {
                $idUsuario = $recuperacion["id_usuario"];
                $hashClave = password_hash($clave, PASSWORD_DEFAULT);

                // Actualizar la contraseña de la cuenta.
                $sql = "UPDATE usuario_crear
                        SET `contraseña` = ?
                        WHERE id_usuario = ?";

                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("si", $hashClave, $idUsuario);
                $stmt->execute();
                $actualizado = $stmt->affected_rows;
                $stmt->close();

                if ($actualizado < 0) {
                    throw new Exception("No se pudo actualizar la contraseña.");
                }

                // Invalidar todos los enlaces de recuperación de esa cuenta.
                $sql = "UPDATE recuperacion_contraseña
                        SET usado = 1
                        WHERE id_usuario = ?";

                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("i", $idUsuario);
                $stmt->execute();
                $stmt->close();

                $conexion->commit();

                $mensaje = "¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.";
                $token = "";
                $mostrarFormulario = false;
            }
        } catch (Throwable $e) {
            try {
                $conexion->rollback();
            } catch (Throwable $ignorado) {
                // La transacción podría haberse cerrado.
            }

            error_log("Error al restablecer contraseña: " . $e->getMessage());
            $mensaje = "No se pudo actualizar la contraseña. Inténtalo nuevamente.";
            $mostrarFormulario = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña - Wayra Kawsay</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: #F5F0E5;
            color: #1e352b;
            font-family: 'Segoe UI', sans-serif;
        }

        .contenedor {
            width: 100%;
            max-width: 430px;
            padding: 32px;
            background: #fffdf7;
            border: 1px solid #B7CDB5;
            border-radius: 18px;
            box-shadow: 0 8px 25px rgba(30, 53, 43, 0.10);
        }

        h1 {
            margin-top: 0;
            text-align: center;
            font-size: 25px;
        }

        p {
            line-height: 1.6;
        }

        label {
            display: block;
            margin: 16px 0 7px;
            font-weight: 600;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #B7CDB5;
            border-radius: 9px;
            font-size: 15px;
        }

        input:focus {
            outline: 2px solid #6F9274;
            outline-offset: 2px;
        }

        button, .enlace {
            display: block;
            width: 100%;
            margin-top: 20px;
            padding: 13px;
            border: 0;
            border-radius: 9px;
            background: #174C3C;
            color: white;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
        }

        .mensaje {
            padding: 12px;
            border-radius: 9px;
            background: #edf3e9;
            overflow-wrap: anywhere;
        }
    </style>
</head>
<body>
    <main class="contenedor">
        <h1>Restablecer contraseña</h1>

        <p>Crea una nueva contraseña para tu cuenta de Wayra Kawsay.</p>

        <?php if ($mensaje !== ""): ?>
            <p class="mensaje" role="status">
                <?= htmlspecialchars($mensaje, ENT_QUOTES, "UTF-8") ?>
            </p>
        <?php endif; ?>

        <?php if ($mostrarFormulario): ?>
            <form method="POST" action="restablecer_contrase%C3%B1a.php">
                <input
                    type="hidden"
                    name="token"
                    value="<?= htmlspecialchars($token, ENT_QUOTES, "UTF-8") ?>"
                >

                <label for="contrasena">Nueva contraseña</label>
                <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >

                <label for="confirmar_contrasena">Confirmar contraseña</label>
                <input
                    type="password"
                    id="confirmar_contrasena"
                    name="confirmar_contrasena"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >

                <button type="submit">Guardar nueva contraseña</button>
            </form>
        <?php endif; ?>

        <a class="enlace" href="dashboard/index.html">
            Volver a Wayra Kawsay
        </a>
    </main>
</body>
</html>
