import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShoppingCart.css'; // Estilos para la página de bienvenida
import Products from "../Products/Products"; // Ajusta la ruta según la estructura de tu proyecto

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);  // Artículos en el carrito
    const [total, setTotal] = useState(0);  // Total del carrito
    const [loading, setLoading] = useState(true);  // Cargar productos
    const [error, setError] = useState(null);  // Error en la carga de productos
    const [products, setProducts] = useState([]);  // Lista de productos

    // Función para obtener el token del localStorage y agregarlo al header
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token no disponible");
            return null;
        }
        return { Authorization: `Bearer ${token}` };
    };

    // Función para agregar un producto al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart, product];
            console.log('Carrito actualizado:', updatedCart);  // Verifica el estado del carrito
            calculateTotal(updatedCart);
            // Crear el carrito en la base de datos cuando se agrega un producto
            createCart(updatedCart);
            return updatedCart;
        });
    };

    // Función para crear el carrito en la base de datos
    const createCart = async (updatedCart) => {
        try {
            const headers = getAuthHeaders();
            if (!headers) return;

            const response = await axios.post('http://127.0.0.1:5000/carrito', {
                total: total,  // El total del carrito
            }, {
                headers: headers,  // Incluir el token en la cabecera Authorization
            });

            console.log("Carrito creado en base de datos:", response.data);
        } catch (err) {
            console.error("Error al crear el carrito:", err);
        }
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id_producto !== productId);
        setCart(updatedCart);
        calculateTotal(updatedCart);
    };

    // Función para calcular el total del carrito
    const calculateTotal = (cartItems) => {
        const totalPrice = cartItems.reduce((sum, item) => sum + item.producto_precio, 0);
        setTotal(totalPrice);  // Total sin dividir por 100
    };

    // Cargar productos para el carrito
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const headers = getAuthHeaders();
                if (!headers) return;

                const response = await axios.get('http://127.0.0.1:5000/productos', {
                    headers: headers,  // Incluir el token en la cabecera Authorization
                });

                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Guardar el carrito en el backend (opcional)
    const saveCart = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers) return;

            await axios.post('http://127.0.0.1:5000/carrito', {
                productos: cart,
                total: total,  // El total sin multiplicar por 100
            }, {
                headers: headers,  // Incluir el token en la cabecera Authorization
            });

            alert('Carrito guardado correctamente');
        } catch (err) {
            console.error('Error al guardar el carrito:', err);
        }
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container">
            {/* Aquí pasamos addToCart como prop a Products */}
            <Products addToCart={addToCart} />

            {/* Carrito de compras */}
            <div className="cart">
                <h2>Carrito de Compras</h2>
                <ul>
                    {cart.map((product) => (
                        <li key={product.id_producto}>
                            <span>{product.producto_nombre} - ${new Intl.NumberFormat().format(product.producto_precio)}</span>
                            <button onClick={() => removeFromCart(product.id_producto)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
                <p>Total: ${new Intl.NumberFormat().format(total)}</p>
                <button onClick={saveCart}>Pagar</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
