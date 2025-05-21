import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        baseURL: "http://127.0.0.1:5000",
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
            alert("Por favor ingresa una cantidad válida");
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
                alert("Stock actualizado correctamente");
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
            alert(errorMessage);
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
        <div className="gestion-stock">
            <h1>Gestión de Stock</h1>
            
            {error && <div className="error-message">{error}</div>}

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={fetchProductos} disabled={loading}>
                    {loading ? 'Cargando...' : 'Refrescar Productos'}
                </button>
            </div>

            <div className="productos-container">
                <h2>Listado de Productos</h2>
                {productos.length === 0 ? (
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
                                    <tr key={producto.id_producto}>
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
                                                />
                                                <select
                                                    name="motivo"
                                                    value={ajustes[producto.id_producto]?.motivo || 'reposicion'}
                                                    onChange={(e) => handleChange(producto.id_producto, e)}
                                                >
                                                    <option value="reposicion">Reposición</option>
                                                    <option value="compra">Compra</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleAjusteStock(producto.id_producto)}
                                                    disabled={loading}
                                                    className="apply-btn"
                                                >
                                                    {loading ? 'Procesando...' : 'Aplicar'}
                                                </button>
                                            </div>
                                            <button 
                                                className="history-btn"
                                                onClick={() => fetchHistorial(producto.id_producto)}
                                            >
                                                Ver Historial
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showHistorial && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Historial de Stock - Producto {currentProduct}</h2>
                        <button 
                            className="modal-close"
                            onClick={() => setShowHistorial(false)}
                        >
                            ×
                        </button>
                        
                        <div className="historial-table-container">
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
                                        <tr key={index}>
                                            <td>{new Date(item.fecha_ajuste).toLocaleString()}</td>
                                            <td>{item.stock_anterior}</td>
                                            <td className={item.cantidad_ajuste > 0 ? 'positive' : 'negative'}>
                                                {item.cantidad_ajuste > 0 ? '+' : ''}{item.cantidad_ajuste}
                                            </td>
                                            <td>{item.nuevo_stock}</td>
                                            <td>{item.motivo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionStock;