<?php
require_once '../Modelo/Categoria.php';


$gestorCategoria = new Categoria();

$elegirAcciones = isset($_POST['Acciones']) ? $_POST['Acciones'] : "Cargar";

if ($elegirAcciones == 'Crear Categoria') {
    $gestorCategoria->agregarCategoria(
        $_POST['categoria_id'],
        $_POST['categoria_nombre'],
        $_POST['categoria_ubicacion']
    );
} elseif ($elegirAcciones == 'Actualizar Categoria') {
    $categoria_id = $_POST['categoria_id'];
    $ConNombre = $_POST['ConNombre'];
    $categoria_ubicacion=$_POST['categoria_ubicacion'];

    $gestorCategoria->actualizarCategoria($categoria_id, $ConNombre, $categoria_ubicacion);

} elseif ($elegirAcciones == 'Borrar Categoria') {
    $gestorCategoria->borrarCategoria($_POST['categoria_id'], null, null, null);
    
} elseif ($elegirAcciones == 'Buscar Categoria') {
    $resultado = $gestorCategoria->consultarCategoria($_POST['categoria_id']);
}

$resultado = $gestorCategoria->consultarCategoria();
include "../Vista/vistaCategoria.php";
