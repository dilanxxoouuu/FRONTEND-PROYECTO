import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";
import { IoMdFlash } from "react-icons/io";
import "./Products.css";

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [isChrome, setIsChrome] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();

    const addNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            searchTerm: params.get("q"),
            minPrice: params.get("min_price"),
            maxPrice: params.get("max_price"),
            categoryId: params.get("category_id"),
            inStock: params.get("in_stock")
        };
    };

    useEffect(() => {
        if (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1) {
            setIsChrome(true);
        }

        const updateProductsPerPage = () => {
            if (window.innerWidth <= 480) setProductsPerPage(4);
            else if (window.innerWidth <= 768) setProductsPerPage(6);
            else setProductsPerPage(8);
        };

        updateProductsPerPage();
        window.addEventListener("resize", updateProductsPerPage);
        return () => window.removeEventListener("resize", updateProductsPerPage);
    }, []);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                const { searchTerm, minPrice, maxPrice, categoryId, inStock } = getQueryParams();
                const token = localStorage.getItem("token");
                if (!token) return console.error("Token no disponible");

                let apiUrl = "http://localhost:5000/productos";
                const filterParams = [];
                if (searchTerm) filterParams.push(`q=${searchTerm}`);
                if (minPrice) filterParams.push(`min_price=${minPrice}`);
                if (maxPrice) filterParams.push(`max_price=${maxPrice}`);
                if (categoryId) filterParams.push(`category_id=${categoryId}`);
                if (inStock) filterParams.push(`in_stock=${inStock}`);
                if (filterParams.length > 0) apiUrl += `?${filterParams.join("&")}`;

                const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
                setProducts(response.data);
            } catch (error) {
                console.error("Error al obtener los productos filtrados:", error);
                addNotification("Error al cargar los productos", "error");
            }
        };
        fetchFilteredProducts();
    }, [location.search]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("Token no disponible");

        try {
            const carritoResponse = await axios.get('http://localhost:5000/carrito/activo', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const carritoId = carritoResponse.data.id_carrito;
            const existingProduct = carritoResponse.data.productos.find(item => item.id_producto === product.id_producto);

            if (existingProduct) {
                const updatedQuantity = existingProduct.cantidad + 1;
                const updateResponse = await axios.put(
                    `http://localhost:5000/carrito/${carritoId}/producto`,
                    { id_producto: product.id_producto, cantidad: updatedQuantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (typeof addToCart === "function") addToCart(updateResponse.data);
                addNotification(`${product.producto_nombre} cantidad aumentada al carrito 🛒`);
            } else {
                const agregarProductoResponse = await axios.put(
                    `http://localhost:5000/carrito/${carritoId}/producto`,
                    { id_producto: product.id_producto, cantidad: 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (typeof addToCart === "function") addToCart(agregarProductoResponse.data);
                addNotification(`${product.producto_nombre} agregado al carrito 🛒`);
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error.response ? error.response.data : error.message);
            addNotification("Error al agregar producto al carrito", "error");
        }
    };

    return (
        <div className="products-container">
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <div key={notification.id} className={`notification ${notification.type}`}
                        onClick={() => removeNotification(notification.id)}>
                        {notification.message}
                    </div>
                ))}
            </div>

            <div className="products-header">
                <h1 className="products-title">PhPhone</h1>
                <p className="products-subtitle">Los mejores productos tecnológicos al mejor precio</p>
            </div>

            <div className={`products-grid ${isChrome ? 'chrome-grid' : ''}`}>
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div key={product.id_producto} className="product-card">
                            {product.producto_stock <= 10 && product.producto_stock > 0 && (
                                <div className="product-badge">
                                    <IoMdFlash className="flash-icon" />
                                    <span>Últimas unidades!</span>
                                </div>
                            )}
                            <div className="product-image-container">
                                <img
                                    src={`http://localhost:5000/static/uploads/${product.producto_foto}`}
                                    alt={product.producto_nombre}
                                    className="product-image"
                                />
                            </div>
                            <div className="product-info">
                                <h2 className="product-title">{product.producto_nombre}</h2>
                                <p className="product-description" title={product.descripcion}>
                                    {product.descripcion.length > 100
                                        ? `${product.descripcion.slice(0, 100)}...`
                                        : product.descripcion}
                                </p>
                                <div className="product-price-container">
                                    {product.discount > 0 && (
                                        <span className="product-original-price">
                                            ${(product.producto_precio * 1.2).toLocaleString('es-CL')}
                                        </span>
                                    )}
                                    <p className="product-price">
                                        {product.producto_precio !== undefined && product.producto_precio !== null
                                            ? `$${product.producto_precio.toLocaleString('es-CL')}`
                                            : ""}
                                    </p>
                                    {product.discount > 0 && (
                                        <span className="product-discount">-{product.discount}%</span>
                                    )}
                                </div>
                            </div>
                            <div className="product-pie">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.producto_stock <= 0}
                                    className="add-to-cart-button"
                                >
                                    {product.producto_stock > 0 ? (
                                        <>
                                            <FaShoppingCart size={16} style={{ marginRight: "6px" }} />
                                            Agregar al Carrito
                                        </>
                                    ) : (
                                        "Agotado"
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-products">Debes de iniciar sesión para ver todos los productos.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePagination(number)}
                            className={`pagination-button ${currentPage === number ? "active" : ""}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

Products.defaultProps = { addToCart: () => { } };
export default Products;