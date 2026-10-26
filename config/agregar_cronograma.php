
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// 1. Comprobar que el usuario haya iniciado sesión
if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión para modificar tu cronograma."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

// 2. Recibir el identificador del evento
$eventoId = trim($_POST["evento_id"] ?? "");

if ($eventoId === "") {
    http_response_code(400);

    echo json_encode([
        "exito" => false,
        "mensaje" => "No se recibió el identificador del evento."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 3. Comprobar si el evento ya está en el cronograma
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

// 4. Si ya existe, eliminarlo
if ($existente) {
    $idCronograma = (int) $existente["id_cronograma"];

    $sql = "DELETE FROM cronograma_usuario
            WHERE id_cronograma = ?
              AND id_usuario = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ii", $idCronograma, $idUsuario);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode([
            "exito" => true,
            "accion" => "eliminado",
            "mensaje" => "Evento eliminado de tu cronograma."
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);

        echo json_encode([
            "exito" => false,
            "mensaje" => "No se pudo quitar el evento. Inténtalo nuevamente."
        ], JSON_UNESCAPED_UNICODE);
    }

    $stmt->close();
    $conexion->close();
    exit;
}

// 5. Si no existe, buscar la próxima edición vigente o futura
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

if (!$edicion) {
    echo json_encode([
        "exito" => false,
        "mensaje" => "No hay una próxima edición registrada para este evento."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

$idEdicion = (int) $edicion["id_edicion"];

// 6. Agregar el evento al cronograma
$sql = "INSERT INTO cronograma_usuario
        (id_usuario, evento_id, id_edicion)
        VALUES (?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("isi", $idUsuario, $eventoId, $idEdicion);

if ($stmt->execute()) {
    echo json_encode([
        "exito" => true,
        "accion" => "agregado",
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

