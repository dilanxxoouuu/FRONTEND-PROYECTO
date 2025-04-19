import React, { useState, useEffect } from 'react';
import './Home.css';
import Footer from "../../components/Footer/Footer";
import { Parallax } from 'react-parallax';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [productosBajoPrecio, setProductosBajoPrecio] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/productos')
      .then((response) => {
        const productosFiltrados = response.data.filter(producto => producto.producto_precio <= 500000);
        setProductosBajoPrecio(productosFiltrados);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  const handleVerMas = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products');
    } else {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
    }
  };

  return (
    <div className="home-container">
      {/* Sección de bienvenida con efecto parallax */}
      <Parallax
        bgImage="src/assets/images/cumnigg.jpeg"
        strength={300}
        className="welcome-section"
      >
        <div className="welcome-text">
          <h1>Bienvenido a tu tienda de móviles y accesorios</h1>
          <p>Explora nuestros productos a bajo precio y encuentra lo que más se ajusta a tus necesidades.</p>
        </div>
      </Parallax>

      {showLoginMessage && (
        <div className="login-toast">
          ¡Debes de iniciar sesión para continuar!
        </div>
      )}


      {/* Sección de productos a bajo precio */}
      <section className="productos-bajo-precio-container">
        <div className="productos-bajo-precio-header">
          <h2>Productos a Bajo Precio</h2>
        </div>
        <div className="product-cards-container">
          {productosBajoPrecio.length > 0 ? (
            productosBajoPrecio.map((producto) => (
              <div key={producto.producto_nombre} className="product-card">
                <img
                  src={
                    producto.producto_foto.startsWith("http")
                      ? producto.producto_foto
                      : `http://localhost:5000/static/uploads/${producto.producto_foto}`
                  }
                  alt={producto.producto_nombre}
                  className="product-image"
                />
                <h3 className="product-title">{producto.producto_nombre}</h3>
                <p className="product-price">Precio: ${producto.producto_precio.toLocaleString()}</p>

                <button className="product-button" onClick={handleVerMas}>
                  Ver más
                </button>
              </div>
            ))
          ) : (
            <p>Cargando productos...</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
