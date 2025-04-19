import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10); // Inicializa con 10 productos por página
    const location = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get("q");
        const minPrice = params.get("min_price");
        const maxPrice = params.get("max_price");
        const categoryId = params.get("category_id");
        const inStock = params.get("in_stock");
        return { searchTerm, minPrice, maxPrice, categoryId, inStock };
    };

    useEffect(() => {
        const updateProductsPerPage = () => {
            if (window.innerWidth <= 480) {
                setProductsPerPage(4);  // En pantallas pequeñas, 4 productos por página
            } else if (window.innerWidth <= 768) {
                setProductsPerPage(6);  // En pantallas medianas, 6 productos por página
            } else {
                setProductsPerPage(8); // En pantallas grandes, 10 productos por página
            }
        };

        updateProductsPerPage();  // Llama la función al iniciar

        window.addEventListener("resize", updateProductsPerPage);  // Actualiza el valor al redimensionar la ventana

        return () => window.removeEventListener("resize", updateProductsPerPage); // Limpieza del event listener
    }, []);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                const { searchTerm, minPrice, maxPrice, categoryId, inStock } = getQueryParams();
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token no disponible");
                    return;
                }

                let apiUrl = "http://localhost:5000/productos";
                const filterParams = [];

                if (searchTerm) filterParams.push(`q=${searchTerm}`);
                if (minPrice) filterParams.push(`min_price=${minPrice}`);
                if (maxPrice) filterParams.push(`max_price=${maxPrice}`);
                if (categoryId) filterParams.push(`category_id=${categoryId}`);
                if (inStock) filterParams.push(`in_stock=${inStock}`);

                if (filterParams.length > 0) {
                    apiUrl += `?${filterParams.join("&")}`;
                }

                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProducts(response.data);
            } catch (error) {
                console.error("Error al obtener los productos filtrados:", error);
            }
        };

        fetchFilteredProducts();
    }, [location.search]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("Token no disponible");
            return;
        }
    
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
                    {
                        id_producto: product.id_producto,
                        cantidad: updatedQuantity,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
    
                if (typeof addToCart === "function") {
                    addToCart(updateResponse.data);
                }
    
                toast.success(`${product.producto_nombre} cantidad aumentada al carrito 🛒`, {
                    className: "custom-toast",
                });
                console.log("Producto cantidad actualizada en el carrito:", updateResponse.data);
            } else {
                const agregarProductoResponse = await axios.put(
                    `http://localhost:5000/carrito/${carritoId}/producto`,
                    {
                        id_producto: product.id_producto,
                        cantidad: 1,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
    
                if (typeof addToCart === "function") {
                    addToCart(agregarProductoResponse.data);
                }
    
                toast.success(`${product.producto_nombre} agregado al carrito 🛒`, {
                    className: "custom-toast",
                });
                console.log("Producto agregado al carrito:", agregarProductoResponse.data);
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="products-container">
            <h1 className="products-title">Productos</h1>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                style={{ top: "-120px", right: "20px" }} // Asegúrate de que esté debajo del navbar
            />
            <div className="products-grid">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div key={product.id_producto} className="product-card">
                            <img
                                src={`http://localhost:5000/static/uploads/${product.producto_foto}`}
                                alt={product.producto_nombre}
                                className="product-image"
                            />
                            <h2 className="product-title">{product.producto_nombre}</h2>
                            <p className="product-description" title={product.descripcion}>
                                {product.descripcion.length > 120
                                    ? `${product.descripcion.slice(0, 120)}...`
                                    : product.descripcion}
                            </p>
                            <p className="product-price">
                                {product.producto_precio !== undefined && product.producto_precio !== null
                                    ? product.producto_precio.toFixed(0)
                                    : ""}
                            </p>
                            <p className="product-stock">
                                {product.producto_stock > 0
                                    ? `Stock: ${product.producto_stock}`
                                    : "Sin stock"}
                            </p>
                            <div className="product-footer">
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
                    <p>Sin stock de productos.</p>
                )}
            </div>

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
        </div>
    );
};

Products.defaultProps = {
    addToCart: () => {},
};

export default Products;
