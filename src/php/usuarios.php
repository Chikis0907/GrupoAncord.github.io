<?php
include 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

if ($usuario === '' || $password === '') {
  echo "ERROR";
  exit;
}

// Validar usuario y contraseña en texto plano (como en tu base de datos actual)
$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  echo "OK"; // Login exitoso
} else {
  echo "ERROR"; // Usuario o contraseña incorrectos
}

$stmt->close();
$conexion->close();
?>
