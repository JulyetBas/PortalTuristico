
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

$sql = "SELECT
            e.evento_id,
            e.nombre,
            ed.fecha_inicio,
            ed.fecha_fin
        FROM cronograma_usuario cu
        INNER JOIN eventos e
            ON e.evento_id = cu.evento_id
        LEFT JOIN ediciones_eventos ed
            ON ed.id_edicion = cu.id_edicion
        WHERE cu.id_usuario = ?
        ORDER BY ed.fecha_inicio ASC, e.nombre ASC";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se pudo consultar el cronograma."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmt->bind_param("i", $idUsuario);
$stmt->execute();

$resultado = $stmt->get_result();
$eventos = [];

while ($fila = $resultado->fetch_assoc()) {
    $eventos[] = $fila;
}

$stmt->close();

echo json_encode([
    "exito" => true,
    "eventos" => $eventos
], JSON_UNESCAPED_UNICODE);
?>
