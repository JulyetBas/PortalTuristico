
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// Comprobar que el usuario haya iniciado sesión.
if (!isset($_SESSION["id_usuario"])) {
    http_response_code(401);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Debes iniciar sesión para guardar tus favoritos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$idUsuario = (int) $_SESSION["id_usuario"];

// Recibir los datos enviados desde JavaScript.
$eventoId = trim($_POST["evento_id"] ?? "");
$accion = trim($_POST["accion"] ?? "");

// Validar los datos recibidos.
if (
    $eventoId === "" ||
    !in_array($accion, ["guardar", "quitar"], true)
) {
    http_response_code(400);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Los datos enviados no son válidos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($accion === "guardar") {

    $sql = "INSERT IGNORE INTO eventos_favoritos
            (id_usuario, evento_id)
            VALUES (?, ?)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $idUsuario, $eventoId);

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "exito" => false,
            "mensaje" => "No se pudo guardar el evento."
        ], JSON_UNESCAPED_UNICODE);

        $stmt->close();
        exit;
    }

    $stmt->close();

    echo json_encode([
        "exito" => true,
        "mensaje" => "Evento guardado en tus favoritos."
    ], JSON_UNESCAPED_UNICODE);

} else {

    $sql = "DELETE FROM eventos_favoritos
            WHERE id_usuario = ? AND evento_id = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $idUsuario, $eventoId);

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "exito" => false,
            "mensaje" => "No se pudo quitar el evento."
        ], JSON_UNESCAPED_UNICODE);

        $stmt->close();
        exit;
    }

    $stmt->close();

    echo json_encode([
        "exito" => true,
        "mensaje" => "Evento eliminado de tus favoritos."
    ], JSON_UNESCAPED_UNICODE);
}
?>
