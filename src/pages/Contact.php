<?php
header("Content-Type: application/json");

// Leer JSON
$data = json_decode(file_get_contents("php://input"), true);

// Sanitizar
$nombre = htmlspecialchars($data['nombre'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');
$telefono = htmlspecialchars($data['telefono'] ?? '');
$mensaje = htmlspecialchars($data['mensaje'] ?? '');

// Validación básica
if (!$nombre || !$email || !$mensaje) {
    echo json_encode(["ok" => false, "error" => "Datos incompletos"]);
    exit;
}

// Email destino
$to = "inscripciones@j13pro.es";
$subject = "Nuevo mensaje desde la web";

// Contenido
$message = "Has recibido un nuevo mensaje:\n\n";
$message .= "Nombre: $nombre\n";
$message .= "Email: $email\n";
$message .= "Teléfono: $telefono\n\n";
$message .= "Mensaje:\n$mensaje\n";

// Cabeceras
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Enviar
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "Error al enviar"]);
}
?>