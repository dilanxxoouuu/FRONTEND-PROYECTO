import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSave, FaTimes, FaBox, FaMoneyBillWave, FaTruck, FaCalendarAlt } from 'react-icons/fa';
import './Profile.css';
import EstadoPedidoModal from '../EstadoPedido/EstadoPedidoModal';

const VistaPerfilUsuario = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    numerodoc: '',
    contrasena: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const navigate = useNavigate();

  const getJWTToken = () => localStorage.getItem('token');

  const getUserIdFromToken = (token) => {
    try {
      if (!token) throw new Error('Token no disponible');
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };

  const fetchUsuarioData = async () => {
    try {
      const token = getJWTToken();
      if (!token) return navigate('/login');

      const response = await axios.get('http://localhost:5000/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los datos del usuario.');
      setLoading(false);
    }
  };

  const fetchPedidosUsuario = async () => {
    try {
      const token = getJWTToken();
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/mis-pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPedidos(response.data.pedidos || []);
      setLoadingPedidos(false);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    fetchUsuarioData();
    fetchPedidosUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = getJWTToken();
      if (!token) return navigate('/login');

      const id_usuario = getUserIdFromToken(token);
      if (!id_usuario) return setError('ID de usuario no encontrado en el token.');

      const response = await axios.put('http://localhost:5000/perfil', usuario, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(response.data);
      setEditMode(false);
    } catch (err) {
      setError('Error al actualizar los datos del usuario.');
    }
  };

  const handleEdit = () => setEditMode(true);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'var(--amarillo-accion)';
      case 'procesando':
        return 'var(--azul-brillante)';
      case 'enviada':
        return 'var(--verde-esmeralda)';
      case 'cancelada':
        return 'var(--rojo-error)';
      default:
        return 'var(--gris-oscuro)';
    }
  };

  if (loading) return <div className="perfil-container">Cargando...</div>;
  if (error) return <div className="perfil-container error">{error}</div>;

  return (
    <motion.div
      className="profile-page-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="profile-section">
        <div className="profile-card">
          <h2>👤 Perfil de Usuario</h2>
          {editMode ? (
            <motion.div
              key="edit-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="edit-form"
            >
              <div className="input-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={usuario.nombre} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Correo:</label>
                <input type="email" name="correo" value={usuario.correo} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Número de documento:</label>
                <input type="text" name="numerodoc" value={usuario.numerodoc} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Contraseña:</label>
                <input type="password" name="contrasena" value={usuario.contrasena} onChange={handleInputChange} />
              </div>
              <div className="button-group">
                <button className="save-btn" onClick={handleSave}>
                  <FaSave style={{ marginRight: '8px' }} />
                  Guardar cambios
                </button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  <FaTimes style={{ marginRight: '8px' }} />
                  Cancelar
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="perfil-detalles"
            >
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Documento:</strong> {usuario.numerodoc}</p>
              <div className="button-center">
                <button className="edit-btn" onClick={handleEdit}>
                  <FaUserEdit style={{ marginRight: '8px' }} />
                  Editar perfil
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="orders-section">
        <div className="orders-card">
          <h2>📦 Mis Pedidos</h2>
          
          {loadingPedidos ? (
            <div className="loading-orders">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="no-orders">
              <p>No has realizado ningún pedido aún.</p>
              <button className="shop-btn" onClick={() => navigate('/productos')}>
                Ir a la tienda
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {pedidos.map((pedido) => (
                <motion.div 
                  key={pedido.id_orden}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="order-header">
                    <div className="order-id">Pedido #{pedido.id_orden}</div>
                    <div 
                      className="order-status"
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </div>
                  </div>
                  
                  <div className="order-details">
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>{formatDate(pedido.fecha)}</span>
                    </div>
                    <div className="detail-item">
                      <FaMoneyBillWave className="detail-icon" />
                      <span>${pedido.total.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <FaBox className="detail-icon" />
                      <span>{pedido.productos.length} producto(s)</span>
                    </div>
                    {pedido.direccion_envio && (
                      <div className="detail-item">
                        <FaTruck className="detail-icon" />
                        <span>{pedido.direccion_envio.ciudad}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="order-products">
                    {pedido.productos.map((producto, index) => (
                      <div key={index} className="product-item">
                        <img 
                          src={`http://localhost:5000/static/uploads/${producto.imagen}`} 
                          alt={producto.nombre} 
                          className="product-image" 
                        />
                        <div className="product-info">
                          <div className="product-name">{producto.nombre}</div>
                          <div className="product-quantity">Cantidad: {producto.cantidad}</div>
                          <div className="product-price">${producto.precio_unitario.toLocaleString()} c/u</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="view-order-btn"
                    onClick={() => {
                      setPedidoSeleccionado(pedido.id_orden);
                      setModalAbierto(true);
                    }}
                  >
                    Ver estado del envío
                  </button> 
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      {modalAbierto && (
        <EstadoPedidoModal 
          pedidoId={pedidoSeleccionado} 
          onClose={() => setModalAbierto(false)}
          isAdmin={usuario.esAdmin} 
        />
      )}
    </motion.div>
  );
};

export default VistaPerfilUsuario;