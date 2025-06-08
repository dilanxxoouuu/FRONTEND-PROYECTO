import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionCategorias.css';

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [newCategory, setNewCategory] = useState({ nombre: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const addNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchData = async () => {
        try {
            const [categoriasRes, productosRes] = await Promise.all([
                axios.get("https://backenddespliegue-production.up.railway.app/categorias", { headers: getAuthHeaders() }),
                axios.get("https://backenddespliegue-production.up.railway.app/productos", { headers: getAuthHeaders() })
            ]);
            setCategorias(categoriasRes.data);
            setProductos(productosRes.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            addNotification("Error al cargar los datos", "error");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const countProductsByCategory = (categoryId) => (
        productos.filter(producto => producto.categoria_id === categoryId).length
    );

    const validateCategory = (categoryName) => {
        if (!categoryName || categoryName.trim() === '') {
            addNotification('El nombre de la categoría no puede estar vacío', 'error');
            return false;
        }
        
        if (categoryName !== categoryName.trimStart()) {
            addNotification('El nombre no puede comenzar con espacios', 'error');
            return false;
        }
        
        const normalizedInput = categoryName.trim().toLowerCase();
        const exists = categorias.some(cat => 
            cat.nombre.trim().toLowerCase() === normalizedInput && 
            (!editCategory || cat.id_categoria !== editCategory.id_categoria)
        );
        
        if (exists) {
            addNotification('Ya existe una categoría con ese nombre', 'error');
            return false;
        }
        
        return true;
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!validateCategory(newCategory.nombre)) return;
        
        axios.post("https://backenddespliegue-production.up.railway.app/categorias", { nombre: newCategory.nombre.trim() }, { headers: getAuthHeaders() })
            .then((response) => {
                addNotification(response.data.mensaje);
                setNewCategory({ nombre: '' });
                fetchData();
            })
            .catch((error) => {
                console.error("Error al agregar categoría:", error);
                addNotification("Error al agregar categoría", "error");
            });
    };

    const handleEditCategory = (e) => {
        e.preventDefault();
        if (!editCategory || !validateCategory(editCategory.nombre)) return;
        
        axios.put(`https://backenddespliegue-production.up.railway.app/categoria/${editCategory.id_categoria}`, 
                 { nombre: editCategory.nombre.trim() }, 
                 { headers: getAuthHeaders() })
            .then(() => {
                addNotification("Categoría actualizada correctamente");
                setCategorias(categorias.map(c => 
                    c.id_categoria === editCategory.id_categoria ? 
                    { ...editCategory, nombre: editCategory.nombre.trim() } : c
                ));
                setEditCategory(null);
            })
            .catch((error) => {
                console.error("Error al editar categoría:", error);
                addNotification("Error al editar categoría", "error");
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        editCategory 
            ? setEditCategory(prev => ({ ...prev, [name]: value }))
            : setNewCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteCategory = (id) => {
        const productCount = countProductsByCategory(id);
        if (productCount > 0) {
            addNotification(`No se puede eliminar: Hay ${productCount} producto(s) asociado(s)`, "warning");
            return;
        }

        if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
            axios.delete(`https://backenddespliegue-production.up.railway.app/categoria/${id}`, { headers: getAuthHeaders() })
                .then(() => {
                    addNotification("Categoría eliminada correctamente");
                    setCategorias(categorias.filter(c => c.id_categoria !== id));
                })
                .catch((error) => {
                    console.error("Error al eliminar categoría:", error);
                    addNotification("Error al eliminar categoría", "error");
                });
        }
    };

    return (
        <div className="gestion-categorias">
            <h1>Gestión de Categorías</h1>

            <div className="notifications-container">
                {notifications.map((n) => (
                    <div key={n.id} className={`notification ${n.type}`} onClick={() => removeNotification(n.id)}>
                        {n.message}
                    </div>
                ))}
            </div>

            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>Regresar al Dashboard</button>
                <button className="refresh-btn" onClick={fetchData}>Refrescar Datos</button>
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
                        {categorias.map(c => {
                            const productCount = countProductsByCategory(c.id_categoria);
                            return (
                                <div key={c.id_categoria} className="category-card">
                                    <div className="category-header">
                                        <span className="category-id">ID: {c.id_categoria}</span>
                                        {productCount > 0 && (
                                            <span className="product-count-badge">
                                                {productCount} producto(s)
                                            </span>
                                        )}
                                    </div>
                                    <div className="category-body">
                                        <h3>{c.nombre}</h3>
                                    </div>
                                    <div className="category-pie">
                                        <button onClick={() => setEditCategory(c)} className="edit-btn">
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCategory(c.id_categoria)} 
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