<?php
$host = "localhost";
$db = "usuarios";
$user = "root";
$pass = ""; // pon tu contraseña si tienes una

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$usuario = $_GET['usuario'];

$sql = "SELECT contrasena FROM credenciales WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->bind_result($contrasena);

if ($stmt->fetch()) {
    echo $contrasena;
} else {
    echo "Usuario no encontrado";
}

$stmt->close();
$conn->close();
?>
