import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GestionProductos.css'; // Archivo de estilos

const GestionProductos = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [categorias, setCategorias] = useState([]); // Lista de categorías
    const [newProduct, setNewProduct] = useState({
        producto_nombre: '',
        producto_precio: '',
        producto_stock: '',
        descripcion: '',
        producto_foto: null, // Cambiado a archivo
        categoria_id: '' // Campo para categoría
    }); // Datos del nuevo producto
    const [editProduct, setEditProduct] = useState(null); // Producto en edición
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Número de productos por página
    const navigate = useNavigate(); // Para navegación

    // Obtener el token del almacenamiento local (localStorage)
    const token = localStorage.getItem("token");

    // Configuración de Axios para incluir el token en todas las solicitudes
    const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:5000", // URL base de tu API
        headers: {
            Authorization: `Bearer ${token}`, // Incluir el token JWT en las cabeceras
        },
    });

    // Obtener productos y categorías desde la API
    const refreshProducts = async () => {
        try {
            const productosResponse = await axiosInstance.get("/productos");
            setProductos(productosResponse.data);

            const categoriasResponse = await axiosInstance.get("/categorias"); // Asegúrate que la ruta es la correcta
            setCategorias(categoriasResponse.data);
        } catch (error) {
            console.error("Error al obtener los productos o categorías:", error);
        }
    };

    // Usar el useEffect para cargar los productos y categorías al inicio
    useEffect(() => {
        refreshProducts(); // Cargar productos y categorías al inicio
    }, []);

    // Manejar la eliminación de un producto
    const handleDeleteProduct = async (id_producto) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await axiosInstance.delete(`/productos/${id_producto}`);
                refreshProducts(); // Refrescar productos después de eliminar
                alert("Producto eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("Error al eliminar producto");
            }
        }
    };

    // Manejar la edición de un producto
    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProduct({
            producto_nombre: product.producto_nombre,
            producto_precio: product.producto_precio,
            producto_stock: product.producto_stock,
            descripcion: product.descripcion,
            producto_foto: product.producto_foto, // Mantener la imagen existente
            categoria_id: product.categoria_id
        });
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Manejar cambios en el archivo
    const handleFileChange = (e) => {
        setNewProduct({ ...newProduct, producto_foto: e.target.files[0] });
    };

    // Manejar el envío del formulario para agregar o editar producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            formData.append(key, newProduct[key]);
        });

        // Log de FormData
        formData.forEach((value, key) => {
            console.log(key, value);
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
            <center>
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    Regresar al Dashboard
                </button>
                <button className="refresh-btn" onClick={refreshProducts}>
                    Refrescar Productos
                </button>
            </center>

            {/* Formulario de agregar o editar producto */}
            <form onSubmit={handleSubmit} className="product-form">
                <h2>{editProduct ? "Editar Producto" : "Agregar Producto"}</h2>
                <input
                    type="text"
                    name="producto_nombre"
                    value={newProduct.producto_nombre}
                    onChange={handleChange}
                    placeholder="Nombre del Producto"
                    required
                />
                <input
                    type="number"
                    name="producto_precio"
                    value={newProduct.producto_precio}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <input
                    type="number"
                    name="producto_stock"
                    value={newProduct.producto_stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                />
                <input
                    type="text"
                    name="descripcion"
                    value={newProduct.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                />
                <input
                    type="file"
                    name="producto_foto"
                    onChange={handleFileChange}
                    accept="image/*"
                />

                {/* Selección de Categoría */}
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

                <button type="submit">
                    {editProduct ? "Editar Producto" : "Agregar Producto"}
                </button>
            </form>

            {/* Mostrar productos */}
            <div className="products-container">
                <h2 className="products-title">Lista de Productos</h2>
                <div className="products-grid">
                    {productos.map((product) => (
                        <div key={product.id_producto} className="product-card">
                            <img
                                src={`http://localhost:5000/static/uploads/${product.producto_foto}`}
                                alt={product.producto_nombre}
                                className="product-image"
                            />
                            <h2 className="product-title">{product.producto_nombre}</h2>
                            <p
                            className="product-description"
                            title={product.descripcion}
                            >
                            {product.descripcion.length > 100
                                ? `${product.descripcion.slice(0, 100)}...`
                                : product.descripcion}
                            </p>
                            <p className="product-price">${product.producto_precio}</p>
                            <p className="product-stock">
                                {product.producto_stock > 0 ? `Stock: ${product.producto_stock}` : "Sin stock"}
                            </p>
                            <button className="edit-btn" onClick={() => handleEditProduct(product)}>Editar</button>
                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.id_producto)}>Eliminar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GestionProductos;
