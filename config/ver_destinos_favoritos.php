
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// Comprobar que el usuario haya iniciado sesión.
if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión para consultar tus destinos favoritos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

// Consultar únicamente los destinos guardados por este usuario.
$sql = "SELECT destino_id, fecha_guardado
        FROM destinos_favoritos
        WHERE id_usuario = ?
        ORDER BY fecha_guardado DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idUsuario);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se pudieron consultar tus destinos favoritos."
    ], JSON_UNESCAPED_UNICODE);

    $stmt->close();
    exit;
}

$resultado = $stmt->get_result();
$destinos = [];

while ($fila = $resultado->fetch_assoc()) {
    $destinos[] = [
        "destino_id" => $fila["destino_id"],
        "fecha_guardado" => $fila["fecha_guardado"]
    ];
}

$stmt->close();

echo json_encode([
    "exito" => true,
    "destinos" => $destinos
], JSON_UNESCAPED_UNICODE);
?>
