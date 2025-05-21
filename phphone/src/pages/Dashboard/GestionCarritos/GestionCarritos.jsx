import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionCarritos.css';

const GestionCarritos = () => {
    const [carritos, setCarritos] = useState([]);
    const [productosPorCarrito, setProductosPorCarrito] = useState({});
    const [carritoExpandido, setCarritoExpandido] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Función para formatear números con puntos de mil
    const formatNumber = (number) => {
        return new Intl.NumberFormat('es-ES').format(number);
    };

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const obtenerCarritos = async () => {
        try {
            const response = await axiosInstance.get("/carritos");
            setCarritos(response.data);
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
            alert("No se pudieron obtener los carritos.");
        }
    };

    const obtenerProductosDelCarrito = async (idCarrito) => {
        try {
            const response = await axiosInstance.get(`/carrito_producto/${idCarrito}`);
            const productos = response.data.filter(
                (cp) => cp.id_carrito === idCarrito
            );
            setProductosPorCarrito((prev) => ({
                ...prev,
                [idCarrito]: productos,
            }));
        } catch (error) {
            console.error("Error al obtener productos del carrito:", error);
            alert("No se pudieron obtener los productos del carrito.");
        }
    };

    const toggleDetalles = (idCarrito) => {
        if (carritoExpandido === idCarrito) {
            setCarritoExpandido(null);
        } else {
            setCarritoExpandido(idCarrito);
            if (!productosPorCarrito[idCarrito]) {
                obtenerProductosDelCarrito(idCarrito);
            }
        }
    };

    useEffect(() => {
        obtenerCarritos();
    }, []);

    return (
        <div className="gestion-carritos">
            <h1>Gestión de Carritos</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={obtenerCarritos}>
                    Refrescar Carritos
                </button>
            </div>

            <div className="carritos-list">
                <h2>Listado de Carritos Activos</h2>
                {carritos.length === 0 ? (
                    <p className="no-carritos">No hay carritos activos</p>
                ) : (
                    <div className="carritos-grid">
                        {carritos.map((carrito) => (
                            <div key={carrito.id_carrito} className="carrito-card">
                                <div className="carrito-header">
                                    <span className="carrito-id">Carrito ID: {carrito.id_carrito}</span>
                                    <span className={`status-badge ${carrito.procesado ? 'processed' : 'not-processed'}`}>
                                        {carrito.procesado ? "Procesado" : "No Procesado"}
                                    </span>
                                </div>
                                <div className="carrito-body">
                                    <p><strong>Usuario ID:</strong> {carrito.id_usuario}</p>
                                    <p><strong>Fecha:</strong> {carrito.fecha}</p>
                                    <p><strong>Total:</strong> ${formatNumber(carrito.total)}</p>
                                </div>
                                <div className="carrito-footer">
                                    <button
                                        className="details-btn"
                                        onClick={() => toggleDetalles(carrito.id_carrito)}
                                    >
                                        {carritoExpandido === carrito.id_carrito ? "Ocultar Detalles" : "Ver Detalles"}
                                    </button>
                                </div>

                                {carritoExpandido === carrito.id_carrito && productosPorCarrito[carrito.id_carrito] && (
                                    <div className="products-details">
                                        <h4>Productos en este carrito:</h4>
                                        {productosPorCarrito[carrito.id_carrito].length === 0 ? (
                                            <p>No hay productos en este carrito.</p>
                                        ) : (
                                            <ul className="products-list">
                                                {productosPorCarrito[carrito.id_carrito].map((producto) => (
                                                    <li key={producto.id_carrito_producto} className="product-item">
                                                        <strong>{producto.producto.producto_nombre}</strong> - 
                                                        Cantidad: {producto.cantidad} - 
                                                        Precio: ${formatNumber(producto.producto.producto_precio)} - 
                                                        Subtotal: ${formatNumber(producto.cantidad * producto.producto.producto_precio)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionCarritos;