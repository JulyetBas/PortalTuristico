<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

// =========================================
// RESPUESTA JSON
// =========================================

function responder($exito, $mensaje, $datos = [], $codigo = 200) {
    http_response_code($codigo);

    echo json_encode([
        "exito" => $exito,
        "mensaje" => $mensaje,
        "datos" => $datos
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =========================================
// IDENTIFICAR LA ACCIÓN
// =========================================

$accion = $_POST["accion"] ?? $_GET["accion"] ?? "";


// =========================================
// CONSULTAR OPINIONES DE UN PLAN
// =========================================

if ($accion === "consultar") {

    $id_plan = filter_var(
        $_GET["id_plan"] ?? $_POST["id_plan"] ?? null,
        FILTER_VALIDATE_INT
    );

    if (!$id_plan || !in_array($id_plan, [1, 2])) {
        responder(false, "El plan seleccionado no es válido.", [], 400);
    }

    $sql = "SELECT
                r.id_reseña,
                r.id_usuario,
                u.nombre_predeterminado AS nombre_usuario,
                r.alojamiento,
                r.alimentacion,
                r.coordinacion,
                r.destino,
                r.transporte,
                r.general,
                r.comentario,
                r.fecha_creacion
            FROM `reseñas_planes` r
            INNER JOIN usuario_crear u
                ON r.id_usuario = u.id_usuario
            WHERE r.id_plan = ?
            ORDER BY r.fecha_creacion DESC";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_plan);
    $stmt->execute();

    $resultado = $stmt->get_result();

    $reseñas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $reseñas[] = $fila;
    }

    $stmt->close();

   responder(
    true,
    "Opiniones consultadas correctamente.",
    [
        "reseñas" => $reseñas,
        "usuario_actual" => $_SESSION["id_usuario"] ?? null
    ]
);
}


// =========================================
// PUBLICAR UNA OPINIÓN
// =========================================

if ($accion === "publicar") {

    // Verificar que el usuario haya iniciado sesión.
    if (!isset($_SESSION["id_usuario"])) {
        responder(false, "Debes iniciar sesión para publicar una opinión.", [], 401);
    }

    // Recibir los datos.
    $id_usuario = (int) $_SESSION["id_usuario"];

    $id_plan = filter_var(
        $_POST["id_plan"] ?? null,
        FILTER_VALIDATE_INT
    );

    $alojamiento = filter_var($_POST["alojamiento"] ?? null, FILTER_VALIDATE_INT);
    $alimentacion = filter_var($_POST["alimentacion"] ?? null, FILTER_VALIDATE_INT);
    $coordinacion = filter_var($_POST["coordinacion"] ?? null, FILTER_VALIDATE_INT);
    $destino = filter_var($_POST["destino"] ?? null, FILTER_VALIDATE_INT);
    $transporte = filter_var($_POST["transporte"] ?? null, FILTER_VALIDATE_INT);
    $general = filter_var($_POST["general"] ?? null, FILTER_VALIDATE_INT);

    $comentario = trim($_POST["comentario"] ?? "");

    // Validar el plan.
    if (!$id_plan || !in_array($id_plan, [1, 2])) {
        responder(false, "El plan seleccionado no es válido.", [], 400);
    }

    // Validar las seis puntuaciones.
    $puntuaciones = [
        $alojamiento,
        $alimentacion,
        $coordinacion,
        $destino,
        $transporte,
        $general
    ];

    foreach ($puntuaciones as $puntuacion) {
        if ($puntuacion === false || $puntuacion === null ||
            $puntuacion < 1 || $puntuacion > 5) {

            responder(false, "Todas las puntuaciones deben estar entre 1 y 5.", [], 400);
        }
    }

    // Validar el comentario.
    if ($comentario === "") {
        responder(false, "Escribe un comentario antes de publicar.", [], 400);
    }

    if (mb_strlen($comentario, "UTF-8") > 2000) {
        responder(false, "El comentario no puede superar los 2000 caracteres.", [], 400);
    }

    // Guardar la opinión.
    $sql = "INSERT INTO `reseñas_planes`
            (id_usuario, id_plan, alojamiento, alimentacion,
             coordinacion, destino, transporte, general, comentario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);

    $stmt->bind_param(
        "iiiiiiiis",
        $id_usuario,
        $id_plan,
        $alojamiento,
        $alimentacion,
        $coordinacion,
        $destino,
        $transporte,
        $general,
        $comentario
    );

    if ($stmt->execute()) {

        $id_reseña = $conexion->insert_id;

        $stmt->close();

        responder(
            true,
            "¡Tu opinión se publicó correctamente!",
            ["id_reseña" => $id_reseña]
        );
    }

    // Comprobar si el usuario ya opinó sobre ese plan.
    if ($stmt->errno === 1062) {
        $stmt->close();

        responder(
            false,
            "Ya has publicado una opinión sobre este plan. Puedes editar la que tienes.",
            [],
            409
        );
    }

    $stmt->close();

    responder(false, "No se pudo publicar la opinión.", [], 500);
}


// =========================================
// ACCIÓN NO RECONOCIDA
// =========================================

responder(false, "La acción solicitada no es válida.", [], 400);

?>