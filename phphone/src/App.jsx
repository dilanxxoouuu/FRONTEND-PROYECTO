import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './index.css';

const App = () => {
  useEffect(() => {
    document.title = "PHPHONE";

    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = "./src/assets/images/idroide-removebg-preview.png";
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
