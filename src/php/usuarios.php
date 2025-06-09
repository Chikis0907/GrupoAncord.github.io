<?php
include 'conexion.php';

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

if ($usuario === '' || $password === '') {
  echo "ERROR";
  exit;
}

$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$result = $stmt->get_result();

echo ($result->num_rows === 1) ? "OK" : "ERROR";

$stmt->close();
$conexion->close();
?>
