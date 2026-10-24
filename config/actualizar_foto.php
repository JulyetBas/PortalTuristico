
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

function responder($exito, $mensaje, $codigo = 200, $foto = null) {
    http_response_code($codigo);

    echo json_encode([
        "exito" => $exito,
        "mensaje" => $mensaje,
        "foto_perfil" => $foto
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Solo aceptar solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(false, "Método no permitido.", 405);
}

// Verificar la sesión.
if (!isset($_SESSION["id_usuario"])) {
    responder(false, "Debes iniciar sesión.", 401);
}

// Verificar que se haya enviado una imagen.
if (!isset($_FILES["foto_perfil"])) {
    responder(false, "Selecciona una imagen.", 400);
}

$archivo = $_FILES["foto_perfil"];

// Comprobar errores de subida.
if ($archivo["error"] !== UPLOAD_ERR_OK) {
    responder(false, "No se pudo subir la imagen.", 400);
}

// Limitar el tamaño a 2 MB.
if ($archivo["size"] > 2 * 1024 * 1024) {
    responder(false, "La imagen no puede superar los 2 MB.", 400);
}

// Comprobar el tipo real del archivo.
$infoImagen = getimagesize($archivo["tmp_name"]);

if ($infoImagen === false) {
    responder(false, "El archivo seleccionado no es una imagen válida.", 400);
}

$tiposPermitidos = [
    IMAGETYPE_JPEG => "jpg",
    IMAGETYPE_PNG  => "png",
    IMAGETYPE_WEBP => "webp"
];

$tipoImagen = $infoImagen[2];

if (!isset($tiposPermitidos[$tipoImagen])) {
    responder(false, "Usa una imagen JPG, PNG o WEBP.", 400);
}

// Generar un nombre de archivo aleatorio.
$extension = $tiposPermitidos[$tipoImagen];
$nombreArchivo = bin2hex(random_bytes(16)) . "." . $extension;

// La carpeta está fuera de config.
$carpeta = dirname(__DIR__) . "/fotos_perfil/";

if (!is_dir($carpeta)) {
    responder(false, "No se encontró la carpeta fotos_perfil.", 500);
}

$rutaCompleta = $carpeta . $nombreArchivo;

// Guardar el archivo en la carpeta.
if (!move_uploaded_file($archivo["tmp_name"], $rutaCompleta)) {
    responder(false, "No se pudo guardar la imagen.", 500);
}

// Guardar la ruta en la base de datos.
$rutaRelativa = "../fotos_perfil/" . $nombreArchivo;
$idUsuario = $_SESSION["id_usuario"];

$sql = "UPDATE usuario_crear
        SET foto_perfil = ?
        WHERE id_usuario = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("si", $rutaRelativa, $idUsuario);

if (!$stmt->execute() || $stmt->affected_rows < 0) {
    $stmt->close();
    if (is_file($rutaCompleta)) {
        unlink($rutaCompleta);
    }
    responder(false, "No se pudo actualizar la foto en la base de datos.", 500);
}

$stmt->close();

responder(true, "Foto de perfil actualizada correctamente.", 200, $rutaRelativa);
?>
