import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css';

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [newProduct, setNewProduct] = useState({
        producto_nombre: '',
        producto_precio: '',
        producto_stock: '',
        descripcion: '',
        producto_foto: null,
        categoria_id: ''
    });
    const [editProduct, setEditProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const refreshProducts = async () => {
        try {
            const productosResponse = await axiosInstance.get("/productos");
            setProductos(productosResponse.data);

            const categoriasResponse = await axiosInstance.get("/categorias");
            setCategorias(categoriasResponse.data);
        } catch (error) {
            console.error("Error al obtener los productos o categorías:", error);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const handleDeleteProduct = async (id_producto) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await axiosInstance.delete(`/productos/${id_producto}`);
                refreshProducts();
                alert("Producto eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("Error al eliminar producto");
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProduct({
            producto_nombre: product.producto_nombre,
            producto_precio: product.producto_precio,
            producto_stock: product.producto_stock,
            descripcion: product.descripcion,
            producto_foto: product.producto_foto,
            categoria_id: product.categoria_id
        });
    };

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewProduct({ ...newProduct, producto_foto: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            formData.append(key, newProduct[key]);
        });

        try {
            if (editProduct) {
                await axiosInstance.put(`/productos/${editProduct.id_producto}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Producto actualizado exitosamente");
            } else {
                await axiosInstance.post("/productos", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Producto agregado exitosamente");
            }
            refreshProducts();
            setNewProduct({
                producto_nombre: '',
                producto_precio: '',
                producto_stock: '',
                descripcion: '',
                producto_foto: null,
                categoria_id: ''
            });
            setEditProduct(null);
        } catch (error) {
            console.error("Error al procesar el producto:", error.response || error);
            alert("Error al procesar el producto");
        }
    };

    return (
        <div className="gestion-productos">
            <h1>Gestión de Productos</h1>
            <div className="action-buttons">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={refreshProducts}>
                    Refrescar Productos
                </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <h2>{editProduct ? "Editar Producto" : "Agregar Producto"}</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="producto_nombre"
                        value={newProduct.producto_nombre}
                        onChange={handleChange}
                        placeholder="Nombre del Producto"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="producto_precio"
                        value={newProduct.producto_precio}
                        onChange={handleChange}
                        placeholder="Precio"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="producto_stock"
                        value={newProduct.producto_stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="descripcion"
                        value={newProduct.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        name="producto_foto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <select
                        name="categoria_id"
                        value={newProduct.categoria_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar Categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.id_categoria} - {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {editProduct ? "Actualizar Producto" : "Agregar Producto"}
                    </button>
                    {editProduct && (
                        <button type="button" className="cancel-btn" onClick={() => setEditProduct(null)}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="products-list">
                <h2>Listado de Productos</h2>
                {productos.length === 0 ? (
                    <p className="no-products">No hay productos registrados</p>
                ) : (
                    <div className="products-grid">
                        {productos.map((product) => (
                            <div key={product.id_producto} className="product-card">
                                <div className="product-image-container">
                                    <img
                                        src={`http://localhost:5000/static/uploads/${product.producto_foto}`}
                                        alt={product.producto_nombre}
                                        className="product-image"
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">{product.producto_nombre}</h3>
                                    <p className="product-description">
                                        {product.descripcion.length > 100
                                            ? `${product.descripcion.slice(0, 100)}...`
                                            : product.descripcion}
                                    </p>
                                    <p className="product-price">${product.producto_precio}</p>
                                    <p className="product-stock">
                                        {product.producto_stock > 0 ? `Stock: ${product.producto_stock}` : "Sin stock"}
                                    </p>
                                </div>
                                <div className="product-actions">
                                    <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                                        Editar
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteProduct(product.id_producto)}>
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

export default GestionProductos;