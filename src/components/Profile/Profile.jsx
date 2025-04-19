import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const VistaPerfilUsuario = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    numerodoc: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

  useEffect(() => {
    fetchUsuarioData();
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

  if (loading) return <div className="perfil-container">Cargando...</div>;
  if (error) return <div className="perfil-container error">{error}</div>;

  return (
    <motion.div
      className="perfil-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>👤 Perfil de Usuario</h2>
      {editMode ? (
        <motion.div
          key="edit-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
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
          <button className="save-btn" onClick={handleSave}>
            <FaSave style={{ marginRight: '8px' }} />
            Guardar cambios
          </button>
          <button className="cancel-btn" onClick={() => setEditMode(false)}>
            <FaTimes style={{ marginRight: '8px' }} />
            Cancelar
          </button>
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
          <button className="edit-btn" onClick={handleEdit}>
            <FaUserEdit style={{ marginRight: '8px' }} />
            Editar perfil
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VistaPerfilUsuario;
