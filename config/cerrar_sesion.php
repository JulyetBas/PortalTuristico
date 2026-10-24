
<?php
session_start();

// Eliminar los datos de la sesión actual
$_SESSION = [];

// Destruir la sesión
session_destroy();

// Responder indicando que el cierre fue exitoso
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'exito' => true,
    'mensaje' => 'Sesión cerrada correctamente.'
]);
