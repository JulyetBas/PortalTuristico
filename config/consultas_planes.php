<?php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/correo.php";

// =========================================
// RESPUESTA JSON
// =========================================

function responder($exito, $mensaje) {
    echo json_encode([
        "exito" => $exito,
        "mensaje" => $mensaje
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// =========================================
// VERIFICAR EL MÉTODO DE ENVÍO
// =========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Solicitud no válida.");
}

// =========================================
// RECIBIR Y VALIDAR LOS DATOS
// =========================================

$nombre = trim($_POST["nombre"] ?? "");
$correo = trim($_POST["correo"] ?? "");
$telefono = trim($_POST["telefono"] ?? "");
$mensaje = trim($_POST["mensaje"] ?? "");
$idPlan = (int)($_POST["id_plan"] ?? 0);

$planesPermitidos = [
    1 => "Nariño Natural",
    2 => "Nariño de Fe y Tradición"
];

if (
    $nombre === "" ||
    $correo === "" ||
    $telefono === "" ||
    $mensaje === "" ||
    !isset($planesPermitidos[$idPlan])
) {
    responder(false, "Por favor, completa todos los campos.");
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(false, "El correo electrónico no es válido.");
}

if (
    strlen($nombre) > 100 ||
    strlen($correo) > 150 ||
    strlen($telefono) > 30 ||
    strlen($mensaje) > 3000
) {
    responder(false, "Uno de los campos supera la longitud permitida.");
}

// =========================================
// PREPARAR EL CORREO
// =========================================

try {

    $mail = crearCorreo();

    // Correo que recibirá las consultas
    $mail->addAddress("wayrakawsayy@gmail.com", "Wayra Kawsay");

    // Permite responder directamente al visitante
    $mail->addReplyTo($correo, $nombre);

    $nombrePlan = $planesPermitidos[$idPlan];

    $mail->isHTML(true);

    $mail->Subject = "Nueva consulta sobre el plan: " . $nombrePlan;

    // Evitar que los datos ingresados se interpreten como HTML
    $nombreSeguro = htmlspecialchars($nombre, ENT_QUOTES, "UTF-8");
    $correoSeguro = htmlspecialchars($correo, ENT_QUOTES, "UTF-8");
    $telefonoSeguro = htmlspecialchars($telefono, ENT_QUOTES, "UTF-8");
    $mensajeSeguro = nl2br(
        htmlspecialchars($mensaje, ENT_QUOTES, "UTF-8")
    );

    $mail->Body = "
        <h2>Nueva consulta desde Wayra Kawsay</h2>

        <p><strong>Plan:</strong> {$nombrePlan}</p>
        <p><strong>Nombre:</strong> {$nombreSeguro}</p>
        <p><strong>Correo:</strong> {$correoSeguro}</p>
        <p><strong>Teléfono:</strong> {$telefonoSeguro}</p>

        <p><strong>Mensaje:</strong></p>
        <p>{$mensajeSeguro}</p>
    ";

    $mail->AltBody =
        "Nueva consulta desde Wayra Kawsay\n\n" .
        "Plan: {$nombrePlan}\n" .
        "Nombre: {$nombre}\n" .
        "Correo: {$correo}\n" .
        "Teléfono: {$telefono}\n" .
        "Mensaje: {$mensaje}";

    // =====================================
    // ENVIAR
    // =====================================

    $mail->send();

    responder(
        true,
        "¡Tu consulta ha sido enviada! Gracias por comunicarte con Wayra Kawsay. Espera a que nuestro equipo se contacte contigo para brindarte más información."
    );

} catch (\Throwable $error) {

    error_log("Error al enviar consulta de planes: " . $error->getMessage());

    responder(
        false,
        "No fue posible enviar tu consulta en este momento. Inténtalo nuevamente más tarde."
    );

}