<?php
// Iniciar sesión para poder usar variables de sesión si es necesario
session_start();

// Incluir archivo de conexión
require 'conexion.php';

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: cambiar_contrasena.html');
    exit;
}

// Obtener y sanitizar datos del formulario
$usuario = trim($_POST['usuario'] ?? '');
$nuevaContrasena = trim($_POST['nuevaContrasena'] ?? '');

// Validar campos vacíos
if (empty($usuario) || empty($nuevaContrasena)) {
    $_SESSION['error'] = 'Por favor, complete todos los campos';
    header('Location: cambiar_contrasena.html');
    exit;
}

// Validar longitud de contraseña
if (strlen($nuevaContrasena) < 8) {
    $_SESSION['error'] = 'La contraseña debe tener al menos 8 caracteres';
    header('Location: cambiar_contrasena.html');
    exit;
}

try {
    // Verificar si el usuario existe
    $consulta = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $consulta->bind_param("s", $usuario);
    $consulta->execute();
    $resultado = $consulta->get_result();

    if ($resultado->num_rows === 0) {
        $_SESSION['error'] = 'El usuario no existe';
        header('Location: cambiar_contrasena.html');
        exit;
    }

    // Encriptar la nueva contraseña
    $contrasenaHash = password_hash($nuevaContrasena, PASSWORD_BCRYPT);

    // Actualizar la contraseña
    $actualizar = $conexion->prepare("UPDATE usuarios SET contrasena = ? WHERE usuario = ?");
    $actualizar->bind_param("ss", $contrasenaHash, $usuario);

    if ($actualizar->execute()) {
        $_SESSION['exito'] = 'Contraseña actualizada correctamente';
        header('Location: InicioSesion.html');
    } else {
        throw new Exception('Error al actualizar la contraseña');
    }
} catch (Exception $e) {
    $_SESSION['error'] = 'Ocurrió un error: ' . $e->getMessage();
    header('Location: cambiar_contrasena.html');
} finally {
    // Cerrar conexiones
    if (isset($consulta)) $consulta->close();
    if (isset($actualizar)) $actualizar->close();
    $conexion->close();
}
?>