import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionCategorias.css';

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [newCategory, setNewCategory] = useState({ nombre: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchData = async () => {
        try {
            const [categoriasRes, productosRes] = await Promise.all([
                axios.get("http://127.0.0.1:5000/categorias", { headers: getAuthHeaders() }),
                axios.get("http://127.0.0.1:5000/productos", { headers: getAuthHeaders() })
            ]);
            setCategorias(categoriasRes.data);
            setProductos(productosRes.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Función para contar productos por categoría
    const countProductsByCategory = (categoryId) => {
        return productos.filter(producto => producto.categoria_id === categoryId).length;
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        setError('');
        axios
            .post("http://127.0.0.1:5000/categorias", newCategory, { headers: getAuthHeaders() })
            .then((response) => {
                alert(response.data.mensaje);
                setNewCategory({ nombre: '' });
                fetchData();
            })
            .catch((error) => {
                console.error("Error al agregar categoría:", error);
                setError("Error al agregar categoría");
            });
    };

    const handleEditCategory = (e) => {
        e.preventDefault();
        setError('');
        if (editCategory) {
            axios
                .put(`http://127.0.0.1:5000/categoria/${editCategory.id_categoria}`, editCategory, { headers: getAuthHeaders() })
                .then(() => {
                    const updatedCategories = categorias.map(category =>
                        category.id_categoria === editCategory.id_categoria ? editCategory : category
                    );
                    setCategorias(updatedCategories);
                    setEditCategory(null);
                })
                .catch((error) => {
                    console.error("Error al editar categoría:", error);
                    setError("Error al editar categoría");
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editCategory) {
            setEditCategory(prev => ({ ...prev, [name]: value }));
        } else {
            setNewCategory(prev => ({ ...prev, [name]: value }));
        }
    };

    const startEditCategory = (category) => {
        setEditCategory(category);
    };

    const handleDeleteCategory = (id) => {
        const productCount = countProductsByCategory(id);
        
        if (productCount > 0) {
            setError(`No se puede eliminar: Hay ${productCount} producto(s) asociado(s)`);
            return;
        }

        if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
            axios
                .delete(`http://127.0.0.1:5000/categoria/${id}`, { headers: getAuthHeaders() })
                .then(() => {
                    setCategorias(categorias.filter(category => category.id_categoria !== id));
                })
                .catch((error) => {
                    console.error("Error al eliminar categoría:", error);
                    setError("Error al eliminar categoría");
                });
        }
    };

    return (
        <div className="gestion-categorias">
            <h1>Gestión de Categorías</h1>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={fetchData}>
                    Refrescar Datos
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

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
                        {categorias.map(category => {
                            const productCount = countProductsByCategory(category.id_categoria);
                            return (
                                <div key={category.id_categoria} className="category-card">
                                    <div className="category-header">
                                        <span className="category-id">ID: {category.id_categoria}</span>
                                        {productCount > 0 && (
                                            <span className="product-count-badge">
                                                {productCount} producto(s)
                                            </span>
                                        )}
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
                                            disabled={productCount > 0}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionCategorias;