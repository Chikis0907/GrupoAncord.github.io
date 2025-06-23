<?php
$host = "sql301.infinityfree.com";
$db = "if0_39300121_ancord";
$user = "if0_39300121";
$pass = "YiWXamIVaF"; // pon tu contraseña si tienes una

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

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
