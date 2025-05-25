import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionPagos.css';

const GestionPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [detallesPago, setDetallesPago] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const formatNumber = (number) => {
        if (number === undefined || number === null || isNaN(number)) return "0";
        return new Intl.NumberFormat('es-ES').format(number);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const obtenerPagos = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/pagos");
            setPagos(response.data);
        } catch (error) {
            console.error("Error al obtener los pagos:", error);
            alert("No se pudieron obtener los pagos.");
        } finally {
            setLoading(false);
        }
    };

    const obtenerDetallesPago = async (pago) => {
        setLoading(true);
        let endpoint = "";
        if (pago.metodo_pago === "paypal") endpoint = `pago/paypal/${pago.id_pago}`;
        else if (pago.metodo_pago === "transferencia") endpoint = `pago/transferencia/${pago.id_pago}`;
        else if (pago.metodo_pago === "tarjeta") endpoint = `pago/tarjeta/${pago.id_pago}`;
        else return;

        try {
            const response = await axiosInstance.get(endpoint);
            const datosPago = {
                ...response.data,
                metodo_pago: pago.metodo_pago,
                id_pago: pago.id_pago,
                monto: pago.monto,
                fecha_pago: pago.fecha_pago,
                estado: pago.estado
            };
            
            setDetallesPago((prev) => ({
                ...prev,
                [pago.id_pago]: datosPago,
            }));
            setPagoSeleccionado(datosPago);
            setModalVisible(true);
        } catch (error) {
            console.error("Error al obtener detalles del pago:", error);
            alert("No se pudieron obtener los detalles del pago.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPagos();
    }, []);

    const cerrarModal = () => {
        setModalVisible(false);
        setPagoSeleccionado(null);
    };

    const renderDetallesPago = () => {
        if (!pagoSeleccionado) return null;
        
        const detallesExcluidos = ['id_pago', 'metodo_pago', 'monto', 'fecha_pago', 'estado'];
        
        return (
            <div className="detalles-container">
                <div className="detalle-item">
                    <span className="detalle-label">ID Pago:</span>
                    <span className="detalle-value">{pagoSeleccionado.id_pago}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Método:</span>
                    <span className="detalle-value">{pagoSeleccionado.metodo_pago}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Monto:</span>
                    <span className="detalle-value">${formatNumber(pagoSeleccionado.monto)}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Fecha:</span>
                    <span className="detalle-value">{formatDate(pagoSeleccionado.fecha_pago)}</span>
                </div>
                <div className="detalle-item">
                    <span className="detalle-label">Estado:</span>
                    <span className="detalle-value">{pagoSeleccionado.estado}</span>
                </div>
                
                {Object.entries(pagoSeleccionado)
                    .filter(([clave]) => !detallesExcluidos.includes(clave))
                    .map(([clave, valor]) => (
                        <div key={clave} className="detalle-item">
                            <span className="detalle-label">{clave.replace(/_/g, ' ')}:</span>
                            <span className="detalle-value">
                                {pagoSeleccionado.metodo_pago === "tarjeta" && 
                                (clave === 'numero_tarjeta_hash' || clave === 'cvv_hash') 
                                    ? "🔒 Datos encriptados por seguridad." 
                                    : typeof valor === 'number' ? formatNumber(valor) : valor}
                            </span>
                        </div>
                    ))
                }
            </div>
        );
    };

    return (
        <div className="gestion-pagos">
            <h1>Gestión de Pagos</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={obtenerPagos} disabled={loading}>
                    {loading ? 'Cargando...' : 'Refrescar Pagos'}
                </button>
            </div>

            <div className="pagos-list">
                <h2>Listado de Pagos Realizados</h2>
                {loading && pagos.length === 0 ? (
                    <p className="loading-pagos">Cargando pagos...</p>
                ) : pagos.length === 0 ? (
                    <p className="no-pagos">No se encontraron pagos</p>
                ) : (
                    <div className="pagos-grid">
                        {pagos.map((pago) => (
                            <div key={pago.id_pago} className="pago-card">
                                <div className="pago-header">
                                    <span className="pago-id">Pago ID: {pago.id_pago}</span>
                                    <span className={`pago-estado ${pago.estado}`}>{pago.estado}</span>
                                </div>
                                <div className="pago-body">
                                    <p><strong>Monto:</strong> ${formatNumber(pago.monto)}</p>
                                    <p><strong>Método:</strong> {pago.metodo_pago}</p>
                                    <p><strong>Fecha:</strong> {formatDate(pago.fecha_pago)}</p>
                                </div>
                                <div className="pago-footer">
                                    <button
                                        className="details-btn"
                                        onClick={() => obtenerDetallesPago(pago)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Ver Detalles'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalVisible && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={cerrarModal}>×</button>
                        <h2>Detalles del Pago</h2>
                        {loading ? (
                            <p className="loading-details">Cargando detalles...</p>
                        ) : (
                            renderDetallesPago()
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPagos;