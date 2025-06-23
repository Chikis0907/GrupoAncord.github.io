<?php
require_once 'db/conexion.php';

$sql = "SELECT usuario, contrasena FROM usuarios";
$resultado = $conn->query($sql);

$usuarios = [];

if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $usuarios[] = $fila;
    }
}

$conn->close();

// Pasamos los datos a la vista
include 'views/usuarios.html';
?>
