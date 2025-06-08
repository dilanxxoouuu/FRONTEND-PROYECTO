import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSave, FaTimes, FaLock, FaBox, FaMoneyBillWave, FaTruck, FaCalendarAlt } from 'react-icons/fa';
import './Profile.css';
import EstadoPedidoModal from '../EstadoPedido/EstadoPedidoModal';

const VistaPerfilUsuario = () => {
  // Estados para el perfil
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    numerodoc: '',
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Datos del usuario
        const userResponse = await axios.get('https://backenddespliegue-production.up.railway.app/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuario({
          ...userResponse.data,
          contrasena_actual: '',
          nueva_contrasena: '',
          confirmar_contrasena: ''
        });

        // Datos de pedidos
        const ordersResponse = await axios.get('https://backenddespliegue-production.up.railway.app/api/mis-pedidos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPedidos(ordersResponse.data?.pedidos || []);
        
      } catch (error) {
        setPedidos([]);
      } finally {
        setLoadingPedidos(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar contraseña actual solo si se está cambiando algo
    if ((usuario.nueva_contrasena || editMode) && !usuario.contrasena_actual) {
      newErrors.contrasena_actual = 'Debes ingresar tu contraseña actual para hacer cambios';
    }

    if (usuario.nueva_contrasena) {
      if (!/^[A-Za-z0-9]{8,16}$/.test(usuario.nueva_contrasena)) {
        newErrors.nueva_contrasena = '8-16 caracteres alfanuméricos';
      }
      if (usuario.nueva_contrasena !== usuario.confirmar_contrasena) {
        newErrors.confirmar_contrasena = 'Las contraseñas no coinciden';
      }
    }

    if (editMode && usuario.nombre && !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario.nombre)) {
      newErrors.nombre = 'Solo letras y espacios';
    }

    if (editMode && usuario.numerodoc && !/^\d{1,15}$/.test(usuario.numerodoc)) {
      newErrors.numerodoc = 'Máx. 15 dígitos';
    }

    if (editMode && usuario.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)) {
      newErrors.correo = 'Correo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {};
      
      // Solo incluir campos que han cambiado
      if (editMode) {
        if (usuario.nombre) payload.nombre = usuario.nombre;
        if (usuario.numerodoc) payload.numerodoc = String(usuario.numerodoc);
        if (usuario.correo) payload.correo = usuario.correo;
      }
      
      // Solo incluir contraseña si se está cambiando
      if (usuario.nueva_contrasena) {
        payload.contrasena_actual = usuario.contrasena_actual;
        payload.nueva_contrasena = usuario.nueva_contrasena;
        payload.confirmar_contrasena = usuario.confirmar_contrasena;
      } else if (editMode) {
        // Si se están editando otros datos pero no la contraseña
        payload.contrasena_actual = usuario.contrasena_actual;
      }

      const response = await axios.put('https://backenddespliegue-production.up.railway.app/perfil', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg('¡Perfil actualizado!');
      setEditMode(false);
      setUsuario(prev => ({
        ...response.data.usuario,
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: ''
      }));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEstadoColor = (estado) => {
    const estados = {
      pendiente: '#FFD600',
      procesando: '#2962FF',
      enviado: '#00C853',
      cancelado: '#FF5252'
    };
    return estados[estado] || '#333';
  };

  return (
    <div className="profile-page-container">
      {/* Sección de Perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-section"
      >
        <div className="profile-card">
          <h2><FaUserEdit /> Mi Perfil</h2>
          
          {successMsg && (
            <div className="alert alert-success">
              <span>✓</span> {successMsg}
            </div>
          )}
          
          {errorMsg && (
            <div className="alert alert-error">
              <span>!</span> {errorMsg}
            </div>
          )}

          {editMode ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  placeholder={usuario.nombre}
                  className={errors.nombre ? 'input-error' : ''}
                />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label>Documento</label>
                <input
                  type="text"
                  name="numerodoc"
                  value={usuario.numerodoc}
                  onChange={handleChange}
                  placeholder={usuario.numerodoc}
                  className={errors.numerodoc ? 'input-error' : ''}
                />
                {errors.numerodoc && <span className="field-error">{errors.numerodoc}</span>}
              </div>

              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={usuario.correo}
                  onChange={handleChange}
                  placeholder={usuario.correo}
                  className={errors.correo ? 'input-error' : ''}
                />
                {errors.correo && <span className="field-error">{errors.correo}</span>}
              </div>

              <div className="password-section">
                <h3><FaLock /> Cambiar Contraseña (Opcional)</h3>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    name="nueva_contrasena"
                    value={usuario.nueva_contrasena}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiar"
                    className={errors.nueva_contrasena ? 'input-error' : ''}
                  />
                  {errors.nueva_contrasena && (
                    <span className="field-error">{errors.nueva_contrasena}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmar_contrasena"
                    value={usuario.confirmar_contrasena}
                    onChange={handleChange}
                    placeholder="Confirmar nueva contraseña"
                    className={errors.confirmar_contrasena ? 'input-error' : ''}
                  />
                  {errors.confirmar_contrasena && (
                    <span className="field-error">{errors.confirmar_contrasena}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña Actual*</label>
                <input
                  type="password"
                  name="contrasena_actual"
                  value={usuario.contrasena_actual}
                  onChange={handleChange}
                  className={errors.contrasena_actual ? 'input-error' : ''}
                  required
                />
                {errors.contrasena_actual && (
                  <span className="field-error">{errors.contrasena_actual}</span>
                )}
                <small className="hint">* Requerida para confirmar cambios</small>
              </div>

              <div className="button-group">
                <button type="submit" className="btn-save">
                  <FaSave /> Guardar
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditMode(false)}
                >
                  <FaTimes /> Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="view-mode">
              <div className="profile-info">
                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Documento:</strong> {usuario.numerodoc}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
              </div>
              <button
                className="btn-edit"
                onClick={() => setEditMode(true)}
              >
                <FaUserEdit /> Editar Perfil
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sección de Pedidos */}
      <div className="orders-section">
        <div className="orders-card">
          <h2><FaBox /> Mis Pedidos</h2>
          
          {loadingPedidos ? (
            <div className="loading-orders">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="no-orders">
              <p>No has realizado ningún pedido aún.</p>
              <button 
                className="shop-btn" 
                onClick={() => navigate('/productos')}
              >
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
                  </div>

                  <div className="order-products">
                    {pedido.productos.map((producto, index) => (
                      <div key={index} className="product-item">
                        <img 
                          src={producto.imagen.includes('cloudinary') ? producto.imagen : `https://res.cloudinary.com/dgshedbuj/image/upload/${producto.imagen}`} 
                          alt={producto.nombre} 
                          className="product-image" 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
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
                    Ver detalles
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de estado de pedido */}
      {modalAbierto && (
        <EstadoPedidoModal
          pedidoId={pedidoSeleccionado}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
};

export default VistaPerfilUsuario;