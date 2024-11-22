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



        <!-- pagar.php -->

        <?php
          // Iniciar la sesión
  session_start();

  // Verificar si se ha iniciado la sesión
  if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit;
  }
        // Verificar si el carrito está vacío
        if (!isset($_SESSION["carrito"]) || count($_SESSION["carrito"]) == 0) {
            header("Location: carrito.php");
            exit;
        }

        // Obtener el total del carrito
        $total = $_POST["total"];

        // Conectar a la base de datos
        $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

        // Verificar si la conexión es exitosa
        if (!$conexion) {
            die("Error al conectar a la base de datos: " . mysqli_connect_error());
        }

        // Crear una factura
        $fecha = date("Y-m-d");
        $cliente_id = $_SESSION["cliente_id"];

        // Insertar la factura en la base de datos
        $query = "INSERT INTO facturas (fecha, total, cliente_id) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "sdi", $fecha, $total, $cliente_id);
        mysqli_stmt_execute($stmt);

        // Obtener el ID de la factura
        $factura_id = mysqli_insert_id($conexion);

        // Insertar los productos en la factura
        foreach ($_SESSION["carrito"] as $producto) {
            $query = "INSERT INTO factura_productos (factura_id, producto_id, cantidad) VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($conexion, $query);
            mysqli_stmt_bind_param($stmt, "iii", $factura_id, $producto["producto_id"], $producto["cantidad"]);
            mysqli_stmt_execute($stmt);
        }

        // Cerrar la conexión
        mysqli_close($conexion);

        // Mostrar un mensaje de confirmación
        echo "Pago realizado con éxito. Su factura ha sido generada.";
