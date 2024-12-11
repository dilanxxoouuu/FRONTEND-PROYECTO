import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Número de productos por página

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtén el token de tu almacenamiento local
                
                if (!token) {
                    console.error("Token no disponible");
                    return;
                }

                const response = await axios.get("http://localhost:5000/productos", {
                    headers: { Authorization: `Bearer ${token}` }, // Agregar el token JWT en el encabezado
                });

                console.log("Productos cargados:", response.data);  // Verifica los productos
                setProducts(response.data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        fetchProducts();
    }, []);

    // Calcular los índices para la paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar de página
    const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

    // Generar número total de páginas
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="products-container">
            <h1 className="products-title">Productos</h1>

            <div className="products-grid">
                {currentProducts.map((product) => (
                    <div key={product.id_producto} className="product-card">
                        <img 
                            src={`http://localhost:5000/static/uploads/${product.producto_foto}`} 
                            alt={product.producto_nombre} 
                            className="product-image" 
                        />

                        <h2 className="product-title">{product.producto_nombre}</h2>

                        <p className="product-description">{product.descripcion}</p>
                        
                        <p className="product-price">
                            ${product.producto_precio !== undefined && product.producto_precio !== null
                                ? (product.producto_precio).toFixed(2) // Asumiendo que el precio se guarda en centavos, convertir a formato decimal
                                : "0.00"}
                        </p>
                        <button 
                            onClick={() => {
                                console.log('Producto agregado:', product); 
                                addToCart(product); 
                            }}
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                ))}
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

export default Products;
