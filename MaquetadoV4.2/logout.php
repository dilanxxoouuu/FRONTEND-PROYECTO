<?php
  // Iniciar la sesión
  session_start();

  // Cerrar la sesión
  session_destroy();

  // Redirigir a login.php
  header("Location: login.php");
  exit;
?>