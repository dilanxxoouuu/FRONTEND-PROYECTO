<?php
require_once '../Modelo/Producto.php';


$gestorProducto = new Producto();

$elegirAcciones = isset($_POST['Acciones']) ? $_POST['Acciones'] : "Cargar";

if ($elegirAcciones == 'Crear Producto') {
    $gestorProducto->agregarProducto(
        $_POST['producto_id'],
        $_POST['producto_codigo'],
        $_POST['producto_nombre'],
        $_POST['producto_precio'],
        $_POST['producto_foto'],
        $_POST['categoria_id'],
        $_POST['usuario_id']
    );
} elseif ($elegirAcciones == 'Actualizar Producto') {
    $producto_id = $_POST['producto_id'];
    $producto_codigo = $_POST['producto_codigo'];
    $producto_nombre = $_POST['producto_nombre'];
    $producto_precio = $_POST['producto_precio'];
    $producto_foto = $_POST['producto_foto'];
    $categoria_id = $_POST['categoria_id'];
    $usuario_id = $_POST['usuario_id'];

    $gestorProducto->actualizarProducto($producto_id, $producto_codigo, $producto_nombre, $producto_precio, $producto_foto, $categoria_id, $usuario_id);

} elseif ($elegirAcciones == 'Borrar Producto') {
    $gestorProducto->borrarProducto($_POST['producto_id'], null, null, null, null, null, null);
    
} elseif ($elegirAcciones == 'Buscar Producto') {
    $resultado = $gestorProducto->consultarProducto($_POST['producto_id']);
}

$resultado = $gestorProducto->consultarProductos();
include "../Vista/vistaProducto.php";
