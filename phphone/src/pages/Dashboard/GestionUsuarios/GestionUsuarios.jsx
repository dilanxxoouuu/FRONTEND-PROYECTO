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

    // Obtener usuarios desde la API
    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((error) => console.error("Error al obtener los usuarios:", error));
    }, []);

    // Manejar la creación de un nuevo usuario
    const handleAddUser = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:5000/usuarios", newUser)
            .then((response) => {
                setUsuarios([...usuarios, response.data]); // Agregar nuevo usuario
                setNewUser({ nombre: '', correo: '', numerodoc: '', contrasena: '' }); // Limpiar formulario
                setError('');
            })
            .catch((error) => {
                console.error("Error al agregar usuario:", error);
                setError("Error al agregar el usuario. Verifica los datos ingresados.");
            });
    };

    // Manejar la edición de un usuario
    const handleEditUser = (e) => {
        e.preventDefault();
        if (editUser) {
            axios
                .put(`http://127.0.0.1:5000/usuario/${editUser.id_usuario}`, editUser)
                .then((response) => {
                    const updatedUsers = usuarios.map(user =>
                        user.id_usuario === editUser.id_usuario ? response.data : user
                    );
                    setUsuarios(updatedUsers); // Actualizar usuario
                    setEditUser(null); // Limpiar edición
                    setError('');
                })
                .catch((error) => {
                    console.error("Error al editar usuario:", error);
                    setError("Error al editar el usuario. Verifica los datos ingresados.");
                });
        }
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
        setEditUser(user);
    };

    // Eliminar un usuario
    const handleDeleteUser = (id_usuario) => {
        axios
            .delete(`http://127.0.0.1:5000/usuario/${id_usuario}`)
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
                                <button onClick={() => startEditUser(user)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteUser(user.id_usuario)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionUsuarios;
