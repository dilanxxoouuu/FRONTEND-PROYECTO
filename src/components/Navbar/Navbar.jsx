import React, { useState, useEffect } from 'react';
import {
    FaBox, FaSignInAlt, FaUserPlus, FaUserCog, FaSignOutAlt,
    FaShoppingCart, FaSearch
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import FiltroBusqueda from '../Search/FiltroBusqueda';
import './Navbar.css';

const Navbar = ({ cart = [] }) => {
    const [menuActive, setMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const location = useLocation(); // Usamos esta variable para obtener la ruta actual

    const toggleMenu = () => setMenuActive(!menuActive);

    const checkLoginStatus = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = '/';
    };

    const toggleCartView = () => setShowCart(!showCart);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const cartItemCount = Array.isArray(cart) ? cart.length : 0;

    const renderCartItems = () => {
        if (!Array.isArray(cart) || cart.length === 0) {
            return <p>El carrito está vacío.</p>;
        }
        return (
            <ul>
                {cart.map((product) => (
                    <li key={product.id}>
                        <span>{product.name}</span> - ${product.price}
                    </li>
                ))}
            </ul>
        );
    };

    const isInRestrictedRoute =
        location.pathname === '/shoppingCart' ||
        location.pathname === '/products' ||
        location.pathname === '/GestionUsuarios' ||
        location.pathname === '/GestionCategorias' ||
        location.pathname === '/GestionProductos' ||
        location.pathname === '/profile' ||
        location.pathname === '/dashboard';

    // Verificar si la ruta es /products para mostrar el ícono de búsqueda
    const shouldShowSearchIcon = location.pathname === '/products';

    return (
        <div className="Navbar-container">
            <div className="navbar">
                <div className="navbar-logo">
                    <Link to="/" className="navbar-logo-link" style={{ textDecoration: 'none' }}>
                        <h1>PHPHONE</h1>
                    </Link>
                </div>
                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`navbar-links ${menuActive ? 'active' : ''}`}>
                    <li><a href="/products"><FaBox size={24} /></a></li>
                    <li className="cart-icon">
                        <Link to="/shoppingCart">
                            <FaShoppingCart size={24} />
                            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>
                    </li>
                    {/* Ícono de búsqueda solo visible en la ruta '/products' */}
                    {shouldShowSearchIcon && (
                        <li className="search-icon" onClick={() => setShowSearch(!showSearch)}>
                            <FaSearch size={24} />
                        </li>
                    )}

                    {isInRestrictedRoute ? (
                        <>
                            <li><a href="/profile"><FaUserCog size={24} /></a></li>
                            <li><a href="#" onClick={handleLogout}><FaSignOutAlt size={24} /></a></li>
                        </>
                    ) : (
                        !isLoggedIn ? (
                            <>
                                <li><a href="/login"><FaSignInAlt size={24} /></a></li>
                                <li><a href="/register"><FaUserPlus size={24} /></a></li>
                            </>
                        ) : (
                            <>
                                <li><a href="/profile"><FaUserCog size={24} /></a></li>
                                <li><a href="/profile" onClick={handleLogout}><FaSignOutAlt size={24} /></a></li>
                            </>
                        )
                    )}
                </ul>
            </div>

            {showCart && (
                <div className="cart-details">
                    <center><h3>Carrito de Compras</h3></center>
                    {renderCartItems()}
                    <p><strong>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</strong></p>
                    <Link to="/shoppingCart">
                        <button className="go-to-cart-button">Ir al carrito</button>
                    </Link>
                </div>
            )}

            {/* Componente de filtro visible cuando se hace clic en la lupa */}
            {showSearch && (
                <FiltroBusqueda showFilter={showSearch} setShowFilter={setShowSearch} />
            )}
        </div>
    );
};

Navbar.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })
    ),
};

export default Navbar;
