<?php
// Parámetros de conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "123456789"; // Cambia a tu contraseña real si tienes
$dbname = "tratamientos_termicos"; // El nombre correcto de tu BD

// Recibe el string base64 enviado por el formulario
if (isset($_POST["imagenBase64"])) {
    $foto = $_POST["imagenBase64"];

    // Extrae solo los datos base64 (remueve encabezado data:image/png;base64,)
    $foto = str_replace('data:image/png;base64,', '', $foto);
    $foto = str_replace(' ', '+', $foto);

    // Decodifica el string base64 a datos binarios (opcional, por si la quieres guardar como archivo)
    // $datos_imagen = base64_decode($foto);
    // file_put_contents("../fotos/" . uniqid() . ".png", $datos_imagen);

    // Conecta con la base de datos
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Prepara el query para insertar la imagen en la BD
    $stmt = $conn->prepare("INSERT INTO fotos (imagen_base64) VALUES (?)");
    $stmt->bind_param("s", $foto); // Guarda el string base64 directamente

    if ($stmt->execute()) {
        echo "OK";
    } else {
        echo "Error al guardar la foto: " . $stmt->error;
    }
    $stmt->close();
    $conn->close();
} else {
    echo "No se recibió la imagen.";
}
?>
