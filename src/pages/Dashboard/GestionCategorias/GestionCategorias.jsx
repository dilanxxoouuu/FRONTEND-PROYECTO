import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionCategorias.css'; // Archivo de estilos

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]); // Lista de categorías
    const [newCategory, setNewCategory] = useState({ nombre: '' }); // Nueva categoría
    const [editCategory, setEditCategory] = useState(null); // Categoría en edición
    const navigate = useNavigate(); // Para navegación

    // Función para configurar el token en las solicitudes
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token'); // Recuperar el token desde el almacenamiento
        return { Authorization: `Bearer ${token}` };
    };

    // Obtener categorías desde la API
    const fetchCategories = () => {
        axios
            .get("http://127.0.0.1:5000/categorias", { headers: getAuthHeaders() })
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Error al obtener las categorías:", error));
    };

    useEffect(() => {
        fetchCategories(); // Cargar las categorías al inicio
    }, []);

    // Manejar la creación de una nueva categoría
    const handleAddCategory = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:5000/categorias", newCategory, { headers: getAuthHeaders() })
            .then((response) => {
                alert(response.data.mensaje);
                setNewCategory({ nombre: '' });
                // Volver a cargar todas las categorías para asegurarte de tener los datos más recientes
                fetchCategories();
            })
            .catch((error) => console.error("Error al agregar categoría:", error));
    };

    // Manejar la edición de una categoría
    const handleEditCategory = (e) => {
        e.preventDefault();
        if (editCategory) {
            axios
                .put(`http://127.0.0.1:5000/categoria/${editCategory.id_categoria}`, editCategory, { headers: getAuthHeaders() })
                .then(() => {
                    const updatedCategories = categorias.map(category =>
                        category.id_categoria === editCategory.id_categoria ? editCategory : category
                    );
                    setCategorias(updatedCategories);
                    setEditCategory(null); // Limpiar edición
                })
                .catch((error) => console.error("Error al editar categoría:", error));
        }
    };

    // Manejar cambios en formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editCategory) {
            setEditCategory(prev => ({ ...prev, [name]: value }));
        } else {
            setNewCategory(prev => ({ ...prev, [name]: value }));
        }
    };

    // Iniciar edición de categoría
    const startEditCategory = (category) => {
        setEditCategory(category);
    };

    // Eliminar una categoría
    const handleDeleteCategory = (id) => {
        axios
            .delete(`http://127.0.0.1:5000/categoria/${id}`, { headers: getAuthHeaders() })
            .then(() => {
                setCategorias(categorias.filter(category => category.id_categoria !== id));
            })
            .catch((error) => console.error("Error al eliminar categoría:", error));
    };

    return (
        <div className="gestion-categorias">
            <h1>Gestión de Categorías</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={fetchCategories}>
                    Refrescar Categorías
                </button>
            </div>

            <div className="form-container">
                <form onSubmit={editCategory ? handleEditCategory : handleAddCategory} className="category-form">
                    <h2>{editCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h2>
                    <div className="form-input-container">
                        <input
                            type="text"
                            name="nombre"
                            value={editCategory ? editCategory.nombre : newCategory.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de la Categoría"
                            required
                        />
                    </div>
                    <div className="form-button-container">
                        <button type="submit" className="submit-btn">
                            {editCategory ? 'Guardar Cambios' : 'Agregar'}
                        </button>
                        {editCategory && (
                            <button type="button" className="cancel-btn" onClick={() => setEditCategory(null)}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="category-list">
                <h2>Listado de Categorías</h2>
                {categorias.length === 0 ? (
                    <p className="no-categories">No hay categorías registradas</p>
                ) : (
                    <div className="category-grid">
                        {categorias.map(category => (
                            <div key={category.id_categoria} className="category-card">
                                <div className="category-header">
                                    <span className="category-id">ID: {category.id_categoria}</span>
                                </div>
                                <div className="category-body">
                                    <h3>{category.nombre}</h3>
                                </div>
                                <div className="category-footer">
                                    <button 
                                        onClick={() => startEditCategory(category)} 
                                        className="edit-btn"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteCategory(category.id_categoria)} 
                                        className="delete-btn"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionCategorias;