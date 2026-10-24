
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

// Comprobar que la solicitud sea POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Recibir los datos del formulario.
$correo = trim($_POST["correo"] ?? "");
$clave = $_POST["contrasena"] ?? "";

if ($correo === "" || $clave === "") {
    responder(false, "Ingresa tu correo y contraseña.", 400);
}

// Buscar la cuenta por correo.
$sql = "SELECT id_usuario, correo, nombre_predeterminado, `contraseña`
        FROM usuario_crear
        WHERE correo = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();

$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();

$stmt->close();

// Verificar que exista la cuenta y que la contraseña coincida.
if (!$usuario || !password_verify($clave, $usuario["contraseña"])) {
    responder(false, "Correo o contraseña incorrectos.", 401);
}

// Guardar los datos necesarios en la sesión.
session_regenerate_id(true);

$_SESSION["id_usuario"] = $usuario["id_usuario"];
$_SESSION["correo"] = $usuario["correo"];
$_SESSION["nombre_usuario"] = $usuario["nombre_predeterminado"];

responder(
    true,
    "¡Bienvenido a Wayra Kawsay, " .
    $usuario["nombre_predeterminado"] . "!"
);
?>
