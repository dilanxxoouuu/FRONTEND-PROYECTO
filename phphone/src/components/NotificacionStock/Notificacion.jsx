import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Notificacion.module.css';

const NotificationIcon = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const axiosInstance = axios.create({
        baseURL: "https://backenddespliegue-production.up.railway.app",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const fetchLowStockProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/api/productos/bajo-stock');
            const formattedProducts = response.data.productos.map(product => ({
                ...product,
                producto_nombre: product.nombre || product.producto_nombre,
                producto_stock: product.stock_actual || product.producto_stock
            }));
            setLowStockProducts(formattedProducts || []);
        } catch (error) {
            console.error('Error al obtener productos con bajo stock:', error);
            setError(error.response?.data?.message || error.message);
            setLowStockProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLowStockProducts();
            const interval = setInterval(fetchLowStockProducts, 300000);
            return () => clearInterval(interval);
        }
    }, [token]);

    if (!token) return null;
    if (loading) return <div className={styles.notificationLoading}>Cargando...</div>;

    return (
        <div className={styles.notificationContainer}>
            <button 
                className={`${styles.notificationBtn} ${error ? styles.hasError : ''}`}
                onClick={() => !error && setShowNotification(!showNotification)}
                aria-label={error || "Notificaciones de stock bajo"}
                title={error}
            >
                <FaBoxOpen />
                {!error && lowStockProducts.length > 0 && (
                    <span className={styles.notificationBadge}>
                        {lowStockProducts.length}
                    </span>
                )}
            </button>

            {showNotification && !error && (
                <div className={styles.notificationDropdown}>
                    <div className={styles.notificationHeader}>
                        <FaExclamationTriangle className={styles.warningIcon} />
                        <h4>Bajo stock</h4>
                        <span className={styles.notificationCount}>{lowStockProducts.length}</span>
                    </div>
                    
                    {lowStockProducts.length > 0 ? (
                        <div className={styles.productsList}>
                            {lowStockProducts.map(product => (
                                <Link 
                                    key={product.id_producto}
                                    to="/GestionStock"
                                    className={styles.productItem}
                                    onClick={() => setShowNotification(false)}
                                >
                                    <span className={styles.productName}>{product.producto_nombre}</span>
                                    <span className={styles.stockValue}>{product.producto_stock} unidades</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyNotification}>
                            Stock suficiente
                        </div>
                    )}
                    
                    <Link 
                        to="/GestionStock" 
                        className={styles.viewAllLink}
                        onClick={() => setShowNotification(false)}
                    >
                        Ver gestión
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;