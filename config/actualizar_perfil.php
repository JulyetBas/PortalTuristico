
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

// Solo permitir solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Comprobar que el usuario haya iniciado sesión.
if (!isset($_SESSION["id_usuario"])) {
    responder(false, "Debes iniciar sesión.", 401);
}

// Recibir los datos del formulario.
$nombre = trim($_POST["nombre"] ?? "");
$apellido = trim($_POST["apellido"] ?? "");

// Validar la longitud de los campos.
if (mb_strlen($nombre, "UTF-8") > 100) {
    responder(false, "El nombre no puede superar los 100 caracteres.", 400);
}

if (mb_strlen($apellido, "UTF-8") > 100) {
    responder(false, "El apellido no puede superar los 100 caracteres.", 400);
}

// Guardar los campos vacíos como NULL.
$nombre = $nombre === "" ? null : $nombre;
$apellido = $apellido === "" ? null : $apellido;

$idUsuario = $_SESSION["id_usuario"];

// Actualizar únicamente nombre y apellido.
$sql = "UPDATE usuario_crear
        SET nombre = ?, apellido = ?
        WHERE id_usuario = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssi", $nombre, $apellido, $idUsuario);

if (!$stmt->execute()) {
    $stmt->close();
    responder(false, "No se pudieron guardar los cambios.", 500);
}

$stmt->close();

responder(true, "Los cambios del perfil se guardaron correctamente.");
?>
