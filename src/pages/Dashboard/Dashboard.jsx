import React from "react";
import { Link } from "react-router-dom"; // Importamos Link para la navegación
import { FaUsers, FaBoxOpen, FaThLarge } from "react-icons/fa"; // Importamos los iconos
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Módulo Administrativo</h1>
            <p>Bienvenido al módulo administrativo, aquí podrás gestionar todos los usuarios y recursos de nuestra aplicación.</p>
            
            {/* Contenedor de los botones de administración */}
            <div className="admin-buttons">
            <Link to="/GestionUsuarios" className="admin-btn">
        <FaUsers size={20} />
        Gestión de Usuarios
    </Link>
    <Link to="/GestionProductos" className="admin-btn">
        <FaBoxOpen size={20} />
        Gestión de Productos
    </Link>
    <Link to="/GestionCategorias" className="admin-btn">
        <FaThLarge size={20} />
        Gestión de Categorías
    </Link>
            </div>
        </div>
    );
};

export default Dashboard;
