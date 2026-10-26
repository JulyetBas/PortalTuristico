
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

if (!isset($_SESSION["id_usuario"])) {
    responder(false, "Debes iniciar sesión.", 401);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

$idResena = filter_var(
    $_POST["id_resena"] ?? null,
    FILTER_VALIDATE_INT
);

if (!$idResena || $idResena < 1) {
    responder(false, "La reseña no es válida.", 400);
}

$idUsuario = (int) $_SESSION["id_usuario"];

$sql = "
    DELETE FROM resenas_destinos
    WHERE id_resena = ? AND id_usuario = ?
";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    responder(false, "No se pudo preparar la eliminación.", 500);
}

$stmt->bind_param("ii", $idResena, $idUsuario);

if (!$stmt->execute()) {
    $stmt->close();
    responder(false, "No se pudo eliminar la reseña.", 500);
}

$eliminada = $stmt->affected_rows > 0;
$stmt->close();
$conexion->close();

if (!$eliminada) {
    responder(false, "No se encontró tu reseña.", 404);
}

responder(true, "Reseña eliminada correctamente.");
?>
