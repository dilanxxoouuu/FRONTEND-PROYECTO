<?php
function Conectarse(){
	$Conexion =  mysqli_connect("localhost","root","","phphone");
	return $Conexion;
}
?>