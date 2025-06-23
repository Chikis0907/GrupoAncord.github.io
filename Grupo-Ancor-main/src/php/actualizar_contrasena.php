<?php
$host = "localhost";
$db = "usuarios";
$user = "root";
$pass = ""; // pon tu contraseña si tienes una

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$usuario = $_POST['usuario'] ?? '';
$nuevaContrasena = $_POST['nuevaContrasena'] ?? '';

if ($usuario === '' || $nuevaContrasena === '') {
  echo "<script>alert('Por favor, completa todos los campos.'); window.history.back();</script>";
  exit;
}

// Verifica si el usuario existe
$sql = "SELECT * FROM usuarios WHERE usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo "<script>alert('El usuario no existe.'); window.history.back();</script>";
  exit;
}

// Actualiza la contraseña
$update = $conexion->prepare("UPDATE usuarios SET contrasena = ? WHERE usuario = ?");
$update->bind_param("ss", $nuevaContrasena, $usuario);

if ($update->execute()) {
  echo "<script>alert('Contraseña actualizada correctamente.'); window.location.href='InicioSesion.html';</script>";
} else {
  echo "<script>alert('Error al actualizar la contraseña.'); window.history.back();</script>";
}

$stmt->close();
$update->close();
$conexion->close();
?>
