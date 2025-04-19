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
                alert(response.data.mensaje); // Mensaje de confirmación
                setCategorias([...categorias, { id_categoria: response.data.id_categoria, ...newCategory }]);
                setNewCategory({ nombre: '' }); // Limpiar formulario
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

            {/* Botón para regresar al Dashboard */}
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                Regresar al Dashboard
            </button>

            {/* Botón para refrescar categorías */}
            <button className="refresh-btn" onClick={fetchCategories}>
                Refrescar Categorías
            </button>

            <form onSubmit={editCategory ? handleEditCategory : handleAddCategory} className="category-form">
                <h2>{editCategory ? 'Editar Categoría' : 'Agregar Categoría'}</h2>
                <input
                    type="text"
                    name="nombre"
                    value={editCategory ? editCategory.nombre : newCategory.nombre}
                    onChange={handleChange}
                    placeholder="Nombre de la Categoría"
                    required
                />
                <button type="submit">{editCategory ? 'Actualizar Categoría' : 'Agregar Categoría'}</button>
            </form>

            <div className="category-list">
                <h2>Categorías</h2>
                <ul>
                    {categorias.map(category => (
                        <li key={category.id_categoria} className="category-item">
                            <div className="category-info">
                                <p><strong>ID:</strong> {category.id_categoria}</p>
                                <p><strong>Nombre:</strong> {category.nombre}</p>
                            </div>
                            <div className="category-actions">
                                <button onClick={() => startEditCategory(category)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteCategory(category.id_categoria)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionCategorias;
