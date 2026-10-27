
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";

function responder($exito, $mensaje, $codigo = 200) {
    http_response_code($codigo);

    echo json_encode([
        "exito" => $exito,
        "mensaje" => $mensaje
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Verificar que el usuario haya iniciado sesión.
if (!isset($_SESSION["id_usuario"])) {
    responder(false, "Debes iniciar sesión.", 401);
}

// Permitir únicamente solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Recibir y validar los datos.
$idResena = filter_var(
    $_POST["id_resena"] ?? null,
    FILTER_VALIDATE_INT
);

$calificacion = filter_var(
    $_POST["calificacion"] ?? null,
    FILTER_VALIDATE_INT
);

$comentario = trim($_POST["comentario"] ?? "");

if (!$idResena || $idResena < 1) {
    responder(false, "La reseña no es válida.", 400);
}

if (
    $calificacion === false ||
    $calificacion === null ||
    $calificacion < 1 ||
    $calificacion > 5
) {
    responder(false, "La calificación debe estar entre 1 y 5.", 400);
}

if (mb_strlen($comentario) > 1000) {
    responder(false, "El comentario no puede superar los 1000 caracteres.", 400);
}

$idUsuario = (int) $_SESSION["id_usuario"];

// Actualizar únicamente si la reseña pertenece al usuario.
$sql = "
    UPDATE resenas_destinos
    SET calificacion = ?, comentario = ?
    WHERE id_resena = ? AND id_usuario = ?
";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    responder(false, "No se pudo preparar la edición.", 500);
}

$stmt->bind_param(
    "isii",
    $calificacion,
    $comentario,
    $idResena,
    $idUsuario
);

if (!$stmt->execute()) {
    $stmt->close();
    responder(false, "No se pudo actualizar la reseña.", 500);
}

$actualizada = $stmt->affected_rows >= 0;

$stmt->close();
$conexion->close();

if (!$actualizada) {
    responder(false, "No se pudo actualizar la reseña.", 500);
}

responder(true, "Reseña actualizada correctamente.");
?>
