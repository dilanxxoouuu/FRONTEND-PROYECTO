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
  FaClipboardList
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Módulo Administrativo</h1>
            <p>Bienvenido al módulo administrativo, aquí podrás gestionar todos los recursos de tu aplicación.</p>
            
            <div className="admin-buttons">
                <Link to="/GestionUsuarios" className="admin-btn">
                    <FaUsers className="btn-icon" />
                    Gestión de Usuarios
                </Link>
                
                <Link to="/GestionProductos" className="admin-btn">
                    <FaBoxOpen className="btn-icon" />
                    Gestión de Productos
                </Link>
                
                <Link to="/GestionCategorias" className="admin-btn">
                    <FaThLarge className="btn-icon" />
                    Gestión de Categorías
                </Link>
                
                <Link to="/GestionCarritos" className="admin-btn">
                    <FaShoppingCart className="btn-icon" />
                    Gestión de Carritos
                </Link>
                
                <Link to="/GestionPagos" className="admin-btn">
                    <FaMoneyBillWave className="btn-icon" />
                    Gestión de Pagos
                </Link>
                
                <Link to="/GestionFacturas" className="admin-btn">
                    <FaFileInvoiceDollar className="btn-icon" />
                    Gestión de Facturas
                </Link>
                
                <Link to="/GestionStock" className="admin-btn">
                    <FaWarehouse className="btn-icon" />
                    Gestión de Stock
                </Link>
                
                <Link to="/Reportes" className="admin-btn">
                    <FaChartBar className="btn-icon" />
                    Reportes
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;