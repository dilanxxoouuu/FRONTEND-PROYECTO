import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Reportes.css';

const Reportes = () => {
    const [reporte, setReporte] = useState([]);
    const [periodo, setPeriodo] = useState('hoy');
    const [loading, setLoading] = useState(false);
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

    const obtenerReporte = async () => {
        try {
            setLoading(true);
            setError(null); // Limpiamos cualquier error previo
            const response = await axiosInstance.get(`/reportes/productos-mas-vendidos?periodo=${periodo}`);
            
            // Si no hay datos, simplemente establecemos un array vacío
            setReporte(response.data || []);
            
        } catch (error) {
            // Solo mostramos errores que no sean 404 (no encontrado)
            if (error.response && error.response.status === 404) {
                setReporte([]); // Establecemos array vacío para 404
            } else {
                console.error("Error:", error);
                setError('Error al obtener los reportes');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerReporte();
    }, [periodo]);

    return (
        <motion.div 
            className="reportes-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="header-container">
                <h1>Reporte de Productos Más Vendidos</h1>
                <motion.button
                    className="back-btn"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Regresar al Dashboard
                </motion.button>
            </div>
            
            {error && (
                <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p>Error: {error}</p>
                    <motion.button 
                        onClick={obtenerReporte}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reintentar
                    </motion.button>
                </motion.div>
            )}

            <div className="filtros">
                {['hoy', 'semana', 'mes', 'año'].map((p) => (
                    <motion.button
                        key={p}
                        className={`periodo-btn ${periodo === p ? 'active' : ''}`}
                        onClick={() => setPeriodo(p)}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {p === 'hoy' && 'Hoy'}
                        {p === 'semana' && 'Esta Semana'}
                        {p === 'mes' && 'Este Mes'}
                        {p === 'año' && 'Este Año'}
                    </motion.button>
                ))}
            </div>

            {loading ? (
                <motion.div 
                    className="loading-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="spinner"></div>
                    <p>Cargando reporte...</p>
                </motion.div>
            ) : (
                <div className="tabla-reporte">
                    {reporte.length > 0 ? (
                        <motion.table
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
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
                                    <motion.tr 
                                        key={item.id_producto}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{item.producto_nombre}</td>
                                        <td>{item.total_vendido}</td>
                                        <td>
                                            <div className="barra-container">
                                                <motion.div 
                                                    className="barra-progreso"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.porcentaje}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                ></motion.div>
                                                <span>{item.porcentaje}%</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </motion.table>
                    ) : (
                        <motion.p 
                            className="no-data"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No hay datos disponibles para el período seleccionado
                        </motion.p>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default Reportes;