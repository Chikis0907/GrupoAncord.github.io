<?php
include 'conexion.php';

// Recoger los datos del formulario (usando POST)
$tipos_maquinado = $_POST['tipos_maquinado'] ?? '';
$tipo_material = $_POST['tipo_material'] ?? '';
$precio_total_material = $_POST['precio_total_material'] ?? 0;
$tiempo_maquinado = $_POST['tiempo_maquinado'] ?? 0;
$costo_total_operacion = $_POST['costo_total_operacion'] ?? 0;
$volumen_maquinar = $_POST['volumen_maquinar'] ?? 0;
$avance = $_POST['avance'] ?? '';
$costo_herramienta = $_POST['costo_herramienta'] ?? 0;
$logistica = $_POST['logistica'] ?? 0;
$administracion = $_POST['administracion'] ?? 0;
$costos_extras = $_POST['costos_extras'] ?? '';
$costo_total_general = $_POST['costo_total_general'] ?? 0;

// Insertar en la base de datos
$sql = "INSERT INTO resumen_costos 
(tipos_maquinado, tipo_material, precio_total_material, tiempo_maquinado, costo_total_operacion, volumen_maquinar, avance, costo_herramienta, logistica, administracion, costos_extras, costo_total_general)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param(
    "ssddd dsd dsd", 
    $tipos_maquinado, 
    $tipo_material, 
    $precio_total_material, 
    $tiempo_maquinado, 
    $costo_total_operacion, 
    $volumen_maquinar, 
    $avance, 
    $costo_herramienta, 
    $logistica, 
    $administracion, 
    $costos_extras, 
    $costo_total_general
);

$stmt->close();
$conexion->close();
?>