
<?php
session_start();

date_default_timezone_set("America/Bogota");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexion.php";

function responder($exito, $mensaje, $codigo = 200) {
    http_response_code($codigo);

    echo json_encode([
        "exito" => $exito,
        "mensaje" => $mensaje
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

$correo = trim($_POST["correo"] ?? "");
$codigo = trim($_POST["codigo"] ?? "");

if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || $codigo === "") {
    responder(false, "Ingresa tu correo y el código de verificación.", 400);
}

try {
    $conexion->begin_transaction();

    // Buscar la cuenta pendiente de verificación.
    $sql = "SELECT id_usuario
            FROM usuario_crear
            WHERE correo = ? AND correo_verificado = 0
            LIMIT 1";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();
    $stmt->close();

    if (!$usuario) {
        $conexion->rollback();
        responder(false, "No se encontró una cuenta pendiente de verificación.", 404);
    }

    $idUsuario = (int) $usuario["id_usuario"];

    // Buscar el código más reciente que no se haya utilizado.
    $sql = "SELECT id_verificacion, codigo_hash, fecha_expiracion
            FROM verificacion_correo
            WHERE id_usuario = ? AND usado = 0
            ORDER BY id_verificacion DESC
            LIMIT 1
            FOR UPDATE";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $verificacion = $resultado->fetch_assoc();
    $stmt->close();

    if (
        !$verificacion ||
        strtotime($verificacion["fecha_expiracion"]) < time() ||
        !password_verify($codigo, $verificacion["codigo_hash"])
    ) {
        $conexion->rollback();
        responder(false, "El código es incorrecto o ha expirado.", 400);
    }

    // Marcar el código como utilizado.
    $sql = "UPDATE verificacion_correo
            SET usado = 1
            WHERE id_verificacion = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $verificacion["id_verificacion"]);
    $stmt->execute();
    $stmt->close();

    // Confirmar el correo del usuario.
    $sql = "UPDATE usuario_crear
            SET correo_verificado = 1
            WHERE id_usuario = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->close();

    $conexion->commit();

    // Iniciar sesión después de verificar el correo.
    session_regenerate_id(true);

    $_SESSION["id_usuario"] = $idUsuario;
    $_SESSION["correo"] = $correo;

    $sql = "SELECT nombre_predeterminado
            FROM usuario_crear
            WHERE id_usuario = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $datosUsuario = $resultado->fetch_assoc();
    $stmt->close();

    $_SESSION["nombre_usuario"] = $datosUsuario["nombre_predeterminado"];

    responder(
        true,
        "¡Correo verificado correctamente! Ya puedes ingresar a Wayra Kawsay."
    );

} catch (Throwable $e) {
    if ($conexion->errno === 0) {
        // La transacción pudo haber finalizado antes del error.
    } else {
        $conexion->rollback();
    }

    error_log("Error al verificar correo: " . $e->getMessage());

    responder(false, "No fue posible verificar el correo. Inténtalo nuevamente.", 500);
}
?>
