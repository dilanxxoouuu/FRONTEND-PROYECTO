import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './GestionFacturas.css';

const GestionFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [detallesFactura, setDetallesFactura] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "https://backenddespliegue-production.up.railway.app",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Función para formatear números con puntos de mil
    const formatNumber = (number) => {
        return new Intl.NumberFormat('es-ES').format(number);
    };

    const obtenerFacturas = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/facturas");
            setFacturas(response.data);
        } catch (error) {
            console.error("Error al obtener las facturas:", error);
            alert("No se pudieron obtener las facturas.");
        } finally {
            setLoading(false);
        }
    };

    const obtenerDetallesFactura = async (id_factura) => {
    setLoading(true);
    try {
        const response = await axiosInstance.get(`/detallefactura/${id_factura}`);
        
        setDetallesFactura((prev) => ({
            ...prev,
            [id_factura]: response.data,
        }));

        setFacturaSeleccionada({
            id_factura,
            detalles: response.data,
        });

        setModalVisible(true);
    } catch (error) {
        console.error("Error al obtener detalles de la factura:", error);
        alert("No se pudieron obtener los detalles de la factura.");
    } finally {
        setLoading(false);
    }
};
    
    useEffect(() => {
        obtenerFacturas();
    }, []);

    const cerrarModal = () => {
        setModalVisible(false);
        setFacturaSeleccionada(null);
    };

    return (
        <div className="gestion-facturas">
            <h1>Gestión de Facturas</h1>

            <div className="action-buttons">
                <button 
                    className="back-btn" 
                    onClick={() => navigate("/dashboard")}
                    disabled={loading}
                >
                    Regresar al Dashboard
                </button>
                <button 
                    className="refresh-btn" 
                    onClick={obtenerFacturas}
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Refrescar Facturas'}
                </button>
            </div>

            <div className="facturas-list">
                <h2>Listado de Facturas</h2>
                {loading && facturas.length === 0 ? (
                    <p className="loading-facturas">Cargando facturas...</p>
                ) : facturas.length === 0 ? (
                    <p className="no-facturas">No se encontraron facturas</p>
                ) : (
                    <div className="facturas-grid">
                        {facturas.map((factura) => (
                            <motion.div 
                                key={factura.id_factura} 
                                className="factura-card"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="factura-header">
                                    <span className="factura-id">Factura ID: {factura.id_factura}</span>
                                </div>
                                <div className="factura-body">
                                    <p><strong>Total:</strong> ${formatNumber(factura.total)}</p>
                                    <p><strong>Fecha:</strong> {new Date(factura.factura_fecha).toLocaleDateString()}</p>
                                </div>
                                <div className="factura-pie">
                                    <button
                                        className="details-btn"
                                        onClick={() => obtenerDetallesFactura(factura.id_factura)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Ver Detalles'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {modalVisible && (
                <motion.div 
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={cerrarModal}
                >
                    <motion.div 
                        className="modal-content"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={cerrarModal}>×</button>
                        <h2>Detalles de la Factura</h2>
                        {loading ? (
                            <p className="loading-details">Cargando detalles...</p>
                        ) : facturaSeleccionada ? (
                            <>
                                <div className="detalle-item">
                                    <p><strong>ID Factura:</strong> {facturaSeleccionada.id_factura}</p>
                                </div>
                                {facturaSeleccionada.detalles && facturaSeleccionada.detalles.length > 0 ? (
                                    <div className="detalles-container">
                                        <table className="detalles-table">
                                        <thead>
                                            <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {facturaSeleccionada.detalles.map((detalle) => (
                                            <tr key={detalle.id_detalle_factura}>
                                                <td data-label="Producto">{detalle.producto_nombre}</td>
                                                <td data-label="Cantidad">{detalle.cantidad}</td>
                                                <td data-label="Precio Unitario">${formatNumber(detalle.precio_unitario)}</td>
                                                <td data-label="Total">${formatNumber(detalle.monto_total)}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                        <div className="detalle-total">
                                        <div className="detalle-total-inner">
                                            <span>Total Factura:</span>
                                            <span>${formatNumber(facturas.find(f => f.id_factura === facturaSeleccionada.id_factura)?.total || 0)}</span>
                                        </div>
                                        </div>
                                    </div>
                                    ) : (
                                    <p>No se encontraron detalles para esta factura.</p>
                                    )}
                            </>
                        ) : (
                            <p>No se pudo cargar la información de la factura.</p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default GestionFacturas;