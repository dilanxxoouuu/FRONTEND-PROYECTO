
<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8">
	<title>PHPhone.com</title>
	<link rel="icon" href="../../img/idroide-removebg-preview.png" type="png">
	<link rel="stylesheet" href="../../css/estilos.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

	<div class="centrado" id="onload">
		<div class="container">
			<div class="loader"></div>
			<div class="loader"></div>
			<div class="loader"></div>
		</div>
	</div>
</head>

<body>
<nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary">
		<div class="container-fluid">
			<a class="navbar-brand" href="../../index.html">
				<img src="../../img/idroide-removebg-preview.png" alt="" width="30" height="24">
			</a>
		    <a class="navbar-brand" href="#">PHPHONE</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  	</button>
		  <div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
			  <li class="nav-item">
				<a class="nav-link active" aria-current="page" href="../../index.html"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
					<path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
				  </svg>Inicio</a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href="../../catalogo.php"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-handbag" viewBox="0 0 16 16">
					<path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
				  </svg>Catalogo</a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href="../../contactenos.html"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
					<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
				  </svg>contactenos</a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-wide" viewBox="0 0 16 16">
					<path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
				  </svg>Administracion</a>
			  </li>
			  <li class="nav-item"></li>
				<a class="nav-link" href="../../carrito.php"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
					<path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
				  </svg>Carrito</a>
			  </li>
			  <li class="nav-item"></li>
				<a class="nav-link" href="../../Logs/vista/vistaactualizar.php"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
					<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
				  </svg>Usuario</a>
			  </li>
			 
			</ul>
		  </div>
		</div>
	  </nav>
<div class="msj">
<div class="cardib2">
<h1 class="mb-3">Usuarios</h1>
<a class="btn btn-dark" href="../index.php">Volver menú principal</a>
<form action="../Controlador/controladorUsuario.php" method="post">
    <button class="btn btn-dark btn-lg" type="submit" name="Acciones" value="Refrescar tabla">Refrescar tabla</button>
</form>
</div>
    <div class="container text-center">
        <br>
        <h3>Lista de Usuarios</h3>
        
        <div class="table-responsive mt-3">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Id Usuarios</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Usuario</th>
                        <th>Clave</th>
                        <th>Email</th>
                        <th>Actualizar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    while ($fila = mysqli_fetch_assoc($resultado)) {

                        //Solicita todos los datos en caso de cometer error al registrarlo, poder modificarlo.
                        //Permite cambiar el estado en caso de querer  volver activar Usuario.

                        echo "<tr>";
                        echo "<td>" . $fila['usuario_id'] . "</td>";
                        echo "<td>" . $fila['usuario_nombre'] . "</td>";
                        echo "<td>" . $fila['usuario_apellido'] . "</td>";
                        echo "<td>" . $fila['usuario_usuario'] . "</td>";
                        echo "<td>" . $fila['usuario_clave'] . "</td>";
                        echo "<td>" . $fila['usuario_email'] . "</td>";
                        echo '<td>
                                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal' . $fila['usuario_id'] . '">Editar</button>
                              </td>';
                        echo '<td>
                                <form action="../Controlador/controladorUsuario.php" method="post">
                                    <input type="hidden" name="usuario_id" value="borrarUsuario' . $fila['usuario_id'] . '">
                                    <button class="btn btn-danger" type="submit" name="Acciones" value="borrarUsuario">Eliminar</button>
                                </form>
                              </td>';
                        echo "</tr>";
                        echo '<div class="modal fade" id="updateModal' . $fila['usuario_id'] . '" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">';
                        echo '<div class="modal-dialog">';
                        echo '<div class="modal-content">';
                        echo '<div class="modal-header">';
                        echo '<h5 class="modal-title" id="updateModalLabel">Actualizar Usuario - ID: ' . $fila['usuario_id'] . '</h5>';
                        echo '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                        echo '</div>';
                        echo '<div class="modal-body">';
                        echo '<form action="../Controlador/controladorUsuario.php" method="post">';
                        echo '<input type="hidden" name="usuario_id" value="' . $fila['usuario_id'] . '">';
                        echo '<div class="mb-3">
                                <label class="form-label">Nombres</label>
                                <input class="form-control" name="usuario_nombre" type="text" value="' . $fila['usuario_nombre'] . '">
                              </div>';
                        echo '<div class="mb-3">
                                <label class="form-label">Apellidos</label>
                                <input class="form-control" name="usuario_apellido" type="text" value="' . $fila['usuario_apellido'] . '">
                              </div>';
                        echo '<div class="mb-3">
                               <label class="form-label">Usuario</label>
                               <input class="form-control" name="usuario_usuario" type="text" value="' . $fila['usuario_usuario'] . '">
                             </div>';
                        echo '<div class="mb-3">
                             <label class="form-label">clave</label>
                             <input class="form-control" name="usuario_clave" type="password" value="' . $fila['usuario_clave'] . '">
                           </div>';
                        echo '<div class="mb-3">
                               <label class="form-label">Email</label>
                               <input class="form-control" name="usuario_email" type="text" value="' . $fila['usuario_email'] . '">
                             </div>';
                        echo '<button class="btn btn-dark btn-lg" type="submit" name="Acciones" value="Actualizar Usuario">Actualizar Usuario</button>';
                        echo '</form>';
                        echo '</div>';
                        echo '</div>';
                        echo '</div>';
                        echo '</div>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <br>
        <br>
        <div>
            <h3>Agregar</h3>
            <br>
        
            <form action="../Controlador/controladorUsuario.php" method="post">
                <div class="mb-3">
                    <label for="usuario_id" class="form-label">Id Usuario</label>
                    <input class="form-control" id="usuario_id" name="usuario_id" type="text" required>
                </div>
                <div class="mb-3">
                    <label for="usuario_nombre" class="form-label">Nombres</label>
                    <input class="form-control" id="usuario_nombre" name="usuario_nombre" type="text" required>
                </div>
                <div class="mb-3">
                    <label for="usuario_apellido" class="form-label">Apellidos</label>
                    <input class="form-control" id="usuario_apellido" name="usuario_apellido" type="text" required>
                </div>
                <div class="mb-3">
                    <label for="usuario_usuario" class="form-label">Usuario</label>
                    <input class="form-control" id="usuario_usuario" name="usuario_usuario" type="text" required>
                </div>
                <div class="mb-3">
                    <label for="usuario_clave" class="form-label">Clave</label>
                    <input class="form-control" id="usuario_clave" name="usuario_clave" type="text" required>
                </div>
                <div class="mb-3">
                    <label for="usuario_email" class="form-label">Email</label>
                    <input class="form-control" id="usuario_email" name="usuario_email" type="text" required>
                </div>
                <button class="btn btn-dark btn-lg" type="submit" name="Acciones" value="Crear Usuario">Crear Usuario</button>
            </form>
        </div>
    </div>
    <br><br>
</body>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>

<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<script src="../../js/codigo.js"></script>
</html>
