import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes"; // Ruta correcta hacia AppRoutes
import Navbar from "./components/Navbar/Navbar"; // Ruta correcta hacia Navbar
import './index.css';

const App = () => {
  useEffect(() => {
    // Cambiar el título de la página
    document.title = "PHPHONE"; // Aquí puedes poner el nombre de tu página

    // Cambiar el favicon
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = "./src/assets/images/idroide-removebg-preview.png"; // Ruta al favicon dentro de la carpeta 'public' o cualquier otro lugar
    }
  }, []); // El array vacío hace que esto se ejecute solo una vez cuando el componente se monta

  return (
    <div>
      {/* Navbar presente en toda la aplicación */}
      <Navbar />
      {/* Rutas para navegación */}
      <AppRoutes />
    </div>
  );
};

export default App;
