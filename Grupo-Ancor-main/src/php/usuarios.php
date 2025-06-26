<?php
include 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

// Contraseña fija que debe usarse para iniciar sesión
$clave_fija = '123321';

// Validación básica
if ($usuario === '' || $password === '') {
  echo "ERROR";
  exit;
}

// Verifica si el usuario existe (no la contraseña)
$sql = "SELECT * FROM usuarios WHERE usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1 && $password === $clave_fija) {
  echo "OK";
} else {
  echo "ERROR";
}

$stmt->close();
$conexion->close();
?>
