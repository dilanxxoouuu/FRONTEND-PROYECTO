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
        producto_foto: null, // Cambiado a archivo
        categoria_id: '' // Campo para categoría
    }); // Datos del nuevo producto
    const [editProduct, setEditProduct] = useState(null); // Producto en edición
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

    // Obtener productos desde la API
    const refreshProducts = () => {
        axiosInstance
            .get("/productos")
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error al obtener los productos:", error));
    };

    // Usar el useEffect para cargar los productos al inicio
    useEffect(() => {
        refreshProducts(); // Cargar productos al inicio
    }, []);

    // Manejar la creación de un nuevo producto
    const handleAddProduct = (e) => {
        e.preventDefault();
    
        // Validar campos obligatorios
        const requiredFields = ["producto_nombre", "producto_precio", "producto_stock", "descripcion", "categoria_id"];
        for (const field of requiredFields) {
            if (!newProduct[field]) {
                alert(`El campo ${field} es obligatorio.`);
                return;
            }
        }
    
        const formData = new FormData();
        formData.append("producto_nombre", newProduct.producto_nombre);
        formData.append("producto_precio", newProduct.producto_precio);
        formData.append("producto_stock", newProduct.producto_stock);
        formData.append("descripcion", newProduct.descripcion);
        formData.append("categoria_id", newProduct.categoria_id);
        if (newProduct.producto_foto) {
            formData.append("producto_foto", newProduct.producto_foto);
        }
    
        // Realizar la solicitud sin especificar Content-Type
        axiosInstance
            .post("/productos", formData)
            .then(() => {
                refreshProducts();
                setNewProduct({
                    producto_nombre: '',
                    producto_precio: '',
                    producto_stock: '',
                    descripcion: '',
                    producto_foto: null,
                    categoria_id: ''
                });
                alert("Producto creado exitosamente");
            })
            .catch((error) => {
                console.error("Error al agregar producto:", error.response ? error.response.data : error.message);
                alert("Error al agregar producto");
            });
    };

    // Manejar cambios en formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Manejar el cambio en el campo de archivo (imagen)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: files[0] }));
    };

    // Manejar la eliminación de un producto
    const handleDeleteProduct = (id_producto) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            axiosInstance
                .delete(`/productos/${id_producto}`)
                .then(() => {
                    alert("Producto eliminado exitosamente");
                    refreshProducts();
                })
                .catch((error) => {
                    console.error("Error al eliminar producto:", error.response ? error.response.data : error.message);
                    alert("Error al eliminar producto");
                });
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
            producto_foto: null,  // No cargamos la foto para evitar que sea enviada
            categoria_id: product.categoria_id
        });
    };

    // Manejar la actualización de un producto
    const handleUpdateProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("producto_nombre", newProduct.producto_nombre);
        formData.append("producto_precio", newProduct.producto_precio);
        formData.append("producto_stock", newProduct.producto_stock);
        formData.append("descripcion", newProduct.descripcion);
        formData.append("categoria_id", newProduct.categoria_id);
        
        // No enviar foto si no se seleccionó una nueva
        if (newProduct.producto_foto) {
            formData.append("producto_foto", newProduct.producto_foto);
        }

        axiosInstance
            .put(`/productos/${editProduct.id_producto}`, formData)
            .then(() => {
                alert("Producto actualizado exitosamente");
                refreshProducts();
                setEditProduct(null); // Cerrar formulario de edición
                setNewProduct({
                    producto_nombre: '',
                    producto_precio: '',
                    producto_stock: '',
                    descripcion: '',
                    producto_foto: null,
                    categoria_id: ''
                });
            })
            .catch((error) => {
                console.error("Error al actualizar producto:", error.response ? error.response.data : error.message);
                alert("Error al actualizar producto");
            });
    };

    return (
        <div className="gestion-productos">
            <h1>Gestión de Productos</h1>

            {/* Botón para regresar al Dashboard */}
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                Regresar al Dashboard
            </button>

            {/* Botón para refrescar los productos */}
            <button className="refresh-btn" onClick={refreshProducts}>
                Refrescar Productos
            </button>

            {/* Formulario de agregar o editar producto */}
            <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="product-form">
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
                {/* Solo incluir el campo de archivo si estamos agregando un nuevo producto */}
                {!editProduct && (
                    <input
                        type="file"
                        name="producto_foto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                )}
                <input
                    type="number"
                    name="categoria_id"
                    value={newProduct.categoria_id}
                    onChange={handleChange}
                    placeholder="Categoría ID"
                    required
                />
                <button type="submit">{editProduct ? "Actualizar Producto" : "Agregar Producto"}</button>
            </form>

            <div className="product-list">
                <h2>Productos</h2>
                <ul>
                    {productos.map((product) => (
                        <li key={product.id_producto} className="product-item">
                            <div className="product-info">
                                <p>{product.producto_nombre} - ${product.producto_precio} - Stock: {product.producto_stock}</p>
                                <p>{product.descripcion}</p>
                                {product.producto_foto && <img src={`http://127.0.0.1:5000/static/uploads/${product.producto_foto}`} alt={product.producto_nombre} />}
                            </div>
                            <button onClick={() => handleEditProduct(product)} className="edit-btn">Editar</button>
                            <button onClick={() => handleDeleteProduct(product.id_producto)} className="delete-btn">Eliminar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GestionProductos;
