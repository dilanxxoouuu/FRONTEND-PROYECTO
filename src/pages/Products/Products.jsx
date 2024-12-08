import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Número de productos por página

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://api.escuelajs.co/api/v1/products");
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
                    <div key={product.id} className="product-card">
                        <img src={product.images[0]} alt={product.title} className="product-image" />
                        <h2 className="product-title">{product.title}</h2>
                        <p className="product-price">${product.price.toFixed(2)}</p>
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
