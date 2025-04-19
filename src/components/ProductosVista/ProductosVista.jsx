import React, { useState, useEffect } from 'react';
import './ProductosVista.css';
// Componente para visualizar detalles de un producto
const ProductDetail = ({ match }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Simulación de llamada al backend
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Suponiendo que la API nos devuelve un producto con un id
                const response = await fetch(`https://api.ejemplo.com/products/${match.params.id}`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data);
                } else {
                    setError('Error al cargar el producto');
                }
            } catch (err) {
                setError('Error en la conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [match.params.id]);

    // Función para añadir al carrito
    const addToCart = () => {
        // Aquí podrías guardar el producto en un estado global, o en el localStorage, por ejemplo
        console.log(`Añadido al carrito: ${product.name}, Cantidad: ${quantity}`);
    };

    // Manejo de cambios en la cantidad
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Si estamos cargando, mostramos un mensaje
    if (loading) return <p>Cargando producto...</p>;

    // Si hay error, mostramos el mensaje de error
    if (error) return <p>{error}</p>;

    // Si el producto existe, mostramos sus detalles
    return (
        <div className="product-detail">
            {product && (
                <>
                    <h1>{product.name}</h1>
                    <img src={product.image} alt={product.name} />
                    <p>{product.description}</p>
                    <p><strong>Precio:</strong> ${product.price}</p>

                    {/* Selector de cantidad */}
                    <label>
                        Cantidad:
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </label>

                    {/* Botón para añadir al carrito */}
                    <button onClick={addToCart}>Añadir al carrito</button>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
