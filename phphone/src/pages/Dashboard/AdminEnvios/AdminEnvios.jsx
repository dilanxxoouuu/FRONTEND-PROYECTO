import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEnvios.css'; // Cambiado a importación directa

const AdminEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  const estadosDisponibles = [
    'Empacando',
    'Validando',
    'En Camino a Tu Hogar',
    'Tu Pedido Ya Ha Sido Entregado'
  ];

  const getToken = () => localStorage.getItem('token');

  const cargarEnvios = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/admin/envios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnvios(response.data.envios);
    } catch (error) {
      alert('Error al cargar envíos');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async () => {
    if (!selectedEnvio || !nuevoEstado) return;

    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:5000/api/admin/envios/${selectedEnvio.id_envio}/estado`,
        { nuevo_estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Estado actualizado');
      cargarEnvios();
      setSelectedEnvio(null);
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

  return (
    <div className="admin-envios-container"> {/* Cambiado a className directo */}
      <h1 className="admin-envios-title">Gestión de Envíos (Admin)</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="admin-envios-table">
          <thead>
            <tr>
              <th>ID Envío</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Factura</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id_envio}>
                <td>{envio.id_envio}</td>
                <td>{envio.nombre_usuario}</td>
                <td>
                  <span style={{ 
                    color: envio.estado_actual === 'Tu Pedido Ya Ha Sido Entregado' ? 'green' : 
                          envio.estado_actual === 'En Camino a Tu Hogar' ? 'blue' : 'orange'
                  }}>
                    {envio.estado_actual}
                  </span>
                </td>
                <td>{envio.id_factura}</td>
                <td>
                  <button 
                    className="admin-envios-button"
                    onClick={() => {
                      setSelectedEnvio(envio);
                      setNuevoEstado(envio.estado_actual);
                    }}
                  >
                    Cambiar Estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEnvio && (
        <div className="admin-envios-modal">
          <h2>Cambiar estado de envío #{selectedEnvio.id_envio}</h2>
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            className="admin-envios-select"
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <div className="admin-envios-modal-buttons">
            <button 
              className="admin-envios-cancel-button"
              onClick={() => setSelectedEnvio(null)}
            >
              Cancelar
            </button>
            <button 
              className="admin-envios-save-button"
              onClick={actualizarEstado}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnvios;