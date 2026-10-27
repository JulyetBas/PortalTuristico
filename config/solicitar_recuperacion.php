
<?php

date_default_timezone_set("America/Bogota");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexion.php";
require_once __DIR__ . "/correo.php";



function responder($exito, $mensaje, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode(
        ["exito" => $exito, "mensaje" => $mensaje],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

$correo = trim($_POST["correo"] ?? "");

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(false, "Ingresa un correo electrónico válido.", 400);
}

// Buscar al usuario por su correo.
$sql = "SELECT id_usuario FROM usuario_crear WHERE correo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();
$stmt->close();

// No revelar si el correo está registrado.
$mensajeGenerico =
    "Si el correo pertenece a una cuenta registrada, recibirás instrucciones para recuperar tu contraseña.";

if (!$usuario) {
    responder(true, $mensajeGenerico);
}

$idUsuario = (int) $usuario["id_usuario"];

// Crear un token seguro y guardar solamente su hash.
$token = bin2hex(random_bytes(32));
$tokenHash = hash("sha256", $token);
$expiracion = date("Y-m-d H:i:s", time() + 1800);

try {
    $conexion->begin_transaction();

    // Invalidar solicitudes anteriores todavía no utilizadas.
    $sql = "UPDATE recuperacion_contraseña
            SET usado = 1
            WHERE id_usuario = ? AND usado = 0";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->close();

    // Registrar el nuevo token.
    $sql = "INSERT INTO recuperacion_contraseña
            (id_usuario, token_hash, fecha_expiracion, usado)
            VALUES (?, ?, ?, 0)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iss", $idUsuario, $tokenHash, $expiracion);
    $stmt->execute();
    $stmt->close();

    $conexion->commit();
} catch (Throwable $e) {
    $conexion->rollback();
    error_log("Error al registrar recuperación: " . $e->getMessage());
    responder(false, "No fue posible procesar la solicitud. Inténtalo más tarde.", 500);
}

// Construir el enlace para restablecer la contraseña.
// Ajusta esta ruta si tu proyecto utiliza otra página de recuperación.
// aqui se puso ya el link desplejado en inifnityfree, en dado caso va el ip de la red
$base = "https://wayrakawsay.great-site.net";
$enlace = $base . "/restablecer_contrase%C3%B1a.php?token=" . urlencode($token);

try {
    $mail = crearCorreo();
    $mail->addAddress($correo);
    $mail->isHTML(true);
    $mail->Subject = "Recupera tu contraseña - Wayra Kawsay";

    $mail->Body = "
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de Wayra Kawsay.</p>
        <p>
            <a href='" . htmlspecialchars($enlace, ENT_QUOTES, "UTF-8") . "'>
                Crear una nueva contraseña
            </a>
        </p>
        <p>Este enlace vence en 30 minutos y solo se puede utilizar una vez.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    ";

    $mail->AltBody =
        "Para recuperar tu contraseña, abre este enlace: " . $enlace .
        "\nEl enlace vence en 30 minutos.";

    $mail->send();

    responder(true, $mensajeGenerico);
} catch (Throwable $e) {
    error_log("Error al enviar correo de recuperación: " . $e->getMessage());

    responder(
        false,
        "No se pudo enviar el correo. Inténtalo más tarde.",
        500
    );
}
?>
