
<?php
session_start();

date_default_timezone_set("America/Bogota");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/correo.php";

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

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(false, "Ingresa un correo válido.", 400);
}

// Buscar la cuenta por correo.
$sql = "SELECT id_usuario, correo_verificado
        FROM usuario_crear
        WHERE correo = ?
        LIMIT 1";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();

$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();
$stmt->close();

if (!$usuario) {
    responder(false, "No encontramos una cuenta con ese correo.", 404);
}

if ((int) $usuario["correo_verificado"] === 1) {
    responder(true, "Este correo ya está verificado. Puedes iniciar sesión.");
}

$idUsuario = (int) $usuario["id_usuario"];

// Generar un código nuevo de seis dígitos.
$codigo = (string) random_int(100000, 999999);
$codigoHash = password_hash($codigo, PASSWORD_DEFAULT);
$expiracion = date("Y-m-d H:i:s", time() + 600);

try {
    $conexion->begin_transaction();

    // Invalidar códigos anteriores que aún no se hayan usado.
    $sql = "UPDATE verificacion_correo
            SET usado = 1
            WHERE id_usuario = ? AND usado = 0";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->close();

    // Guardar el nuevo código protegido.
    $sql = "INSERT INTO verificacion_correo
            (id_usuario, codigo_hash, fecha_expiracion, usado)
            VALUES (?, ?, ?, 0)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iss", $idUsuario, $codigoHash, $expiracion);
    $stmt->execute();
    $stmt->close();

    $conexion->commit();

} catch (Throwable $e) {
    $conexion->rollback();
    error_log("Error al guardar código: " . $e->getMessage());

    responder(false, "No se pudo generar el código. Inténtalo nuevamente.", 500);
}

// Enviar el código al correo.
try {
    $mail = crearCorreo();
    $mail->addAddress($correo);
    $mail->isHTML(true);
    $mail->Subject = "Tu nuevo código de verificación - Wayra Kawsay";

    $mail->Body = "
        <h2>Verifica tu correo en Wayra Kawsay</h2>
        <p>Tu nuevo código de verificación es:</p>
        <h1 style='letter-spacing: 6px;'>$codigo</h1>
        <p>El código vence en 10 minutos y solo puede utilizarse una vez.</p>
        <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
    ";

    $mail->AltBody =
        "Tu código de verificación es: " . $codigo .
        ". Vence en 10 minutos.";

    $mail->send();

    responder(true, "Enviamos un nuevo código a tu correo.");

} catch (Throwable $e) {
    error_log("Error al enviar código de verificación: " . $e->getMessage());

    responder(
        false,
        "No pudimos enviar el correo. Inténtalo nuevamente.",
        500
    );
}
?>
