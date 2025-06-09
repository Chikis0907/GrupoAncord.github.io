<?php
include 'conexion.php';

$usuario = trim($_POST['usuario'] ?? '');
$nuevaContrasena = trim($_POST['nuevaContrasena'] ?? '');

if ($usuario === '' || $nuevaContrasena === '') {
    echo "<script>alert('Por favor, llena todos los campos.'); window.history.back();</script>";
    exit;
}

// Verificar si el usuario existe
$consulta = $conexion->prepare("SELECT * FROM usuarios WHERE usuario = ?");
$consulta->bind_param("s", $usuario);
$consulta->execute();
$resultado = $consulta->get_result();

if ($resultado->num_rows === 0) {
    echo "<script>alert('El usuario no existe.'); window.history.back();</script>";
    exit;
}

// Encriptar la nueva contraseña
$contrasenaHash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

// Actualizar la contraseña
$actualizar = $conexion->prepare("UPDATE usuarios SET contrasena = ? WHERE usuario = ?");
$actualizar->bind_param("ss", $contrasenaHash, $usuario);

if ($actualizar->execute()) {
    echo "<script>alert('Contraseña actualizada correctamente.'); window.location.href='InicioSesion.html';</script>";
} else {
    echo "<script>alert('Error al actualizar la contraseña.'); window.history.back();</script>";
}

$consulta->close();
$actualizar->close();
$conexion->close();
?>
