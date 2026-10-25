
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// Comprobar que el usuario haya iniciado sesión.
if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión para consultar tus eventos favoritos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

// Consultar únicamente los eventos guardados por este usuario.
$sql = "SELECT evento_id, fecha_guardado
        FROM eventos_favoritos
        WHERE id_usuario = ?
        ORDER BY fecha_guardado DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se pudieron consultar tus eventos favoritos."
    ], JSON_UNESCAPED_UNICODE);

    $stmt->close();
    exit;
}

$resultado = $stmt->get_result();
$eventos = [];

while ($fila = $resultado->fetch_assoc()) {
    $eventos[] = [
        "evento_id" => $fila["evento_id"],
        "fecha_guardado" => $fila["fecha_guardado"]
    ];
}

$stmt->close();

echo json_encode([
    "exito" => true,
    "eventos" => $eventos
], JSON_UNESCAPED_UNICODE);
?>
