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
import ProductosVista from "../components/ProductosVista/ProductosVista";
import Pago from "../components/Pago/Pago";
import Profile from "../components/Profile/Profile"


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
            <Route path="/productosVista" element={<ProductosVista />} />
            <Route path="/pago" element={<Pago />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
};

export default AppRoutes;
