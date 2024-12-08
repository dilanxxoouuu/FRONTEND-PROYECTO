import React from 'react';
import './Home.css'; // Estilos para la página de bienvenida
import Footer from "../../components/Footer/Footer";


const Home = () => {

    return (
        <div className="home-container">

            <div className="home-content">
                {/* Título y mensaje de bienvenida */}
                <div className="home-title">
                    <h2>¡Bienvenido a phphone!</h2>
                    <p>Explora nuestros productos de alta calidad y haz tu compra hoy mismo.</p>
                </div>

                <div class="container">
                    <div class="home-image">
                        <img src="/src/assets/images/LogoPHPHONEblanco.jpg" alt="Bienvenida a phphone" />
                    </div>

                    <div class="products-section">
                        <h3>Productos Destacados</h3>
                        <p>Descubre los mejores productos que tenemos para ti.</p>
                        <button class="explore-button">Ver Productos</button>
                    </div>
                </div>

            </div>


            <div>
                {/* Aquí puedes agregar más contenido */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;