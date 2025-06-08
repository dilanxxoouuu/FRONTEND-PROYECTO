import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './GestionStock.css';

const GestionStock = () => {
    const [productos, setProductos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHistorial, setShowHistorial] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "https://backenddespliegue-production.up.railway.app",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    const [ajustes, setAjustes] = useState({});

    useEffect(() => {
        if (productos.length > 0) {
            const initialAjustes = {};
            productos.forEach(producto => {
                initialAjustes[producto.id_producto] = {
                    cantidad: '',
                    motivo: 'reposicion'
                };
            });
            setAjustes(initialAjustes);
        }
    }, [productos]);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("/productos");
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            setError("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistorial = async (id_producto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/productos/${id_producto}/historial-stock`);
            setHistorial(response.data);
            setCurrentProduct(id_producto);
            setShowHistorial(true);
        } catch (error) {
            console.error("Error al obtener historial:", error);
            setError("Error al cargar historial");
        } finally {
            setLoading(false);
        }
    };

    const handleAjusteStock = async (id_producto) => {
        const ajuste = ajustes[id_producto];
        
        if (!ajuste.cantidad || isNaN(ajuste.cantidad)) {
            setError("Por favor ingresa una cantidad válida");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const payload = {
                cantidad: Number(ajuste.cantidad),
                motivo: ajuste.motivo
            };

            const response = await axiosInstance.post(
                `/productos/${id_producto}/ajuste-stock`,
                payload
            );

            if (response.status === 200 || response.status === 201) {
                await fetchProductos();
                
                setAjustes(prev => ({
                    ...prev,
                    [id_producto]: {
                        cantidad: '',
                        motivo: 'reposicion'
                    }
                }));
                
                if (showHistorial && currentProduct === id_producto) {
                    await fetchHistorial(id_producto);
                }
            }
        } catch (error) {
            console.error("Error completo:", error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Error al ajustar stock";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id_producto, e) => {
        const { name, value } = e.target;
        setAjustes(prev => ({
            ...prev,
            [id_producto]: {
                ...prev[id_producto],
                [name]: name === 'cantidad' ? value.replace(/[^0-9-]/g, '') : value
            }
        }));
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <motion.div 
            className="gestion-stock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1>Gestión de Stock</h1>
            
            {error && (
                <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    {error}
                </motion.div>
            )}

            <div className="action-buttons">
                <motion.button 
                    className="back-btn" 
                    onClick={() => navigate("/dashboard")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Regresar al Dashboard
                </motion.button>
                <motion.button 
                    className="refresh-btn" 
                    onClick={fetchProductos} 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Cargando...' : 'Refrescar Productos'}
                </motion.button>
            </div>

            <div className="productos-container">
                <h2>Listado de Productos</h2>
                {loading && productos.length === 0 ? (
                    <div className="loading-products">
                        <div className="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                ) : productos.length === 0 ? (
                    <p className="no-products">No hay productos registrados</p>
                ) : (
                    <div className="productos-table-container">
                        <table className="productos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Stock Actual</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <motion.tr 
                                        key={producto.id_producto}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td>{producto.id_producto}</td>
                                        <td>{producto.producto_nombre}</td>
                                        <td className={producto.producto_stock <= 5 ? 'low-stock' : ''}>
                                            {producto.producto_stock}
                                        </td>
                                        <td className="actions">
                                            <div className="stock-control">
                                                <input
                                                    type="number"
                                                    name="cantidad"
                                                    value={ajustes[producto.id_producto]?.cantidad || ''}
                                                    onChange={(e) => handleChange(producto.id_producto, e)}
                                                    placeholder="Cantidad"
                                                    disabled={loading}
                                                />
                                                <select
                                                    name="motivo"
                                                    value={ajustes[producto.id_producto]?.motivo || 'reposicion'}
                                                    onChange={(e) => handleChange(producto.id_producto, e)}
                                                    disabled={loading}
                                                >
                                                    <option value="reposicion">Reposición</option>
                                                    <option value="compra">Compra</option>
                                                </select>
                                                <motion.button 
                                                    onClick={() => handleAjusteStock(producto.id_producto)}
                                                    disabled={loading}
                                                    className="apply-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {loading ? 'Procesando...' : 'Aplicar'}
                                                </motion.button>
                                            </div>
                                            <motion.button 
                                                className="history-btn"
                                                onClick={() => fetchHistorial(producto.id_producto)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Ver Historial
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showHistorial && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowHistorial(false)}
                    >
                        <motion.div 
                            className="modal-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>
                                Historial de Stock - Producto {currentProduct}
                                {productos.find(p => p.id_producto === currentProduct)?.producto_nombre && 
                                `: ${productos.find(p => p.id_producto === currentProduct).producto_nombre}`}
                            </h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowHistorial(false)}
                            >
                                ×
                            </button>
                            
                            <div className="historial-table-container">
                                {loading ? (
                                    <div className="loading-historial">
                                        <div className="spinner"></div>
                                        <p>Cargando historial...</p>
                                    </div>
                                ) : historial.length === 0 ? (
                                    <p className="no-historial">No hay registros de historial</p>
                                ) : (
                                    <table className="historial-table">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Stock Anterior</th>
                                                <th>Ajuste</th>
                                                <th>Nuevo Stock</th>
                                                <th>Motivo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historial.map((item, index) => (
                                                <motion.tr 
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <td>{new Date(item.fecha_ajuste).toLocaleString()}</td>
                                                    <td>{item.stock_anterior}</td>
                                                    <td className={item.cantidad_ajuste > 0 ? 'positive' : 'negative'}>
                                                        {item.cantidad_ajuste > 0 ? '+' : ''}{item.cantidad_ajuste}
                                                    </td>
                                                    <td>{item.nuevo_stock}</td>
                                                    <td>
                                                        <span className={`motivo-badge ${item.motivo}`}>
                                                            {item.motivo}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GestionStock;