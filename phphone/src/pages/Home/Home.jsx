import React, { useState, useEffect } from 'react';
import './Home.css';
import { Parallax } from 'react-parallax';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const [productosBajoPrecio, setProductosBajoPrecio] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationPosition, setNotificationPosition] = useState({ 
    top: 0, 
    left: 0, 
    visible: false 
  });
  const navigate = useNavigate();

  const addNotification = (message, type = 'success', event = null) => {
    const id = Date.now();
    
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      setNotificationPosition({
        top: buttonRect.top - 50,
        left: buttonRect.left + buttonRect.width / 2 - 150,
        visible: true
      });
    }

    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
      setNotificationPosition(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/productos')
      .then((response) => {
        const productosFiltrados = response.data.filter(producto => producto.producto_precio <= 500000);
        setProductosBajoPrecio(productosFiltrados);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
        addNotification('Error al cargar productos', 'error');
      });
  }, []);

  const handleVerMas = (e) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products');
    } else {
      addNotification('¡Debes iniciar sesión para continuar!', 'warning', e);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev + 4 >= productosBajoPrecio.length ? 0 : prev + 4
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev - 4 < 0 ? Math.max(0, productosBajoPrecio.length - 4) : prev - 4
    );
  };

  const visibleProducts = productosBajoPrecio.slice(currentSlide, currentSlide + 4);

  return (
    <div className="home-container">
      {/* Notificación contextual */}
      {notificationPosition.visible && (
        <div 
          className="notification contextual-notification warning"
          style={{
            position: 'fixed',
            top: `${notificationPosition.top}px`,
            left: `${notificationPosition.left}px`,
            zIndex: 9999
          }}
        >
          ¡Debes iniciar sesión para continuar!
        </div>
      )}


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

      {/* Sección de productos a bajo precio */}
      <section className="productos-bajo-precio-container">
        <div className="productos-bajo-precio-header">
          <h2>Productos a Bajo Precio</h2>
        </div>
        
        <div className="slider-container">
          <button className="slider-arrow left-arrow" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          
          <div className="product-cards-container">
            {productosBajoPrecio.length > 0 ? (
              visibleProducts.map((producto) => (
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
                  <div className="product-info">
                    <h3 className="product-title">{producto.producto_nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                    <p className="product-price">${producto.producto_precio.toLocaleString()}</p>
                    <button className="product-button" onClick={(e) => handleVerMas(e)}>
                      Ver más
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Cargando productos...</p>
            )}
          </div>
          
          <button className="slider-arrow right-arrow" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;