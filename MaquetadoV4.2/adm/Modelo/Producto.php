<?php
include 'Conexion.php';
class Producto
{
    private $producto_id;
    private $producto_codigo;
    private $producto_nombre;
    private $producto_precio;
    private $producto_stock;
    private $producto_foto;
    private $categoria_id;
    private $usuario_id;
    private $Conexion;

    public function __construct($producto_id = null, $producto_codigo = null, $producto_nombre = null, $producto_precio = null, $producto_stock = null, $producto_foto = null, $categoria_id = null, $usuario_id = null)
    {
        $this->producto_id = $producto_id;
        $this->producto_codigo = $producto_codigo;
        $this->producto_nombre = $producto_nombre;
        $this->producto_precio = $producto_precio;
        $this->producto_stock = $producto_stock;
        $this->producto_foto = $producto_foto;
        $this->categoria_id = $categoria_id;
        $this->usuario_id = $usuario_id;
        $this->Conexion = Conectarse();
    }
    public function agregarProducto($producto_id = null, $producto_codigo = null, $producto_nombre = null, $producto_precio = null, $producto_stock = null, $producto_foto = null, $categoria_id = null, $usuario_id = null)
    {        
        $this->Conexion = Conectarse();
    
        $sql = "INSERT INTO producto(producto_id, producto_codigo, producto_nombre, producto_precio, producto_stock, producto_foto, categoria_id, usuario_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("isssssii", $producto_id, $producto_codigo, $producto_nombre, $producto_precio, $producto_stock, $producto_foto, $categoria_id, $usuario_id);
        $stmt->execute();
        $stmt->close();
        $this->Conexion->close();
    }
    public function consultarProducto($producto_id)
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from producto where producto_id ='$producto_id'";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;	
 	}
    public function consultarProductos()
 	{
        $this->Conexion = Conectarse();

 		$sql="select * from producto";
 		$resultado=$this->Conexion->query($sql);
 		$this->Conexion->close();
 		return $resultado;	
 	}
     public function borrarProducto($producto_id, $producto_codigo, $producto_nombre, $producto_precio, $producto_stock, $producto_foto, $categoria_id)
     {
         $this->Conexion = Conectarse();
     
         $sql = "UPDATE producto SET categoria_id = 'Cancelada' WHERE producto_id=?";
             
         $stmt = $this->Conexion->prepare($sql);
         $stmt->bind_param("i", $producto_id);
     
         $resultado = $stmt->execute();
     
         $stmt->close();
         $this->Conexion->close();
     
         return $resultado;
     }
    public function actualizarProducto($producto_id, $producto_codigo, $producto_nombre, $producto_precio, $producto_stock, $producto_foto, $categoria_id)
    {
        $this->Conexion = Conectarse();
     
        $sql = "UPDATE Producto SET producto_codigo=?, producto_nombre=?, producto_precio=?, producto_stock=?, producto_foto=?, categoria_id=?, usuario_id=? WHERE producto_id=?";
         
        $stmt = $this->Conexion->prepare($sql);
        $stmt->bind_param("sssssiii", $producto_codigo, $producto_nombre, $producto_precio, $producto_stock, $producto_foto, $categoria_id, $usuario_id, $producto_id);

        $resultado = $stmt->execute();

        $stmt->close();
        $this->Conexion->close();
     
        return $resultado;
    }  
}