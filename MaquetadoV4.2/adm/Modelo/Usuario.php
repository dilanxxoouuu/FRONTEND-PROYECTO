<?php
include 'Conexion.php';
class usuario
{
    private $usuario_id;
    private $usuario_nombre;
    private $usuario_apellido;
    private $usuario_usuario;
    private $usuario_clave;
    private $usuario_email;
    private $Conexion;

    public function __construct($usuario_id = null, $usuario_nombre = null, $usuario_apellido = null, $usuario_usuario = null, $usuario_clave = null, $usuario_email = null)
    {
        $this->usuario_id = $usuario_id;
        $this->usuario_nombre = $usuario_nombre;
        $this->usuario_apellido = $usuario_apellido;
        $this->usuario_usuario = $usuario_usuario;
        $this->usuario_clave = $usuario_clave;
        $this->usuario_email = $usuario_email;
        $this->Conexion = Conectarse();
    }
    public function agregarUsuario($usuario_id = null, $usuario_nombre = null, $usuario_apellido = null,  $usuario_usuario = null, $usuario_clave = null, $usuario_email = null)
    {        
        $this->Conexion = Conectarse();
    
        $sql = "INSERT INTO usuario(usuario_id, usuario_nombre, usuario_apellido, usuario_usuario, usuario_clave, usuario_email)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("ssssss", $usuario_id, $usuario_nombre, $usuario_apellido,  $usuario_usuario, $usuario_clave, $usuario_email);
        $stmt->execute();
        $stmt->close();
        $this->Conexion->close();
    }
    public function consultarUsuario($usuario_id)
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from usuario where usuario_id ='$usuario_id'";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;	
 	}
    public function consultarUsuarios()
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from usuario";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;	
 	}
     public function borrarUsuario($usuario_id, $usuario_nombre, $usuario_apellido, $usuario_usuario, $usuario_clave, $usuario_email)
     {
         $this->Conexion = Conectarse();
     
         $sql = "UPDATE usuario SET usuario_usuario = 'Inactivo' WHERE usuario_id=?";
             
         $stmt = $this->Conexion->prepare($sql);
         $stmt->bind_param("s", $usuario_id);
     
         $resultado = $stmt->execute();
     
         $stmt->close();
         $this->Conexion->close();
     
         return $resultado;
     }
    public function actualizarUsuario($usuario_id, $usuario_nombre, $usuario_apellido, $usuario_usuario, $usuario_clave, $usuario_email)
    {
        $this->Conexion = Conectarse();
     
        $sql = "UPDATE usuario SET usuario_nombre=?, usuario_apellido=?, usuario_usuario=?, usuario_clave=?, usuario_email=? WHERE usuario_id=?";
         
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("ssssss", $usuario_nombre, $usuario_apellido, $usuario_usuario, $usuario_clave, $usuario_email, $usuario_id);

        $resultado = $stmt->execute();

        $stmt->close();
        $this->Conexion->close();
     
        return $resultado;
    }  
}