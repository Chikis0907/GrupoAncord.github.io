<?php
include 'conexion.php';

$sql = "SELECT precioMin, precioMax FROM precios WHERE id = 1";
$resultado = $conexion->query($sql);

if ($resultado && $resultado->num_rows > 0) {
  $fila = $resultado->fetch_assoc();
  $minimo = $fila['precioMin'];
  $maximo = $fila['precioMax'];
} else {
  $minimo = 0;
  $maximo = 0;
}

$conexion->close();
?>