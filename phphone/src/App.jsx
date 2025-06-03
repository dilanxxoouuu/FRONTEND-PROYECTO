import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './index.css';

const App = () => {
  useEffect(() => {
    // Cambiar el título de la página
    document.title = "PHPHONE";

    // Cambiar el favicon
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = "./src/assets/images/idroide-removebg-preview.png";
    }
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-content" style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;