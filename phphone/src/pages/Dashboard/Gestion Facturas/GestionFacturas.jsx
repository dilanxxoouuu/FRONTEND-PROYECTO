import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GestionFacturas.css';
import { useNavigate } from 'react-router-dom';

const GestionFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [detallesFactura, setDetallesFactura] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Obtener todas las facturas
    const obtenerFacturas = async () => {
        try {
            const response = await axiosInstance.get("/facturas");
            setFacturas(response.data);
        } catch (error) {
            console.error("Error al obtener las facturas:", error);
            alert("No se pudieron obtener las facturas.");
        }
    };

    // Obtener detalles de una factura específica
    const obtenerDetallesFactura = async (id_factura) => {
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
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={obtenerFacturas}>
                    Refrescar Facturas
                </button>
            </div>

            <div className="facturas-list">
                <h2>Listado de Facturas</h2>
                {facturas.length === 0 ? (
                    <p className="no-facturas">No se encontraron facturas</p>
                ) : (
                    <div className="facturas-grid">
                        {facturas.map((factura) => (
                            <div key={factura.id_factura} className="factura-card">
                                <div className="factura-header">
                                    <span className="factura-id">Factura ID: {factura.id_factura}</span>
                                </div>
                                <div className="factura-body">
                                    <p><strong>Total:</strong> ${factura.total}</p>
                                    <p><strong>Fecha:</strong> {factura.factura_fecha}</p>
                                </div>
                                <div className="factura-footer">
                                    <button
                                        className="details-btn"
                                        onClick={() => obtenerDetallesFactura(factura.id_factura)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalVisible && facturaSeleccionada && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={cerrarModal}>×</button>
                        <h2>Detalles de la Factura</h2>
                        <p><strong>ID Factura:</strong> {facturaSeleccionada.id_factura}</p>
                        {facturaSeleccionada.detalles && facturaSeleccionada.detalles.length > 0 ? (
                            facturaSeleccionada.detalles.map((detalle) => (
                                <div key={detalle.id_detalle_factura} className="detalle-item">
                                    <p><strong>ID Producto:</strong> {detalle.id_producto}</p>
                                    <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                                    <p><strong>Precio Unitario:</strong> ${detalle.precio_unitario}</p>
                                    <p><strong>Monto Total:</strong> ${detalle.monto_total}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron detalles para esta factura.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionFacturas;