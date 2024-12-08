import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css'; // Archivo de estilos

const GestionProductos = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [newProduct, setNewProduct] = useState({ name: '', price: '' }); // Datos del nuevo producto
    const [editProduct, setEditProduct] = useState(null); // Producto en edición
    const navigate = useNavigate(); // Para navegación

    // Obtener productos desde la API
    useEffect(() => {
        axios
            .get("https://api.escuelajs.co/api/v1/products")
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error al obtener los productos:", error));
    }, []);

    // Manejar la creación de un nuevo producto
    const handleAddProduct = (e) => {
        e.preventDefault();
        axios
            .post("https://api.escuelajs.co/api/v1/products", newProduct)
            .then((response) => {
                setProductos([...productos, response.data]);
                setNewProduct({ name: '', price: '' });
            })
            .catch((error) => console.error("Error al agregar producto:", error));
    };

    // Manejar la edición de un producto
    const handleEditProduct = (e) => {
        e.preventDefault();
        if (editProduct) {
            axios
                .put(`https://api.escuelajs.co/api/v1/products/${editProduct.id}`, editProduct)
                .then((response) => {
                    const updatedProducts = productos.map(product => product.id === editProduct.id ? response.data : product);
                    setProductos(updatedProducts);
                    setEditProduct(null);
                })
                .catch((error) => console.error("Error al editar producto:", error));
        }
    };

    // Manejar cambios en formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            setEditProduct(prev => ({ ...prev, [name]: value }));
        } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    // Iniciar edición de producto
    const startEditProduct = (product) => {
        setEditProduct(product);
    };

    // Eliminar un producto
    const handleDeleteProduct = (id) => {
        axios
            .delete(`https://api.escuelajs.co/api/v1/products/${id}`)
            .then(() => {
                setProductos(productos.filter(product => product.id !== id));
            })
            .catch((error) => console.error("Error al eliminar producto:", error));
    };

    return (
        <div className="gestion-productos">
            <h1>Gestión de Productos</h1>

            {/* Botón para regresar al Dashboard */}
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                Regresar al Dashboard
            </button>

            <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} className="product-form">
                <h2>{editProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
                <input
                    type="text"
                    name="name"
                    value={editProduct ? editProduct.name : newProduct.name}
                    onChange={handleChange}
                    placeholder="Nombre del Producto"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={editProduct ? editProduct.price : newProduct.price}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <button type="submit">{editProduct ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>

            <div className="product-list">
                <h2>Productos</h2>
                <ul>
                    {productos.map(product => (
                        <li key={product.id} className="product-item">
                            <div className="product-info">
                                <p>{product.name} - ${product.price}</p>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => startEditProduct(product)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionProductos;
