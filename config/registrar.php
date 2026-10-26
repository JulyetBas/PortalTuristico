
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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

$correo = trim($_POST["correo"] ?? "");
$clave = $_POST["contraseña"] ?? "";
$confirmar = $_POST["confirmar_contraseña"] ?? "";

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(false, "Ingresa un correo electrónico válido.", 400);
}

if (strlen($clave) < 8) {
    responder(false, "La contraseña debe tener al menos 8 caracteres.", 400);
}

if ($clave !== $confirmar) {
    responder(false, "Las contraseñas no coinciden.", 400);
}

// Comprobar si el correo ya está registrado.
$sql = "SELECT id_usuario FROM usuario_crear WHERE correo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    responder(false, "Este correo ya tiene una cuenta registrada.", 409);
}
$stmt->close();

// Generar un nombre de usuario único.
do {
    $nombreUsuario = "Viajero" . random_int(100, 999999);

    $sql = "SELECT id_usuario FROM usuario_crear
            WHERE nombre_predeterminado = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $nombreUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $existe = $resultado->num_rows > 0;
    $stmt->close();

} while ($existe);

// Crear un hash seguro de la contraseña.
$hash = password_hash($clave, PASSWORD_DEFAULT);

// Guardar la cuenta.
$sql = "INSERT INTO usuario_crear
        (correo, nombre_predeterminado, contraseña)
        VALUES (?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $correo, $nombreUsuario, $hash);

if ($stmt->execute()) {

    // Crear la sesión automáticamente al registrar la cuenta.
    session_regenerate_id(true);

    $_SESSION["id_usuario"] = $conexion->insert_id;
    $_SESSION["correo"] = $correo;
    $_SESSION["nombre_usuario"] = $nombreUsuario;

    responder(
        true,
        "¡Cuenta creada correctamente! Bienvenido a Wayra Kawsay, " . $nombreUsuario . "."
    );
}

if ($stmt->errno === 1062) {
    responder(false, "El correo o nombre de usuario ya está registrado. Inténtalo de nuevo.", 409);
}

responder(false, "No se pudo crear la cuenta. Revisa la configuración de la base de datos.", 500);
?>

