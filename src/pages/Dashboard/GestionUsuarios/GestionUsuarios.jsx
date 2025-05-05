import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionUsuarios.css';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [newUser, setNewUser] = useState({ nombre: '', correo: '', numerodoc: '', contrasena: '' });
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const refreshUsers = () => {
        axiosInstance
            .get("/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error);
                setError("Error al cargar los usuarios.");
            });
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.nombre || !newUser.correo || !newUser.numerodoc || !newUser.contrasena) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        axiosInstance
            .post("/usuarios", newUser)
            .then((response) => {
                setUsuarios([...usuarios, response.data]);
                setNewUser({ nombre: '', correo: '', numerodoc: '', contrasena: '' });
                setError('');
            })
            .catch((error) => {
                console.error("Error al agregar usuario:", error);
                setError("Error al agregar el usuario. Verifica los datos ingresados.");
            });
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        if (!editUser.nombre || !editUser.correo || !editUser.numerodoc) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        axiosInstance
            .put(`/usuario/${editUser.id_usuario}`, editUser)
            .then((response) => {
                const updatedUsers = usuarios.map(user =>
                    user.id_usuario === editUser.id_usuario ? response.data : user
                );
                setUsuarios(updatedUsers);
                setEditUser(null);
                setError('');
            })
            .catch((error) => {
                console.error("Error al editar usuario:", error);
                setError("Error al editar el usuario. Verifica los datos ingresados.");
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const startEditUser = (user) => {
        if (user.rol_id === 1) {
            setError("No puedes editar los datos del superadmin.");
            return;
        }
        setEditUser(user);
    };

    const handleDeleteUser = (id_usuario) => {
        const userToDelete = usuarios.find(user => user.id_usuario === id_usuario);
        if (userToDelete && userToDelete.rol_id === 1) {
            setError("No puedes eliminar al superadmin.");
            return;
        }

        axiosInstance
            .delete(`/usuario/${id_usuario}`)
            .then(() => {
                setUsuarios(usuarios.filter(user => user.id_usuario !== id_usuario));
            })
            .catch((error) => {
                console.error("Error al eliminar usuario:", error);
                setError("Error al eliminar el usuario.");
            });
    };

    return (
        <div className="gestion-usuarios">
            <h1>Gestión de Usuarios</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={refreshUsers}>
                    Refrescar Usuarios
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-container">
                <form onSubmit={editUser ? handleEditUser : handleAddUser} className="user-form">
                    <h2>{editUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            name="nombre"
                            value={editUser ? editUser.nombre : newUser.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="correo"
                            value={editUser ? editUser.correo : newUser.correo}
                            onChange={handleChange}
                            placeholder="Correo Electrónico"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="numerodoc"
                            value={editUser ? editUser.numerodoc : newUser.numerodoc}
                            onChange={handleChange}
                            placeholder="Número de Documento"
                            required
                        />
                    </div>
                    {!editUser && (
                        <div className="form-group">
                            <input
                                type="password"
                                name="contrasena"
                                value={newUser.contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                required
                            />
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editUser ? 'Actualizar Usuario' : 'Agregar Usuario'}
                        </button>
                        {editUser && (
                            <button type="button" className="cancel-btn" onClick={() => setEditUser(null)}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="users-list">
                <h2>Listado de Usuarios</h2>
                {usuarios.length === 0 ? (
                    <p className="no-users">No hay usuarios registrados</p>
                ) : (
                    <div className="users-grid">
                        {usuarios.map(user => (
                            <div key={user.id_usuario} className="user-card">
                                <div className="user-header">
                                    <span className="user-id">ID: {user.id_usuario}</span>
                                    {user.rol_id === 1 && <span className="superadmin-badge">Superadmin</span>}
                                </div>
                                <div className="user-body">
                                    <p><strong>Nombre:</strong> {user.nombre}</p>
                                    <p><strong>Correo:</strong> {user.correo}</p>
                                    <p><strong>Documento:</strong> {user.numerodoc}</p>
                                </div>
                                <div className="user-footer">
                                    {user.rol_id !== 1 && (
                                        <>
                                            <button onClick={() => startEditUser(user)} className="edit-btn">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id_usuario)} className="delete-btn">
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionUsuarios;