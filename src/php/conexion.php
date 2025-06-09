<?php
$host = "localhost";     // o IP del servidor
$usuario = "root";       // tu usuario de MySQL
$contrasena = "";        // tu contraseña de MySQL
$base_datos = "gro_ancor";

$conexion = new mysqli($host, $usuario, $contrasena, $base_datos);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Opcional: Forzar UTF-8 (versión mejorada)
$conexion->set_charset("utf8mb4");
?>
