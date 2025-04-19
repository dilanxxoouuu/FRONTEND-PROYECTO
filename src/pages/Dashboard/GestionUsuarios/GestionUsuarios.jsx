import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionUsuarios.css'; // Archivo de estilos

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]); // Lista de usuarios  
    const [newUser, setNewUser] = useState({ nombre: '', correo: '', numerodoc: '', contrasena: '' }); // Datos del nuevo usuario
    const [editUser, setEditUser] = useState(null); // Usuario en edición
    const [error, setError] = useState(''); // Mensaje de error
    const navigate = useNavigate(); // Para navegación

    // Obtener el token del almacenamiento local (localStorage)
    const token = localStorage.getItem("token");

    // Configuración para axios (incluyendo el token en las cabeceras)
    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000", // URL base de tu API
        headers: {
            Authorization: `Bearer ${token}`, // Incluir el token JWT en las cabeceras
        },
    });

    // Obtener usuarios desde la API
    const refreshUsers = () => {
        axiosInstance
            .get("/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error);
                setError("Error al cargar los usuarios.");
            });
    };

    // Usar el useEffect para cargar los usuarios al inicio
    useEffect(() => {
        refreshUsers(); // Cargar usuarios al inicio
    }, []);

    // Manejar la creación de un nuevo usuario
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.nombre || !newUser.correo || !newUser.numerodoc || !newUser.contrasena) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        axiosInstance
            .post("/usuarios", newUser)
            .then((response) => {
                setUsuarios([...usuarios, response.data]); // Agregar nuevo usuario
                setNewUser({ nombre: '', correo: '', numerodoc: '', contrasena: '' }); // Limpiar formulario
                setError(''); // Limpiar error
            })
            .catch((error) => {
                console.error("Error al agregar usuario:", error);
                setError("Error al agregar el usuario. Verifica los datos ingresados.");
            });
    };

    // Manejar la edición de un usuario
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
                setUsuarios(updatedUsers); // Actualizar usuario
                setEditUser(null); // Limpiar edición
                setError(''); // Limpiar error
            })
            .catch((error) => {
                console.error("Error al editar usuario:", error);
                setError("Error al editar el usuario. Verifica los datos ingresados.");
            });
    };

    // Manejar cambios en formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUser(prev => ({ ...prev, [name]: value }));
        }
    };

    // Iniciar edición de usuario
    const startEditUser = (user) => {
        // No permitir editar si el usuario es el superadmin (rol_id 1)
        if (user.rol_id === 1) {
            setError("No puedes editar los datos del superadmin.");
            return;
        }
        setEditUser(user);
    };

    // Eliminar un usuario
    const handleDeleteUser = (id_usuario) => {
        // Verificar que no sea el superadmin antes de eliminar
        const userToDelete = usuarios.find(user => user.id_usuario === id_usuario);
        if (userToDelete && userToDelete.rol_id === 1) {
            setError("No puedes eliminar al superadmin.");
            return;
        }

        axiosInstance
            .delete(`/usuario/${id_usuario}`)
            .then(() => {
                setUsuarios(usuarios.filter(user => user.id_usuario !== id_usuario)); // Eliminar usuario
            })
            .catch((error) => {
                console.error("Error al eliminar usuario:", error);
                setError("Error al eliminar el usuario.");
            });
    };

    return (
        <div className="gestion-usuario">
            <h1>Gestión de Usuarios</h1>

            {/* Botón para regresar al Dashboard */}
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                Regresar al Dashboard
            </button>

            {/* Botón para refrescar los usuarios */}
            <button className="refresh-btn" onClick={refreshUsers}>
                Refrescar Usuarios
            </button>

            {/* Mensaje de error */}
            {error && <p className="error-message">{error}</p>}

            {/* Formulario para agregar o editar usuario */}
            <form onSubmit={editUser ? handleEditUser : handleAddUser} className="user-form">
                <h2>{editUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <input
                    type="text"
                    name="nombre"
                    value={editUser ? editUser.nombre : newUser.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="email"
                    name="correo"
                    value={editUser ? editUser.correo : newUser.correo}
                    onChange={handleChange}
                    placeholder="Correo Electrónico"
                    required
                />
                <input
                    type="text"
                    name="numerodoc"
                    value={editUser ? editUser.numerodoc : newUser.numerodoc}
                    onChange={handleChange}
                    placeholder="Número de Documento"
                    required
                />
                {!editUser && (
                    <input
                        type="password"
                        name="contrasena"
                        value={newUser.contrasena}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                    />
                )}
                <button type="submit">{editUser ? 'Actualizar Usuario' : 'Agregar Usuario'}</button>
            </form>

            {/* Lista de usuarios */}
            <div className="user-list">
                <h2>Usuarios</h2>
                <ul>
                    {usuarios.map(user => (
                        <li key={user.id_usuario} className="user-item">
                            <div className="user-info">
                                <p>{user.nombre} - {user.correo} - {user.numerodoc}</p>
                            </div>
                            <div className="user-actions">
                                {/* Solo permitir editar/eliminar si no es el superadmin */}
                                {user.rol_id !== 1 && (
                                    <>
                                        <button onClick={() => startEditUser(user)} className="edit-btn">Editar</button>
                                        <button onClick={() => handleDeleteUser(user.id_usuario)} className="delete-btn">Eliminar</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionUsuarios;
