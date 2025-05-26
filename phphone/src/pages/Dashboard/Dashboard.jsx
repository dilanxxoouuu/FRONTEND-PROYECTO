import React from "react";
import { Link } from "react-router-dom";
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
  FaClipboardList,
  FaCog
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
    const adminModules = [
        {
            path: "/GestionUsuarios",
            icon: <FaUsers className="btn-icon" />,
            title: "Gestión de Usuarios"
        },
        {
            path: "/GestionProductos",
            icon: <FaBoxOpen className="btn-icon" />,
            title: "Gestión de Productos"
        },
        {
            path: "/GestionCategorias",
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