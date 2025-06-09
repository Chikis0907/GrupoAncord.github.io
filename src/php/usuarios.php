<?php
include 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

if ($usuario === '' || $password === '') {
  echo "ERROR";
  exit;
}

// Verificar si el usuario existe y la contraseña coincide
$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  echo "OK"; // login válido
} else {
  echo "ERROR"; // usuario o contraseña inválidos
}

$stmt->close();
$conexion->close();
?>
