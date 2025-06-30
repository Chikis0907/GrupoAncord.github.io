<?php
include 'conexion.php';

$min = $_POST['precio1'] ?? '';
$max = $_POST['precio2'] ?? '';

if ($min === '' && $max === '') {
  echo "Por favor, llena al menos un campo.";
  exit;
}

if ($min !== '' && $max !== '') {
  $sql = "UPDATE precios SET precioMin = ?, precioMax = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("dd", $min, $max);
} elseif ($min !== '') {
  $sql = "UPDATE precios SET precioMin = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("d", $min);
} elseif ($max !== '') {
  $sql = "UPDATE precios SET precioMax = ? WHERE id = 1";
  $stmt = $conexion->prepare($sql);
  $stmt->bind_param("d", $max);
}

if ($stmt->execute()) {
  echo "Datos actualizados correctamente.";
} else {
  echo "Error al actualizar los datos.";
}

$stmt->close();
$conexion->close();
?>
