<?php
include 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

if ($usuario === '' || $password === '') {
  echo "ERROR";
  exit;
}

// Verifica si existe un usuario con esa contraseña (en texto plano)
$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$result = $stmt->get_result();

// Devuelve resultado para JavaScript
echo ($result->num_rows === 1) ? "OK" : "ERROR";

$stmt->close();
$conexion->close();
?>
