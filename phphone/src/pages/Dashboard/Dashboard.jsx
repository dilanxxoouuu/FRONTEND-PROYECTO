import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  FaUsers, 
  FaBoxOpen, 
  FaThLarge, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaFileInvoiceDollar,
  FaWarehouse,
  FaChartBar,
  FaTruck,
  FaClipboardList
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const Dashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.sub === "1"); // Asumiendo que sub: "1" es admin
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    const adminModules = [
        {
            path: "/gestionUsuarios",
            icon: <FaUsers className="btn-icon" />,
            title: "Gestión de Usuarios"
        },
        {
            path: "/gestionProductos",
            icon: <FaBoxOpen className="btn-icon" />,
            title: "Gestión de Productos"
        },
        {
            path: "/gestionCategorias",
            icon: <FaThLarge className="btn-icon" />,
            title: "Gestión de Categorías"
        },
        {
            path: "/GestionCarritos",
            icon: <FaShoppingCart className="btn-icon" />,
            title: "Gestión de Carritos"
        },
        {
            path: "/GestionPagos",
            icon: <FaMoneyBillWave className="btn-icon" />,
            title: "Gestión de Pagos"
        },
        {
            path: "/GestionFacturas",
            icon: <FaFileInvoiceDollar className="btn-icon" />,
            title: "Gestión de Facturas"
        },
        {
            path: "/GestionStock",
            icon: <FaWarehouse className="btn-icon" />,
            title: "Gestión de Stock"
        },
        {
            path: "/Reportes",
            icon: <FaChartBar className="btn-icon" />,
            title: "Reportes"
        },
        {
            path: "/admin/envios",
            icon: <FaTruck className="btn-icon" />,
            title: "Administración de Envíos"
        },
    ];

    if (loading) {
        return <div className="dashboard-loading">Cargando...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/products" replace />;
    }

    return (
        <div className="dashboard">
            <h1><FaClipboardList style={{marginRight: '15px'}} />Módulo Administrativo</h1>
            <p>Bienvenido al módulo administrativo, aquí podrás gestionar todos los recursos de tu aplicación.</p>
            
            <div className="admin-buttons">
                {adminModules.map((module, index) => (
                    <Link 
                        to={module.path} 
                        key={index} 
                        className="admin-btn"
                    >
                        {module.icon}
                        {module.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;