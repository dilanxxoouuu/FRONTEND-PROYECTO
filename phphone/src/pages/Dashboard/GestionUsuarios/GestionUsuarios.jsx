import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionUsuarios.css';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [newUser, setNewUser] = useState({ 
        nombre: '', 
        numerodoc: '', 
        correo: '', 
        contrasena: '' 
    });
    const [editUser, setEditUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Función para validar los campos
    const validateFields = (data, isEditing = false) => {
        const newErrors = {};
        
        // Validación Nombre (solo letras)
        if (!data.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
        } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
            newErrors.nombre = 'Solo se permiten letras y espacios.';
        }

        // Validación Número de documento (solo números, máximo 15)
        if (!data.numerodoc.trim()) {
            newErrors.numerodoc = 'El documento es obligatorio.';
        } else if (!/^\d{1,15}$/.test(data.numerodoc)) {
            newErrors.numerodoc = 'Máximo 15 dígitos numéricos.';
        }

        // Validación Correo (formato válido)
        if (!data.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
            newErrors.correo = 'Formato inválido (ejemplo@dominio.com).';
        }

        // Validación Contraseña (solo para creación, no para edición)
        if (!isEditing) {
            if (!data.contrasena.trim()) {
                newErrors.contrasena = 'La contraseña es obligatoria.';
            } else if (!/^[A-Za-z0-9]{8,16}$/.test(data.contrasena)) {
                newErrors.contrasena = '8-16 caracteres alfanuméricos.';
            }
        }

        return newErrors;
    };

    const refreshUsers = () => {
        axiosInstance
            .get("/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error);
                setErrorMessage("Error al cargar los usuarios.");
            });
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();
        const validationErrors = validateFields(newUser);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            axiosInstance
                .post("/usuarios", newUser)
                .then((response) => {
                    setUsuarios([...usuarios, response.data]);
                    setNewUser({ nombre: '', correo: '', numerodoc: '', contrasena: '' });
                    setErrors({});
                    setSuccessMessage('Usuario creado exitosamente.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch((error) => {
                    console.error("Error al agregar usuario:", error);
                    setErrorMessage(error.response?.data?.message || "Error al agregar el usuario.");
                });
        }
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        const validationErrors = validateFields(editUser, true);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            axiosInstance
                .put(`/usuario/${editUser.id_usuario}`, editUser)
                .then((response) => {
                    const updatedUsers = usuarios.map(user =>
                        user.id_usuario === editUser.id_usuario ? response.data : user
                    );
                    setUsuarios(updatedUsers);
                    setEditUser(null);
                    setErrors({});
                    setSuccessMessage('Usuario actualizado exitosamente.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch((error) => {
                    console.error("Error al editar usuario:", error);
                    setErrorMessage(error.response?.data?.message || "Error al editar el usuario.");
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editUser) {
            setEditUser(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUser(prev => ({ ...prev, [name]: value }));
        }
        
        // Limpiar errores al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Limpiar mensajes al escribir
        if (successMessage || errorMessage) {
            setSuccessMessage('');
            setErrorMessage('');
        }
    };

    const startEditUser = (user) => {
        if (user.rol_id === 1) {
            setErrorMessage("No puedes editar los datos del superadmin.");
            return;
        }
        setEditUser(user);
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleDeleteUser = (id_usuario) => {
        const userToDelete = usuarios.find(user => user.id_usuario === id_usuario);
        if (userToDelete && userToDelete.rol_id === 1) {
            setErrorMessage("No puedes eliminar al superadmin.");
            return;
        }

        axiosInstance
            .delete(`/usuario/${id_usuario}`)
            .then(() => {
                setUsuarios(usuarios.filter(user => user.id_usuario !== id_usuario));
                setSuccessMessage('Usuario eliminado exitosamente.');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch((error) => {
                console.error("Error al eliminar usuario:", error);
                setErrorMessage("Error al eliminar el usuario.");
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

            {successMessage && (
                <div className="alert alert-success">
                    <span className="alert-icon">✓</span> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-error">
                    <span className="alert-icon">!</span> {errorMessage}
                </div>
            )}

            <div className="form-container">
                <form onSubmit={editUser ? handleEditUser : handleAddUser} className="user-form">
                    <h2>{editUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                    
                    <div className="input-group">
                        <input
                            type="text"
                            name="nombre"
                            value={editUser ? editUser.nombre : newUser.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                            className={errors.nombre ? 'input-error' : ''}
                            required
                        />
                        {errors.nombre && <div className="field-error">{errors.nombre}</div>}
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="text"
                            name="numerodoc"
                            value={editUser ? editUser.numerodoc : newUser.numerodoc}
                            onChange={handleChange}
                            placeholder="Número de Documento"
                            className={errors.numerodoc ? 'input-error' : ''}
                            required
                        />
                        {errors.numerodoc && <div className="field-error">{errors.numerodoc}</div>}
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="email"
                            name="correo"
                            value={editUser ? editUser.correo : newUser.correo}
                            onChange={handleChange}
                            placeholder="Correo Electrónico"
                            className={errors.correo ? 'input-error' : ''}
                            required
                        />
                        {errors.correo && <div className="field-error">{errors.correo}</div>}
                    </div>
                    
                    {!editUser && (
                        <div className="input-group">
                            <input
                                type="password"
                                name="contrasena"
                                value={newUser.contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña (8-16 caracteres alfanuméricos)"
                                className={errors.contrasena ? 'input-error' : ''}
                                required
                            />
                            {errors.contrasena && <div className="field-error">{errors.contrasena}</div>}
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