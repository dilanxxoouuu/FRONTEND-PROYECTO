import React from "react";
import { Routes, Route } from "react-router-dom"; // Elimina BrowserRouter
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
import Profile from "../components/Profile/Profile"
import GestionCarritos from "../pages/Dashboard/GestionCarritos/GestionCarritos";
import GestionPagos from "../pages/Dashboard/GestionPagos/GestionPagos";
import GestionFacturas from "../pages/Dashboard/Gestion Facturas/GestionFacturas";
import GestionStock from "../pages/Dashboard/GestionStock/GestionStock";
import ReportesProductos from "../pages/Dashboard/Reportes/Reportes";
import AdminEnvios from "../pages/Dashboard/AdminEnvios/AdminEnvios";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gestionUsuarios" element={<GestionUsuarios />} />
            <Route path="/gestionProductos" element={<GestionProductos />} />
            <Route path="/gestionCategorias" element={<GestionCategorias />} />
            <Route path="/shoppingCart" element={<ShoppingCart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/GestionCarritos" element={<GestionCarritos />} />
            <Route path="/GestionPagos" element={<GestionPagos />} />
            <Route path="/GestionFacturas" element={<GestionFacturas />} />
            <Route path="/GestionStock" element={<GestionStock />} />
            <Route path="/Reportes" element={<ReportesProductos />} />
            <Route path="/admin/envios" element={<AdminEnvios />} />
        </Routes>
    );
};

export default AppRoutes;
