
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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Comprobar sesión.
if (!isset($_SESSION["id_usuario"])) {
    responder(false, "Debes iniciar sesión.", 401);
}

$id_usuario = (int) $_SESSION["id_usuario"];

$id_reseña = filter_var(
    $_POST["id_reseña"] ?? null,
    FILTER_VALIDATE_INT
);

if (!$id_reseña || $id_reseña < 1) {
    responder(false, "La opinión seleccionada no es válida.", 400);
}

// Recibir puntuaciones.
$alojamiento = filter_var($_POST["alojamiento"] ?? null, FILTER_VALIDATE_INT);
$alimentacion = filter_var($_POST["alimentacion"] ?? null, FILTER_VALIDATE_INT);
$coordinacion = filter_var($_POST["coordinacion"] ?? null, FILTER_VALIDATE_INT);
$destino = filter_var($_POST["destino"] ?? null, FILTER_VALIDATE_INT);
$transporte = filter_var($_POST["transporte"] ?? null, FILTER_VALIDATE_INT);
$general = filter_var($_POST["general"] ?? null, FILTER_VALIDATE_INT);

$comentario = trim($_POST["comentario"] ?? "");

// Validar puntuaciones.
$puntuaciones = [
    $alojamiento,
    $alimentacion,
    $coordinacion,
    $destino,
    $transporte,
    $general
];

foreach ($puntuaciones as $puntuacion) {
    if ($puntuacion === false || $puntuacion === null ||
        $puntuacion < 1 || $puntuacion > 5) {
        responder(false, "Todas las puntuaciones deben estar entre 1 y 5.", 400);
    }
}

if ($comentario === "") {
    responder(false, "Escribe un comentario.", 400);
}

if (mb_strlen($comentario, "UTF-8") > 2000) {
    responder(false, "El comentario no puede superar los 2000 caracteres.", 400);
}

// Actualizar únicamente si la reseña pertenece al usuario.
$sql = "UPDATE `reseñas_planes`
        SET alojamiento = ?,
            alimentacion = ?,
            coordinacion = ?,
            destino = ?,
            transporte = ?,
            general = ?,
            comentario = ?
        WHERE id_reseña = ?
          AND id_usuario = ?";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "iiiiiisii",
    $alojamiento,
    $alimentacion,
    $coordinacion,
    $destino,
    $transporte,
    $general,
    $comentario,
    $id_reseña,
    $id_usuario
);

if ($stmt->execute()) {
    $afectadas = $stmt->affected_rows;
    $stmt->close();

    if ($afectadas === 0) {
        responder(
            false,
            "No se encontró la opinión, no te pertenece o no hubo cambios."
        );
    }

    responder(true, "¡Tu opinión se actualizó correctamente!");
}

$stmt->close();

responder(false, "No se pudo actualizar la opinión.", 500);

?>
