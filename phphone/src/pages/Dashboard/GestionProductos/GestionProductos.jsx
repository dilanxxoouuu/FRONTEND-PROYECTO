import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css'; // Archivo de estilos

const GestionProductos = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [newProduct, setNewProduct] = useState({
        producto_nombre: '',
        producto_precio: '',
        producto_stock: '',
        descripcion: '',
        producto_foto: '',
        categoria_id: '' // Campo para categoría
    }); // Datos del nuevo producto
    const [editProduct, setEditProduct] = useState(null); // Producto en edición
    const navigate = useNavigate(); // Para navegación

    // Obtener productos desde la API
    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/productos")
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error al obtener los productos:", error));
    }, []);

    // Manejar la creación de un nuevo producto
    const handleAddProduct = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:5000/productos", newProduct) // Enviar los datos del nuevo producto
            .then((response) => {
                // Suponemos que la respuesta incluye el nuevo producto
                setProductos([...productos, response.data]);  // Agregar el producto a la lista
                setNewProduct({
                    producto_nombre: '',
                    producto_precio: '',
                    producto_stock: '',
                    descripcion: '',
                    producto_foto: '',
                    categoria_id: '' // Limpiar también el campo de categoría
                });
                alert("Producto creado exitosamente");
            })
            .catch((error) => {
                console.error("Error al agregar producto:", error);
                alert("Error al agregar producto");
            });
    };

    // Manejar la edición de un producto
    const handleEditProduct = (e) => {
        e.preventDefault();
        if (editProduct) {
            axios
                .put(`http://127.0.0.1:5000/producto/${editProduct.id_producto}`, editProduct)
                .then((response) => {
                    const updatedProducts = productos.map(product =>
                        product.id_producto === editProduct.id_producto ? response.data : product
                    );
                    setProductos(updatedProducts);
                    setEditProduct(null); // Limpiar edición
                    alert("Producto actualizado exitosamente");
                })
                .catch((error) => {
                    console.error("Error al editar producto:", error);
                    alert("Error al editar producto");
                });
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
            .delete(`http://127.0.0.1:5000/producto/${id}`)
            .then(() => {
                setProductos(productos.filter(product => product.id_producto !== id));
                alert("Producto eliminado");
            })
            .catch((error) => {
                console.error("Error al eliminar producto:", error);
                alert("Error al eliminar producto");
            });
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
                    name="producto_nombre"
                    value={editProduct ? editProduct.producto_nombre : newProduct.producto_nombre}
                    onChange={handleChange}
                    placeholder="Nombre del Producto"
                    required
                />
                <input
                    type="number"
                    name="producto_precio"
                    value={editProduct ? editProduct.producto_precio : newProduct.producto_precio}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <input
                    type="number"
                    name="producto_stock"
                    value={editProduct ? editProduct.producto_stock : newProduct.producto_stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                />
                <input
                    type="text"
                    name="descripcion"
                    value={editProduct ? editProduct.descripcion : newProduct.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                />
                <input
                    type="text"
                    name="producto_foto"
                    value={editProduct ? editProduct.producto_foto : newProduct.producto_foto}
                    onChange={handleChange}
                    placeholder="URL de la Foto"
                />
                <input
                    type="number"
                    name="categoria_id"
                    value={editProduct ? editProduct.categoria_id : newProduct.categoria_id}
                    onChange={handleChange}
                    placeholder="Categoría ID"
                    required
                />
                <button type="submit">{editProduct ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>

            <div className="product-list">
                <h2>Productos</h2>
                <ul>
                    {productos.map(product => (
                        <li key={product.id_producto} className="product-item">
                            <div className="product-info">
                                <p>{product.producto_nombre} - ${product.producto_precio} - Stock: {product.producto_stock}</p>
                                <p>{product.descripcion}</p>
                                {product.producto_foto && <img src={product.producto_foto} alt={product.producto_nombre} />}
                            </div>
                            <div className="product-actions">
                                <button onClick={() => startEditProduct(product)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDeleteProduct(product.id_producto)} className="delete-btn">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionProductos;
