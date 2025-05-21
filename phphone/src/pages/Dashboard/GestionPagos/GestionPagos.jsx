import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionPagos.css';

const GestionPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [detallesPago, setDetallesPago] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
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

    const obtenerPagos = async () => {
        try {
            const response = await axiosInstance.get("/pagos");
            setPagos(response.data);
        } catch (error) {
            console.error("Error al obtener los pagos:", error);
            alert("No se pudieron obtener los pagos.");
        }
    };

    const obtenerDetallesPago = async (id_pago, metodo_pago) => {
        let endpoint = "";
        if (metodo_pago === "paypal") endpoint = `pago/paypal/${id_pago}`;
        else if (metodo_pago === "transferencia") endpoint = `pago/transferencia/${id_pago}`;
        else if (metodo_pago === "tarjeta") endpoint = `pago/tarjeta/${id_pago}`;
        else return;

        try {
            const response = await axiosInstance.get(endpoint);
            setDetallesPago((prev) => ({
                ...prev,
                [id_pago]: response.data,
            }));
            setPagoSeleccionado({ ...response.data, metodo_pago, id_pago });
            setModalVisible(true);
        } catch (error) {
            console.error("Error al obtener detalles del pago:", error);
            alert("No se pudieron obtener los detalles del pago.");
        }
    };

    useEffect(() => {
        obtenerPagos();
    }, []);

    const cerrarModal = () => {
        setModalVisible(false);
        setPagoSeleccionado(null);
    };

    return (
        <div className="gestion-pagos">
            <h1>Gestión de Pagos</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={obtenerPagos}>
                    Refrescar Pagos
                </button>
            </div>

            <div className="pagos-list">
                <h2>Listado de Pagos Realizados</h2>
                {pagos.length === 0 ? (
                    <p className="no-pagos">No se encontraron pagos</p>
                ) : (
                    <div className="pagos-grid">
                        {pagos.map((pago) => (
                            <div key={pago.id_pago} className="pago-card">
                                <div className="pago-header">
                                    <span className="pago-id">Pago ID: {pago.id_pago}</span>
                                </div>
                                <div className="pago-body">
                                    <p><strong>Monto:</strong> ${formatNumber(pago.monto)}</p>
                                    <p><strong>Método:</strong> {pago.metodo_pago}</p>
                                </div>
                                <div className="pago-footer">
                                    <button
                                        className="details-btn"
                                        onClick={() => obtenerDetallesPago(pago.id_pago, pago.metodo_pago)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalVisible && pagoSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={cerrarModal}>×</button>
                        <h2>Detalles del Pago</h2>
                        <p><strong>ID Pago:</strong> {pagoSeleccionado.id_pago}</p>
                        <p><strong>Método:</strong> {pagoSeleccionado.metodo_pago}</p>
                        <p><strong>Monto:</strong> ${formatNumber(pagoSeleccionado.monto || pagoSeleccionado.amount)}</p>
                        {Object.entries(pagoSeleccionado).map(([clave, valor]) => (
                            clave !== "id_pago" && clave !== "metodo_pago" && clave !== "monto" && clave !== "amount" && (
                                <p key={clave}><strong>{clave}:</strong> 
                                    {pagoSeleccionado.metodo_pago === "tarjeta" 
                                        ? "🔒 Datos encriptados por seguridad." 
                                        : typeof valor === 'number' ? formatNumber(valor) : valor}
                                </p>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPagos;