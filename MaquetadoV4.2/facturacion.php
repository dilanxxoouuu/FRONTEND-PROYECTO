<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>PHPhone.com</title>
    <link rel="icon" href="img/idroide-removebg-preview.png" type="png">
    <link rel="stylesheet" href="css/estilos.css">

</head>

<body class="hidden">

    <div class="centrado" id="onload">
        <div class="container">
            <div class="loader"></div>
            <div class="loader"></div>
            <div class="loader"></div>
        </div>
    </div>

    <header class="header">
        <div class="container">
            <div class="btn-menu">
            </div>
            <div class="logo">
                <h1>PHPHONE</h1>
            </div>
            <nav class="menu">
                <a href="inicio.html">Inicio</a>
                <a href="catalogo.php">Catalogo</a>
                <a href="contactenos.html">Contactanos</a>
                <a href="carrito.php">Carrito</a>
            </nav>
        </div>
    </header>
    <div class="capa"></div>
    <!--	--------------->

    <div class="zona_registro">
        <div class="cardib">
            <div class="titles-content">
                <h3>Bienvenido al carrito de compras de PHPhone.</h3>
            </div>
        </div>
    </div>
    <div class="capa"></div>
    <div class="zona_registro">



        <!-- facturacion.php -->

        <?php
          // Iniciar la sesión
  session_start();

  // Verificar si se ha iniciado la sesión
  if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit;
  }

        // Conectar a la base de datos
        $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

        // Verificar si la conexión es exitosa
        if (!$conexion) {
            die("Error al conectar a la base de datos: " . mysqli_connect_error());
        }

        // Obtener la información de la factura
        $factura_id = $_GET["factura_id"];
        $query = "SELECT * FROM facturas WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $factura_id);
        mysqli_stmt_execute($stmt);
        $resultado = mysqli_stmt_get_result($stmt);

        // Mostrar la información de la factura
        if ($fila = mysqli_fetch_assoc($resultado)) {
            echo "Factura #{$fila["id"]}";
            echo "Fecha: {$fila["fecha"]}";
            echo "Total: {$fila["total"]}";
            echo "Cliente: {$fila["cliente_id"]}";
        }

        // Cerrar la conexión
        mysqli_close($conexion);
