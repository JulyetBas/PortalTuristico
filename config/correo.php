
<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/../vendor/autoload.php";

// Configuración del correo de Wayra Kawsay
function crearCorreo() {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = "smtp.gmail.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = "wayraKawsayy@gmail.com";
    $mail->Password   = "ikbt hkhe qmlk zuvj";
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->CharSet = "UTF-8";
    $mail->setFrom($mail->Username, "Wayra Kawsay");

    return $mail;
}
