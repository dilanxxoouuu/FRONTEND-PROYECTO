<?php
require_once '../Modelo/Usuario.php';


$gestorUsuario = new Usuario();

$elegirAcciones = isset($_POST['Acciones']) ? $_POST['Acciones'] : "Cargar";

if ($elegirAcciones == 'Crear Usuario') {
    $gestorUsuario->agregarUsuario(
        $_POST['usuario_id'],
        $_POST['usuario_nombre'],
        $_POST['usuario_apellido'],
        $_POST['usuario_usuario'],
        $_POST['usuario_clave'],
        $_POST['usuario_email']

    );
} elseif ($elegirAcciones == 'Actualizar Usuario') {
    $usuario_id = $_POST['usuario_id'];
    $usuario_nombre = $_POST['usuario_nombre'];
    $usuario_apellido = $_POST['usuario_apellido'];
    $usuario_usuario = $_POST['usuario_usuario'];
    $usuario_clave = $_POST['usuario_clave'];
    $usuario_email = $_POST['usuario_email'];


    $gestorUsuario->actualizarUsuario($usuario_id, $usuario_nombre, $usuario_apellido, $usuario_usuario, $usuario_clave, $usuario_email);

} elseif ($elegirAcciones == 'Borrar Usuario') {
    $gestorUsuario->borrarUsuario($_POST['usuario_id'],null,null,null,null,null);

} elseif ($elegirAcciones == 'Buscar Usuario') {
    $resultado = $gestorUsuario->consultarUsuario($_POST['usuario_id']);
}

$resultado = $gestorUsuario->consultarUsuarios();
include "../Vista/vistaUsuario.php";
?>
