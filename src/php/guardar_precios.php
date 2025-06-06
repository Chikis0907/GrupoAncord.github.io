<?php
include 'conexion.php';

$nuevoMin = $_POST['nuevoMin'] ?? 0;
$nuevoMax = $_POST['nuevoMax'] ?? 0;

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

$stmt->execute();
$stmt->close();
$conexion->close();

echo "<script>alert('Datos actualizados correctamente.'); window.location.href='tratamientos_termicos.html';</script>";
?>
