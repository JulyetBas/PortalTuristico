
<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

if (isset($_SESSION["id_usuario"])) {

    $idUsuario = $_SESSION["id_usuario"];

    $sql = "SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                nombre_predeterminado,
                foto_perfil,
                fecha_registro
            FROM usuario_crear
            WHERE id_usuario = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    $stmt->close();

    if ($usuario) {
        $nombre = trim($usuario["nombre"] ?? "");
        $apellido = trim($usuario["apellido"] ?? "");

        $nombreVisible = trim($nombre . " " . $apellido);

        if ($nombreVisible === "") {
            $nombreVisible = $usuario["nombre_predeterminado"];
        }

        echo json_encode([
            "exito" => true,
            "id_usuario" => $usuario["id_usuario"],
            "usuario" => $nombreVisible,
            "nombre" => $nombre,
            "apellido" => $apellido,
            "nombre_predeterminado" => $usuario["nombre_predeterminado"],
            "correo" => $usuario["correo"],
            "foto_perfil" => $usuario["foto_perfil"],
            "fecha_registro" => $usuario["fecha_registro"]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "exito" => false,
            "mensaje" => "No se encontró el usuario."
        ], JSON_UNESCAPED_UNICODE);
    }

} else {
    echo json_encode([
        "exito" => false
    ], JSON_UNESCAPED_UNICODE);
}
?>
