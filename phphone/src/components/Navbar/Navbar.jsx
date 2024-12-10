import React, { useState, useEffect } from 'react'; 
import { FaHome, FaBox, FaSignInAlt, FaUserPlus, FaUserCog, FaSignOutAlt } from 'react-icons/fa'; // Importar los iconos
import './Navbar.css'; // Asegúrate de que este archivo de estilos esté importado

const Navbar = () => {
    const [menuActive, setMenuActive] = useState(false); // Estado para el menú desplegable
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para saber si el usuario está logueado
    const [user, setUser] = useState(null); // Información del usuario (puedes almacenarla si es necesario)

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    // Función para verificar si el usuario está logeado
    const checkLoginStatus = () => {
        // Aquí se debería comprobar si el usuario está logueado, por ejemplo, usando localStorage, cookies o una API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Suponiendo que el objeto usuario se guarda en localStorage
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('user'); // Limpiar los datos del usuario en el almacenamiento local
        setIsLoggedIn(false); // Actualizar el estado
        setUser(null); // Limpiar la información del usuario
        window.location.href = '/'; // Redirigir al home
    };

    // Efecto para verificar el estado de inicio de sesión al cargar el componente
    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div className="Navbar-container">
            {/* Logo */}
            <div className="navbar">
                <div className="navbar-logo">
                    <h1>PHPHONE</h1>
                </div>

                {/* Botón de menú hamburguesa */}
                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Enlaces de la barra de navegación */}
                <ul className={`navbar-links ${menuActive ? 'active' : ''}`}>
                    <li><a href="/"><FaHome size={24} /></a></li> {/* Icono de Inicio */}
                    <li><a href="/products"><FaBox size={24} /></a></li> {/* Icono de Productos */}
                    
                    {!isLoggedIn ? (
                        <>
                            {/* Si el usuario no está logueado */}
                            <li><a href="/login"><FaSignInAlt size={24} /></a></li> {/* Icono de Iniciar sesión */}
                            <li><a href="/register"><FaUserPlus size={24} /></a></li> {/* Icono de Registrarme */}
                        </>
                    ) : (
                        <>
                            {/* Si el usuario está logueado */}
                            <li><a href="/profile"><FaUserCog size={24} /></a></li> {/* Icono de Configurar Perfil */}
                            <li><a href="#" onClick={handleLogout}><FaSignOutAlt size={24} /></a></li> {/* Icono de Cerrar sesión */}
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
