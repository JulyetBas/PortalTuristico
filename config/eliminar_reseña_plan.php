
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

// Eliminar únicamente la opinión de este usuario.
$sql = "DELETE FROM `reseñas_planes`
        WHERE id_reseña = ?
          AND id_usuario = ?";

$stmt = $conexion->prepare($sql);

$stmt->bind_param("ii", $id_reseña, $id_usuario);

if ($stmt->execute()) {

    $eliminadas = $stmt->affected_rows;

    $stmt->close();

    if ($eliminadas === 0) {
        responder(false, "No se encontró la opinión o no te pertenece.", 404);
    }

    responder(true, "Tu opinión se eliminó correctamente.");
}

$stmt->close();

responder(false, "No se pudo eliminar la opinión.", 500);

?>
