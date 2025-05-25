import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBoxOpen, FaCheckCircle, FaTruck, FaHome, FaTimes, FaSync } from 'react-icons/fa';

const estados = [
  { id: 1, nombre: 'Empacando', icono: <FaBoxOpen />, descripcion: 'Tu pedido está siendo preparado y empacado.' },
  { id: 2, nombre: 'Validando', icono: <FaCheckCircle />, descripcion: 'Estamos verificando los detalles de tu pedido.' },
  { id: 3, nombre: 'En Camino a Tu Hogar', icono: <FaTruck />, descripcion: '¡Tu pedido está en camino!' },
  { id: 4, nombre: 'Tu Pedido Ya Ha Sido Entregado', icono: <FaHome />, descripcion: 'El pedido ha llegado a su destino.' }
];

const EstadoPedidoModal = ({ pedidoId, onClose }) => {
  const [estadoActual, setEstadoActual] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval] = useState(10000); // 10 segundos para el refresh real

  const getJWTToken = () => localStorage.getItem('token');

  const fetchEstadoEnvio = async () => {
    try {
      const token = getJWTToken();
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/envios/${pedidoId}/estado`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setEstadoActual(response.data.estado_envio || 'Empacando');
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error al cargar estado de envío:', err);
      setError('Error al cargar el estado del envío');
      setLoading(false);
    }
  };

  // Efecto para la carga real del estado
  useEffect(() => {
    // Carga inicial
    fetchEstadoEnvio();

    // Configurar intervalo de actualización
    const intervalId = setInterval(fetchEstadoEnvio, refreshInterval);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [pedidoId, refreshInterval]);

  // Obtener el estado actual
  const getCurrentEstado = () => {
    return estadoActual;
  };

  const getEstadoIndex = () => {
    const currentEstado = getCurrentEstado();
    return estados.findIndex(e => e.nombre === currentEstado);
  };

  const progreso = () => {
    const index = getEstadoIndex();
    return index >= 0 ? (index / (estados.length - 1)) * 100 : 0;
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchEstadoEnvio();
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="estado-pedido-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header">
          <h2>Seguimiento de tu Pedido</h2>
          <div className="modal-controls">
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              <FaSync className={loading ? 'spin' : ''} />
              {loading ? ' Actualizando...' : ' Actualizar'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-details">Cargando estado del pedido...</div>
        ) : error ? (
          <div className="error-estado">{error}</div>
        ) : (
          <>
            <div className="progress-container">
              <div className="progress-line">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progreso()}%` }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              
              <div className="progress-steps">
                {estados.map((estado, index) => {
                  const isActive = index <= getEstadoIndex();
                  const isCurrent = estado.nombre === getCurrentEstado();
                  
                  return (
                    <div 
                      key={estado.id} 
                      className={`progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-icon">{estado.icono}</div>
                      <div className="step-label">{estado.nombre}</div>
                      {isCurrent && (
                        <div className="step-description">{estado.descripcion}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="estado-actual">
              <h3>
                Estado actual: <span>{getCurrentEstado()}</span>
              </h3>
              <p>
                {estados.find(e => e.nombre === getCurrentEstado())?.descripcion || 
                'Estamos procesando tu pedido. Te mantendremos informado.'}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EstadoPedidoModal;