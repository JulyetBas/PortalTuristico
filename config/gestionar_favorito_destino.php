
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
$destinoId = trim($_POST["destino_id"] ?? "");
$accion = trim($_POST["accion"] ?? "");

if ($destinoId === "" || !in_array($accion, ["guardar", "quitar"], true)) {
    http_response_code(400);

    echo json_encode([
        "exito" => false,
        "mensaje" => "Los datos enviados no son válidos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($accion === "guardar") {
    $sql = "INSERT IGNORE INTO destinos_favoritos
            (id_usuario, destino_id)
            VALUES (?, ?)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $idUsuario, $destinoId);

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "exito" => false,
            "mensaje" => "No se pudo guardar el destino."
        ], JSON_UNESCAPED_UNICODE);

        $stmt->close();
        exit;
    }

    $stmt->close();

    echo json_encode([
        "exito" => true,
        "mensaje" => "Destino guardado en tus favoritos."
    ], JSON_UNESCAPED_UNICODE);

} else {
    $sql = "DELETE FROM destinos_favoritos
            WHERE id_usuario = ? AND destino_id = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $idUsuario, $destinoId);

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "exito" => false,
            "mensaje" => "No se pudo quitar el destino."
        ], JSON_UNESCAPED_UNICODE);

        $stmt->close();
        exit;
    }

    $stmt->close();

    echo json_encode([
        "exito" => true,
        "mensaje" => "Destino eliminado de tus favoritos."
    ], JSON_UNESCAPED_UNICODE);
}
?>
