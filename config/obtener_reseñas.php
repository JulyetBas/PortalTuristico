
<?php

header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";

$destino = trim($_GET["destino"] ?? "");

$destinosPermitidos = [
    "cocha", "lajas", "volcan", "tumaco",
    "museo", "gradas", "cruz", "pi"
];

if (!in_array($destino, $destinosPermitidos, true)) {
    http_response_code(400);
    echo json_encode([
        "exito" => false,
        "mensaje" => "Destino no válido."
    ]);
    exit;
}

// Consultar el promedio y la cantidad de calificaciones.
$sqlPromedio = "
    SELECT
        COUNT(*) AS total,
        COALESCE(ROUND(AVG(calificacion), 1), 0) AS promedio
    FROM resenas_destinos
    WHERE destino = ?
";

$stmt = $conexion->prepare($sqlPromedio);
$stmt->bind_param("s", $destino);
$stmt->execute();

$promedio = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Consultar las reseñas y el nombre de cada usuario.
$sqlResenas = "
    SELECT
         r.id_resena,
        r.id_usuario,
        u.nombre_predeterminado AS nombre,
        r.calificacion,
        r.comentario,
        r.fecha_creacion
    FROM resenas_destinos AS r
    INNER JOIN usuario_crear AS u
        ON r.id_usuario = u.id_usuario
    WHERE r.destino = ?
    ORDER BY r.fecha_creacion DESC
";

$stmt = $conexion->prepare($sqlResenas);
$stmt->bind_param("s", $destino);
$stmt->execute();

$resultado = $stmt->get_result();
$resenas = [];

while ($fila = $resultado->fetch_assoc()) {
    $resenas[] = $fila;
}

$stmt->close();

echo json_encode([
    "exito" => true,
    "promedio" => (float) $promedio["promedio"],
    "total" => (int) $promedio["total"],
    "resenas" => $resenas
], JSON_UNESCAPED_UNICODE);

$conexion->close();
?>
