import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionUsuarios.css'; // Archivo de estilos

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
    const [newUser, setNewUser] = useState({ name: '', email: '' }); // Datos del nuevo usuario
    const [editUser, setEditUser] = useState(null); // Usuario en edición
    const navigate = useNavigate(); // Para navegación

    // Obtener usuarios desde la API
    useEffect(() => {
        axios
            .get("https://api.escuelajs.co/api/v1/users")
            .then((response) => setUsuarios(response.data))
            .catch((error) => console.error("Error al obtener los usuarios:", error));
    }, []);

    // Manejar la creación de un nuevo usuario
    const handleAddUser = (e) => {
        e.preventDefault();
        axios
            .post("https://api.escuelajs.co/api/v1/users", newUser)
            .then((response) => {
                setUsuarios([...usuarios, response.data]); // Agregar nuevo usuario
                setNewUser({ name: '', email: '' }); // Limpiar formulario
            })
            .catch((error) => console.error("Error al agregar usuario:", error));
    };

    // Manejar la edición de un usuario
    const handleEditUser = (e) => {
        e.preventDefault();
        if (editUser) {
            axios
                .put(`https://api.escuelajs.co/api/v1/users/${editUser.id}`, editUser)
                .then((response) => {
                    const updatedUsers = usuarios.map(user => user.id === editUser.id ? response.data : user);
                    setUsuarios(updatedUsers); // Actualizar usuario
                    setEditUser(null); // Limpiar edición
                })
                .catch((error) => console.error("Error al editar usuario:", error));
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
    const handleDeleteUser = (id) => {
        axios
            .delete(`https://api.escuelajs.co/api/v1/users/${id}`)
            .then(() => {
                setUsuarios(usuarios.filter(user => user.id !== id)); // Eliminar usuario
            })
            .catch((error) => console.error("Error al eliminar usuario:", error));
    };

    return (
        <div className="gestion-usuario">
            <h1>Gestión de Usuarios</h1>

            {/* Botón para regresar al Dashboard */}
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                Regresar al Dashboard
            </button>

            <form onSubmit={editUser ? handleEditUser : handleAddUser} className="user-form">
                <h2>{editUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <input
                    type="text"
                    name="name"
                    value={editUser ? editUser.name : newUser.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={editUser ? editUser.email : newUser.email}
                    onChange={handleChange}
                    placeholder="Correo Electrónico"
                    required
                />
                <button type="submit">{editUser ? 'Actualizar Usuario' : 'Agregar Usuario'}</button>
            </form>

            <div className="user-list">
                <h2>Usuarios</h2>
                <ul>
                    {usuarios.map(user => (
                        <li key={user.id} className="user-item">
                            <div className="user-info">
                                <p>{user.name} - {user.email}</p>
                            </div>
                            <div className="user-actions">
                                <button onClick={() => startEditUser(user)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionUsuarios;
