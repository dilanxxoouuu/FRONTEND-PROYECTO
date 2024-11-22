<?php
include 'Conexion.php';
class Categoria
{
    private $categoria_id;
    private $categoria_nombre;
    private $categoria_ubicaion;
    private $Conexion; 

    public function __construct($categoria_id = null, $categoria_nombre = null, $categoria_ubicaion = null)
    {
        $this->categoria_id = $categoria_id;
        $this->categoria_nombre = $categoria_nombre;
        $this->categoria_ubicaion = $categoria_ubicaion;
        $this->Conexion = Conectarse();
    }
    public function agregarCategoria($categoria_id = null, $categoria_nombre = null, $categoria_ubicaion = null)
    {        
        $this->Conexion = Conectarse();
    
        $sql = "INSERT INTO categoria(categoria_id, categoria_nombre, categoria_ubicaion)
                VALUES (?, ?, ?)";
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("iss", $categoria_id, $categoria_nombre, $categoria_ubicaion);
        $stmt->execute();
        $stmt->close();
        $this->Conexion->close();
    }
    public function consultarCategorias($categoria_id)
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from categoria where categoria_id ='$categoria_id'";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;	
 	}

    public function consultarCategoria()
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from categoria";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;
 	}
    public function borrarCategoria($categoria_id, $categoria_nombres, $categoria_ubicaion)
     {
         $this->Conexion = Conectarse();
     
         $sql = "UPDATE categoria WHERE categoria_id=?";
             
         $stmt = $this->Conexion->prepare($sql);
         $stmt->bind_param("i", $categoria_id);
     
         $resultado = $stmt->execute();
     
         $stmt->close();
         $this->Conexion->close();
     
         return $resultado;
     }
    public function actualizarCategoria($categoria_id, $categoria_nombre, $categoria_ubicaion)
    {
        $this->Conexion = Conectarse();
     
        $sql = "UPDATE categoria SET categoria_nombre=?, categoria_ubicaion=? WHERE categoria_id=?";
         
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("ssi", $categoria_nombre, $categoria_ubicaion, $categoria_id);

        $resultado = $stmt->execute();

        $stmt->close();
        $this->Conexion->close();
     
        return $resultado;
    }  
}