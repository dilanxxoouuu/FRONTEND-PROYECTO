import React from 'react';
import './Home.css'; // Estilos para la página de bienvenida
import Footer from "../../components/Footer/Footer";
import { Parallax } from 'react-parallax'; // Importamos la librería react-parallax

// Lista de productos en oferta
const productosOferta = [
    { id: 1, nombre: 'iPhone 14', precio: 799, imagen: 'https://link-a-imagen-del-producto1.jpg' },
    { id: 2, nombre: 'Samsung Galaxy S23', precio: 849, imagen: 'https://link-a-imagen-del-producto2.jpg' },
    { id: 3, nombre: 'Xiaomi Mi 13', precio: 699, imagen: 'https://link-a-imagen-del-producto3.jpg' }
  ];
  
  // Lista de accesorios en oferta
  const accesoriosOferta = [
    { id: 1, nombre: 'Funda iPhone', precio: 19.99, imagen: 'https://link-a-imagen-accesorio1.jpg' },
    { id: 2, nombre: 'Cargador inalámbrico', precio: 29.99, imagen: 'https://link-a-imagen-accesorio2.jpg' },
    { id: 3, nombre: 'Audífonos Bluetooth', precio: 49.99, imagen: 'https://link-a-imagen-accesorio3.jpg' }
  ];
  
  const Home = () => {
    return (
      <div className="home-container">
        {/* Sección de bienvenida con efecto parallax */}
        <Parallax
          bgImage="https://link-a-imagen-principal.jpg" // Imagen de fondo para el parallax
          strength={300} // Fuerza del efecto parallax (ajusta según prefieras)
          className="welcome-section"
        >
          <div className="welcome-text">
            <h1>Bienvenido a tu tienda de móviles y accesorios</h1>
            <p>Explora nuestros productos en oferta y encuentra lo que más se ajusta a tus necesidades.</p>
          </div>
        </Parallax>
  
        {/* Sección de productos en oferta */}
        <section className="productos-oferta">
          <h2>Productos en Oferta</h2>
          <div className="product-cards-container">
            {productosOferta.map((producto) => (
              <div key={producto.id} className="product-card">
                <Parallax
                  bgImage={producto.imagen}
                  strength={100}
                  className="product-parallax"
                >
                  <h3>{producto.nombre}</h3>
                  <p>${producto.precio}</p>
                  <button>Comprar</button>
                </Parallax>
              </div>
            ))}
          </div>
        </section>
  
        {/* Sección de accesorios en oferta */}
        <section className="accesorios-oferta">
          <h2>Accesorios en Oferta</h2>
          <div className="accessory-cards-container">
            {accesoriosOferta.map((accesorio) => (
              <div key={accesorio.id} className="accessory-card">
                <Parallax
                  bgImage={accesorio.imagen}
                  strength={100}
                  className="accessory-parallax"
                >
                  <h3>{accesorio.nombre}</h3>
                  <p>${accesorio.precio}</p>
                  <button>Comprar</button>
                </Parallax>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
  
  export default Home;