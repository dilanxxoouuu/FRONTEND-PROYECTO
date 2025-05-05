import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FiltroBusqueda.css";

const FiltroBusqueda = ({ showFilter, setShowFilter }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [inStock, setInStock] = useState(false);

    const [categories, setCategories] = useState([]);
    const [errorCategories, setErrorCategories] = useState("");
    const [loadingCategories, setLoadingCategories] = useState(true);

    const filterRef = useRef(null);
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("token");

    const fetchCategories = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const response = await axios.get("http://localhost:5000/categorias", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setCategories(response.data.map(c => ({ id: c.id_categoria, name: c.nombre })));
            } else {
                setErrorCategories("La respuesta de la API no es válida.");
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            setErrorCategories("Error al cargar categorías");
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Cierra el panel al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        if (showFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilter, setShowFilter]);

    const handleApplyFilters = () => {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("q", searchTerm);
        if (minPrice) queryParams.append("min_price", minPrice);
        if (maxPrice) queryParams.append("max_price", maxPrice);
        if (categoryId) queryParams.append("category_id", categoryId);
        if (inStock) queryParams.append("in_stock", "true");

        navigate(`/products?${queryParams.toString()}`);
        setShowFilter(false);
    };

    return (
        <>
            {showFilter && (
                <div className="filter-sidebar" ref={filterRef}>
                    <div className="filter-content">
                        <button className="close-filter-btn" onClick={() => setShowFilter(false)}>
                            X
                        </button>

                        <h3>Filtrar Productos</h3>

                        <div className="filter-item">
                            <label htmlFor="searchTerm">Buscar por nombre:</label>
                            <input
                                type="text"
                                id="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nombre del producto"
                            />
                        </div>

                        <div className="filter-item">
                            <label htmlFor="minPrice">Precio Mínimo:</label>
                            <input
                                type="number"
                                id="minPrice"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Precio mínimo"
                            />
                        </div>

                        <div className="filter-item">
                            <label htmlFor="maxPrice">Precio Máximo:</label>
                            <input
                                type="number"
                                id="maxPrice"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Precio máximo"
                            />
                        </div>

                        <div className="filter-item">
                            <label htmlFor="categoryId">Categoría:</label>
                            <select
                                id="categoryId"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label htmlFor="inStock">Solo productos en stock:</label>
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                            />
                        </div>

                        <button className="apply-filters-button" onClick={handleApplyFilters}>
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FiltroBusqueda;
