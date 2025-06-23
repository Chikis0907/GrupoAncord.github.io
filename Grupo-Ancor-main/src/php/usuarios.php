<?php
$host = "localhost"; // o IP del servidor
$usuario = "root";   // tu usuario de MySQL
$contrasena = "";    // tu contraseña de MySQL
$base_datos = "gro_ancor";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$usuario = $_POST['usuario'] ?? '';
$password = $_POST['password'] ?? '';

// Contraseña fija para todos
$clave_fija = '123321';

if ($usuario === '' || $password === '') {
    echo "ERROR";
    exit;
}

// Verificar si el usuario existe en la base de datos
$sql = "SELECT * FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1 && $password === $clave_fija) {
    echo "OK";
} else {
    echo "ERROR";
}

$stmt->close();
$conn->close();
?>
