import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Ruta correcta hacia AppRoutes
import Navbar from "./components/Navbar/Navbar"; // Ruta correcta hacia Navbar
import './index.css';

const App = () => {
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
