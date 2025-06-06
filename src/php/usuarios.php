<?php
include 'conexion.php';

$usuario = $_POST['usuario1'];
$password = $_POST['password'];

// Preparar y ejecutar la consulta
$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$resultado = $stmt->get_result();

// Verificar si hay coincidencia
if ($resultado->num_rows === 1) {
    echo "OK";
} else {
    echo "ERROR";
}

// Cerrar conexiones
$stmt->close();
$conexion->close();

?>