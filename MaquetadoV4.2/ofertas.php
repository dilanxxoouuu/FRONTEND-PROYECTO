<?php

// Conectar a la base de datos
$conexion = mysqli_connect('localhost', 'root', '', 'phphone');

// Verificar si la conexión es exitosa
if (!$conexion) {
    die("Error al conectar a la base de datos: " . mysqli_connect_error());
}

// Consultar los productos con un valor menor a 200.00
$query = "SELECT * FROM producto WHERE producto_precio < 200.00";
$resultado = mysqli_query($conexion, $query);

// Mostrar los productos en un apartado de ofertas
echo "<div class='cardib'>";
echo "<h1>Ofertas del día</h1>";
echo "</div>";
echo "<div class='categoria-producos'>";
echo "<div class='producto'>";
while ($producto = mysqli_fetch_assoc($resultado)) {
    echo "<img src='{$producto["producto_foto"]}'>";
    echo "<div class='producto'>";
    echo "<h3>{$producto["producto_nombre"]}</h3>";
    echo "<p>Precio: {$producto["producto_precio"]}</p>";
    echo "</div>";
}
echo "</div>";
echo "</div>";


// Cerrar la conexión
mysqli_close($conexion);
