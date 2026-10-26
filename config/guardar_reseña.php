
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
    responder(false, "Debes iniciar sesión para publicar una reseña.", 401);
}

// Solo aceptar solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Recibir los datos.
$destino = trim($_POST["destino"] ?? "");
$calificacion = filter_var(
    $_POST["calificacion"] ?? null,
    FILTER_VALIDATE_INT
);
$comentario = trim($_POST["comentario"] ?? "");

// Destinos permitidos.
$destinosPermitidos = [
    "cocha",
    "lajas",
    "volcan",
    "tumaco",
    "museo",
    "gradas",
    "cruz",
    "pi"
];

if (!in_array($destino, $destinosPermitidos, true)) {
    responder(false, "El destino seleccionado no es válido.", 400);
}

if ($calificacion === false || $calificacion < 1 || $calificacion > 5) {
    responder(false, "Selecciona entre 1 y 5 estrellas.", 400);
}

if (mb_strlen($comentario) > 2000) {
    responder(false, "El comentario no puede superar los 2000 caracteres.", 400);
}

// Guardar la reseña.

/* Comprobar si el usuario ya reseñó este destino. */
$idUsuario = (int) $_SESSION["id_usuario"];

$sqlExiste = "
    SELECT id_resena
    FROM resenas_destinos
    WHERE id_usuario = ? AND destino = ?
    LIMIT 1
";

$stmt = $conexion->prepare($sqlExiste);

if (!$stmt) {
    responder(false, "No se pudo verificar la reseña existente.", 500);
}

$stmt->bind_param("is", $idUsuario, $destino);
$stmt->execute();
$resultadoExistente = $stmt->get_result();
$yaExiste = $resultadoExistente->num_rows > 0;
$stmt->close();

if ($yaExiste) {
    responder(false, "Ya publicaste una reseña para este destino. Puedes eliminarla antes de publicar otra.", 409);
}

/* Guardar la reseña. */
$sql = "INSERT INTO resenas_destinos
        (id_usuario, destino, calificacion, comentario)
        VALUES (?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    responder(false, "No se pudo preparar el registro.", 500);
}

$stmt->bind_param(
    "isis",
    $idUsuario,
    $destino,
    $calificacion,
    $comentario
);

if (!$stmt->execute()) {
    $stmt->close();
    responder(false, "No se pudo guardar la reseña.", 500);
}

$stmt->close();
$conexion->close();

responder(true, "¡Tu reseña se guardó correctamente!");

?>
