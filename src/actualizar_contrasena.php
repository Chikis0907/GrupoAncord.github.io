<?php
include 'conexion.php';

// Obtener datos del formulario
$usuario = $_POST['usuario'] ?? '';
$nuevaContrasena = $_POST['nuevaContrasena'] ?? '';

// Verificar que los campos no estén vacíos
if ($usuario === '' || $nuevaContrasena === '') {
    echo "<script>alert('Por favor, completa todos los campos.'); ";
    exit;
}

// Actualizar contraseña directamente
$actualizar = $conexion->prepare("UPDATE usuarios SET contrasena = ? WHERE usuario = ?");
$actualizar->bind_param("ss", $nuevaContrasena, $usuario);

if ($actualizar->execute()) {
    echo "<script>alert('Contraseña actualizada exitosamente.');";
} else {
    echo "<script>alert('Ocurrió un error al actualizar la contraseña.');";
}

$actualizar->close();
$conexion->close();
?>
