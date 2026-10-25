
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// 1. Comprobar que el usuario haya iniciado sesión
if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión para agregar eventos a tu cronograma."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

// 2. Recibir el identificador del evento enviado desde JavaScript
$eventoId = trim($_POST["evento_id"] ?? "");

if ($eventoId === "") {
    http_response_code(400);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se recibió el identificador del evento."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 3. Buscar la próxima edición que todavía no haya terminado
$sql = "SELECT id_edicion
        FROM ediciones_eventos
        WHERE evento_id = ?
          AND fecha_fin >= CURDATE()
        ORDER BY fecha_inicio ASC
        LIMIT 1";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $eventoId);
$stmt->execute();

$resultado = $stmt->get_result();
$edicion = $resultado->fetch_assoc();

$stmt->close();

// 4. Comprobar que exista una edición futura o vigente
if (!$edicion) {
    echo json_encode([
        "exito" => false,
        "mensaje" => "No hay una próxima edición registrada para este evento."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idEdicion = (int) $edicion["id_edicion"];

// 5. Comprobar si el usuario ya agregó este evento
$sql = "SELECT id_cronograma
        FROM cronograma_usuario
        WHERE id_usuario = ?
          AND evento_id = ?
        LIMIT 1";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("is", $idUsuario, $eventoId);
$stmt->execute();

$resultado = $stmt->get_result();
$existente = $resultado->fetch_assoc();

$stmt->close();

if ($existente) {
    echo json_encode([
        "exito" => true,
        "ya_agregado" => true,
        "mensaje" => "Este evento ya está en tu cronograma."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 6. Guardar el evento y su edición en el cronograma personal
$sql = "INSERT INTO cronograma_usuario
        (id_usuario, evento_id, id_edicion)
        VALUES (?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("isi", $idUsuario, $eventoId, $idEdicion);

if ($stmt->execute()) {
    echo json_encode([
        "exito" => true,
        "ya_agregado" => false,
        "mensaje" => "¡Evento agregado a tu cronograma!"
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se pudo guardar el evento. Inténtalo nuevamente."
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conexion->close();
?>
