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
    const [errors, setErrors] = useState({});
    const [editProduct, setEditProduct] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Validation functions
    const validateNombre = (nombre) => {
        if (!nombre) return "El nombre es requerido";
        if (nombre.length > 30) return "Máximo 30 caracteres";
        return "";
    };

    const validatePrecio = (precio) => {
        if (!precio) return "El precio es requerido";
        if (!/^\d*\.?\d*$/.test(precio)) return "Solo números permitidos";
        if (precio.length > 10) return "Máximo 10 caracteres";
        return "";
    };

    const validateStock = (stock) => {
        if (!stock) return "El stock es requerido";
        if (!/^\d+$/.test(stock)) return "Solo números enteros permitidos";
        if (stock.length > 8) return "Máximo 8 caracteres";
        return "";
    };

    const validateForm = () => {
        const newErrors = {
            producto_nombre: validateNombre(newProduct.producto_nombre),
            producto_precio: validatePrecio(newProduct.producto_precio),
            producto_stock: validateStock(newProduct.producto_stock),
            descripcion: !newProduct.descripcion ? "La descripción es requerida" : "",
            categoria_id: !newProduct.categoria_id ? "La categoría es requerida" : "",
            producto_foto: !newProduct.producto_foto && !editProduct ? "La imagen es requerida" : ""
        };
        
        setErrors(newErrors);
        
        return !Object.values(newErrors).some(error => error !== "");
    };

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
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleFileChange = (e) => {
        setNewProduct(prev => ({
            ...prev,
            producto_foto: e.target.files[0]
        }));
        
        if (errors.producto_foto) {
            setErrors(prev => ({
                ...prev,
                producto_foto: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const formData = new FormData();
        formData.append('producto_nombre', newProduct.producto_nombre);
        formData.append('producto_precio', newProduct.producto_precio);
        formData.append('producto_stock', newProduct.producto_stock);
        formData.append('descripcion', newProduct.descripcion);
        formData.append('categoria_id', newProduct.categoria_id);
        
        // Only append file if it's a new file or new product
        if (newProduct.producto_foto instanceof File) {
            formData.append('producto_foto', newProduct.producto_foto);
        }

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
            resetForm();
        } catch (error) {
            console.error("Error al procesar el producto:", error.response || error);
            alert("Error al procesar el producto");
        }
    };

    const resetForm = () => {
        setNewProduct({
            producto_nombre: '',
            producto_precio: '',
            producto_stock: '',
            descripcion: '',
            producto_foto: null,
            categoria_id: ''
        });
        setEditProduct(null);
        setErrors({});
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
                
                {/* Nombre del Producto */}
                <div className="form-group">
                    <input
                        type="text"
                        name="producto_nombre"
                        value={newProduct.producto_nombre}
                        onChange={handleChange}
                        placeholder="Nombre del Producto"
                        maxLength="30"
                        className={errors.producto_nombre ? "error" : ""}
                    />
                    {errors.producto_nombre && <span className="error-message">{errors.producto_nombre}</span>}
                </div>
                
                {/* Precio del Producto */}
                <div className="form-group">
                    <input
                        type="text"
                        name="producto_precio"
                        value={newProduct.producto_precio}
                        onChange={handleChange}
                        placeholder="Precio"
                        maxLength="10"
                        className={errors.producto_precio ? "error" : ""}
                    />
                    {errors.producto_precio && <span className="error-message">{errors.producto_precio}</span>}
                </div>
                
                {/* Stock del Producto */}
                <div className="form-group">
                    <input
                        type="text"
                        name="producto_stock"
                        value={newProduct.producto_stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        maxLength="8"
                        className={errors.producto_stock ? "error" : ""}
                    />
                    {errors.producto_stock && <span className="error-message">{errors.producto_stock}</span>}
                </div>
                
                {/* Descripción del Producto */}
                <div className="form-group">
                    <textarea
                        name="descripcion"
                        value={newProduct.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción del producto"
                        className={errors.descripcion ? "error" : ""}
                        rows="3"
                    />
                    {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
                </div>
                
                {/* Imagen del Producto */}
                <div className="form-group">
                    <label className="file-upload-label">
                        {newProduct.producto_foto instanceof File 
                            ? newProduct.producto_foto.name 
                            : editProduct 
                                ? "Imagen actual seleccionada"
                                : "Seleccionar Imagen"}
                        <input
                            type="file"
                            name="producto_foto"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-upload-input"
                        />
                    </label>
                    {errors.producto_foto && <span className="error-message">{errors.producto_foto}</span>}
                </div>
                
                {/* Categoría */}
                <div className="form-group">
                    <select
                        name="categoria_id"
                        value={newProduct.categoria_id}
                        onChange={handleChange}
                        className={errors.categoria_id ? "error" : ""}
                    >
                        <option value="">Seleccionar Categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {editProduct ? "Actualizar Producto" : "Agregar Producto"}
                    </button>
                    {editProduct && (
                        <button type="button" className="cancel-btn" onClick={resetForm}>
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
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">{product.producto_nombre}</h3>
                                    <p className="product-description">
                                        {product.descripcion.length > 100
                                            ? `${product.descripcion.substring(0, 100)}...`
                                            : product.descripcion}
                                    </p>
                                    <p className="product-price">${product.producto_precio}</p>
                                    <p className="product-stock">
                                        {product.producto_stock > 0 
                                            ? `Stock: ${product.producto_stock}` 
                                            : "Sin stock"}
                                    </p>
                                    <p className="product-category">
                                        Categoría: {categorias.find(c => c.id_categoria === product.categoria_id)?.nombre || 'N/A'}
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