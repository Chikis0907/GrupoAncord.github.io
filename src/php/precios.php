<?php
include 'conexion.php';

// Obtener la única fila de precios
$resultado = $conexion->query("SELECT precioMax, precioMin FROM precios WHERE id = 1");
$datos = $resultado->fetch_assoc();

$precioMax = $datos['precioMax'];
$precioMin = $datos['precioMin'];

$conexion->close();
?>