
<?php
function agregar_producto_al_carrito($producto_id, $cantidad)
{
    // Validar datos de entrada
    if (!is_numeric($producto_id) || !is_numeric($cantidad)) {
        return false;
    }

    // Conectar a la base de datos
    $conexion = mysqli_connect('localhost', 'root', '', 'phphone');

    // Preparar la consulta
    $query = "SELECT producto_nombre, producto_precio FROM producto WHERE producto_id = ?";
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, 'i', $producto_id);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    // Agregar producto al carrito
    if ($fila = mysqli_fetch_assoc($resultado)) {
        // Verificar si el carrito ya existe en la sesión
        if (!isset($_SESSION["carrito"])) {
            $_SESSION["carrito"] = array();
        }

        // Agregar producto al carrito
        $_SESSION["carrito"][] = array(
            "producto_id" => $producto_id,
            "producto_nombre" => $fila["producto_nombre"],
            "producto_precio" => $fila["producto_precio"],
            "cantidad" => $cantidad
        );
    }

    // Cerrar la conexión
    mysqli_close($conexion);
}
?>