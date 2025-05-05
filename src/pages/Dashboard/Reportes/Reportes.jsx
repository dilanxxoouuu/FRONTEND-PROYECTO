import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reportes.css';

const Reportes = () => {
    const [reporte, setReporte] = useState([]);
    const [periodo, setPeriodo] = useState('hoy');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    const obtenerReporte = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/reportes/productos-mas-vendidos?periodo=${periodo}`);
            setReporte(response.data);
        } catch (error) {
            console.error("Error completo:", error);
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                setError(error.response.data.message || 'Error al obtener el reporte');
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                setError('No se recibió respuesta del servidor');
            } else {
                // Algo pasó al configurar la solicitud
                setError('Error al configurar la solicitud');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerReporte();
    }, [periodo]);

    return (
        <div className="reportes-container">
            <h1>Reporte de Productos Más Vendidos</h1>
            
            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                    <button onClick={obtenerReporte}>Reintentar</button>
                </div>
            )}

            <div className="filtros">
                <button 
                    className={`periodo-btn ${periodo === 'hoy' ? 'active' : ''}`}
                    onClick={() => setPeriodo('hoy')}
                    disabled={loading}
                >
                    Hoy
                </button>
                <button 
                    className={`periodo-btn ${periodo === 'semana' ? 'active' : ''}`}
                    onClick={() => setPeriodo('semana')}
                    disabled={loading}
                >
                    Esta Semana
                </button>
                <button 
                    className={`periodo-btn ${periodo === 'mes' ? 'active' : ''}`}
                    onClick={() => setPeriodo('mes')}
                    disabled={loading}
                >
                    Este Mes
                </button>
                <button 
                    className={`periodo-btn ${periodo === 'año' ? 'active' : ''}`}
                    onClick={() => setPeriodo('año')}
                    disabled={loading}
                >
                    Este Año
                </button>
            </div>

            {loading ? (
                <div className="loading-indicator">Cargando reporte...</div>
            ) : (
                <div className="tabla-reporte">
                    {reporte.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Posición</th>
                                    <th>Producto</th>
                                    <th>Unidades Vendidas</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.map((item, index) => (
                                    <tr key={item.id_producto}>
                                        <td>{index + 1}</td>
                                        <td>{item.producto_nombre}</td>
                                        <td>{item.total_vendido}</td>
                                        <td>
                                            <div className="barra-container">
                                                <div 
                                                    className="barra-progreso"
                                                    style={{ width: `${item.porcentaje}%` }}
                                                ></div>
                                                <span>{item.porcentaje}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">No hay datos disponibles para el período seleccionado</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reportes;