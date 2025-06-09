<?php
$conexion = new mysqli("localhost", "root", "", "mi_base");
if ($conexion->connect_error) {
  die("Error de conexión: " . $conexion->connect_error);
}

$nuevoMin = $_POST['precio1'] ?? '';
$nuevoMax = $_POST['precio2'] ?? '';

if ($nuevoMin === '' && $nuevoMax === '') {
  echo "<script>alert('Por favor, llena al menos un campo.'); window.history.back();</script>";
  exit;
}

// Preparar sentencia UPDATE según los campos llenos
if ($nuevoMin !== '' && $nuevoMax !== '') {
  $sql = "UPDATE precios SET precioMin = ?, precioMax = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("dd", $nuevoMin, $nuevoMax);
} elseif ($nuevoMin !== '') {
  $sql = "UPDATE precios SET precioMin = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("d", $nuevoMin);
} elseif ($nuevoMax !== '') {
  $sql = "UPDATE precios SET precioMax = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("d", $nuevoMax);
}

if ($stmt->execute()) {
  echo "<script>alert('Datos actualizados correctamente.'); window.location.href='tratamientos_termicos.html';</script>";
} else {
  echo "<script>alert('Error al actualizar.'); window.history.back();</script>";
}

$stmt->close();
$conexion->close();
?>
