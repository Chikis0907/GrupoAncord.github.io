<?php
session_start();
include 'conexion.php';

// Obtener los precios actuales
$sql = "SELECT precioMin, precioMax FROM precios WHERE id = 1";
$resultado = $conexion->query($sql);
$minimo = $maximo = 0;

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    $minimo = $fila['precioMin'];
    $maximo = $fila['precioMax'];
}

// Mostrar mensajes de éxito/error
$mensajeExito = $_SESSION['exito'] ?? '';
$mensajeError = $_SESSION['error'] ?? '';
unset($_SESSION['exito'], $_SESSION['error']);

$conexion->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Actualizar Precios</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .current-price {
      font-weight: bold;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body class="bg-light">
  <div class="container py-4">
    <div class="text-center">
      <img src="../img/groAncor.png" alt="Grupo Ancor" style="max-height: 80px; margin-top: 10px;">
    </div>

    <h2 class="text-center text-primary mb-4">Actualizar Precios</h2>

    <?php if ($mensajeExito): ?>
      <div class="alert alert-success text-center"><?= htmlspecialchars($mensajeExito) ?></div>
    <?php endif; ?>
    
    <?php if ($mensajeError): ?>
      <div class="alert alert-danger text-center"><?= htmlspecialchars($mensajeError) ?></div>
    <?php endif; ?>

    <div class="row mb-4 justify-content-center">
      <div class="col-md-5 text-center p-3">
        <h5>Precio Mínimo Actual</h5>
        <div class="current-price bg-success bg-opacity-10 text-success">
          $<?= number_format($minimo, 2) ?>
        </div>
      </div>
      <div class="col-md-5 text-center p-3">
        <h5>Precio Máximo Actual</h5>
        <div class="current-price bg-danger bg-opacity-10 text-danger">
          $<?= number_format($maximo, 2) ?>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8">
        <form method="POST" action="guardar_precios.php" class="border p-4 rounded bg-white">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="precio1" class="form-label">Nuevo precio mínimo:</label>
              <input type="number" step="0.01" min="0" class="form-control" id="precio1" name="precio1" 
                     placeholder="Ej. <?= number_format($minimo, 2) ?>">
            </div>
            <div class="col-md-6">
              <label for="precio2" class="form-label">Nuevo precio máximo:</label>
              <input type="number" step="0.01" min="0" class="form-control" id="precio2" name="precio2" 
                     placeholder="Ej. <?= number_format($maximo, 2) ?>">
            </div>
          </div>

          <div class="text-center mt-3">
            <button type="submit" class="btn btn-primary px-4">Actualizar Precios</button>
            <a href="tratamientos_termicos.html" class="btn btn-secondary ms-2">Regresar</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>