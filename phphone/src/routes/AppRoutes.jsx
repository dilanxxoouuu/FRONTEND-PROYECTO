import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import GestionUsuarios from "../pages/Dashboard/GestionUsuarios/GestionUsuarios";
import GestionProductos from "../pages/Dashboard/GestionProductos/GestionProductos";
import GestionCategorias from "../pages/Dashboard/GestionCategorias/GestionCategorias";
import ShoppingCart from "../pages/ShoppingCart/ShoppingCart";
import Profile from "../components/Profile/Profile";
import GestionCarritos from "../pages/Dashboard/GestionCarritos/GestionCarritos";
import GestionPagos from "../pages/Dashboard/GestionPagos/GestionPagos";
import GestionFacturas from "../pages/Dashboard/Gestion Facturas/GestionFacturas";
import GestionStock from "../pages/Dashboard/GestionStock/GestionStock";
import ReportesProductos from "../pages/Dashboard/Reportes/Reportes";
import AdminEnvios from "../pages/Dashboard/AdminEnvios/AdminEnvios";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/products" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (decoded.sub !== "1") {
            return <Navigate to="/products" replace />;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return <Navigate to="/products" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/shoppingCart" element={<ShoppingCart />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Rutas protegidas para admin */}
            <Route path="/dashboard" element={
                <AdminRoute>
                    <Dashboard />
                </AdminRoute>
            } />
            <Route path="/gestionUsuarios" element={
                <AdminRoute>
                    <GestionUsuarios />
                </AdminRoute>
            } />
            <Route path="/gestionProductos" element={
                <AdminRoute>
                    <GestionProductos />
                </AdminRoute>
            } />
            <Route path="/gestionCategorias" element={
                <AdminRoute>
                    <GestionCategorias />
                </AdminRoute>
            } />
            <Route path="/GestionCarritos" element={
                <AdminRoute>
                    <GestionCarritos />
                </AdminRoute>
            } />
            <Route path="/GestionPagos" element={
                <AdminRoute>
                    <GestionPagos />
                </AdminRoute>
            } />
            <Route path="/GestionFacturas" element={
                <AdminRoute>
                    <GestionFacturas />
                </AdminRoute>
            } />
            <Route path="/GestionStock" element={
                <AdminRoute>
                    <GestionStock />
                </AdminRoute>
            } />
            <Route path="/Reportes" element={
                <AdminRoute>
                    <ReportesProductos />
                </AdminRoute>
            } />
            <Route path="/admin/envios" element={
                <AdminRoute>
                    <AdminEnvios />
                </AdminRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;