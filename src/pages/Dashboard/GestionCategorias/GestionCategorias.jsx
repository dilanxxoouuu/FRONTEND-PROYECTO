import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionCategorias.css'; // Archivo de estilos

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]); // Lista de categorías
    const [newCategory, setNewCategory] = useState({ name: '' }); // Nueva categoría
    const [editCategory, setEditCategory] = useState(null); // Categoría en edición
    const navigate = useNavigate(); // Para navegación

    // Obtener categorías desde la API
    useEffect(() => {
        axios
            .get("https://api.escuelajs.co/api/v1/categories")
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Error al obtener las categorías:", error));
    }, []);

    // Manejar la creación de una nueva categoría
    const handleAddCategory = (e) => {
        e.preventDefault();
        axios
            .post("https://api.escuelajs.co/api/v1/categories", newCategory)
            .then((response) => {
                setCategorias([...categorias, response.data]);
                setNewCategory({ name: '' });
            })
            .catch((error) => console.error("Error al agregar categoría:", error));
    };

    // Manejar la edición de una categoría
    const handleEditCategory = (e) => {
        e.preventDefault();
        if (editCategory) {
            axios
                .put(`https://api.escuelajs.co/api/v1/categories/${editCategory.id}`, editCategory)
                .then((response) => {
                    const updatedCategories = categorias.map(category => category.id === editCategory.id ? response.data : category);
                    setCategorias(updatedCategories);
                    setEditCategory(null);
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
            .delete(`https://api.escuelajs.co/api/v1/categories/${id}`)
            .then(() => {
                setCategorias(categorias.filter(category => category.id !== id));
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

            <form onSubmit={editCategory ? handleEditCategory : handleAddCategory} className="category-form">
                <h2>{editCategory ? 'Editar Categoría' : 'Agregar Categoría'}</h2>
                <input
                    type="text"
                    name="name"
                    value={editCategory ? editCategory.name : newCategory.name}
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
                        <li key={category.id} className="category-item">
                            <div className="category-info">
                                <p>{category.name}</p>
                            </div>
                            <div className="category-actions">
                                <button onClick={() => startEditCategory(category)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteCategory(category.id)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionCategorias;
