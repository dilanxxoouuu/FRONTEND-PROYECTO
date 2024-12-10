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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/GestionUsuarios" element={<GestionUsuarios />} />
            <Route path="/GestionProductos" element={<GestionProductos />} />
            <Route path="/GestionCategorias" element={<GestionCategorias />} />
        </Routes>
    );
};

export default AppRoutes;
