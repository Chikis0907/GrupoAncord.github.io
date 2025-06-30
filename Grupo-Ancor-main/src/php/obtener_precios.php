<?php
include 'conexion.php';

$sql = "SELECT precioMin, precioMax FROM precios WHERE id = 1";
$result = $conexion->query($sql);

if ($fila = $result->fetch_assoc()) {
    echo json_encode([
        "precioMin" => $fila['precioMin'],
        "precioMax" => $fila['precioMax']
    ]);
} else {
    echo json_encode([
        "precioMin" => 0,
        "precioMax" => 0
    ]);
}

$conexion->close();
?>
