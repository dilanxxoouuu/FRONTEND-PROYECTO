import React, { useState, useEffect } from 'react';
import {
    FaBox, FaSignInAlt, FaUserPlus, FaUserCog, FaSignOutAlt,
    FaShoppingCart, FaSearch, FaTachometerAlt
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import FiltroBusqueda from '../Search/FiltroBusqueda';
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ cart = [] }) => {
    const [menuActive, setMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const toggleMenu = () => setMenuActive(!menuActive);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token); // Cambiado a jwtDecode
            setIsLoggedIn(true);
            setIsAdmin(decoded.sub === "1");
        } catch (error) {
            console.error('Error decoding token:', error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        setIsLoggedIn(false);
        setIsAdmin(false);
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
        location.pathname === '/GestionCarritos' ||
        location.pathname === '/GestionPagos' ||
        location.pathname === '/GestionFacturas' ||
        location.pathname === '/Dashboard';

    const getProfileIcon = () => {
        if (isAdmin) {
            return (
                <li>
                    <a href="/Dashboard">
                        <FaTachometerAlt size={24} title="Dashboard Administrativo" />
                    </a>
                </li>
            );
        }
        return (
            <li>
                <a href="/profile">
                    <FaUserCog size={24} title="Perfil de Usuario" />
                </a>
            </li>
        );
    };

    if (loading) {
        return <div className="navbar-loading">Cargando...</div>;
    }

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
                    <li className="search-icon" onClick={() => setShowSearch(!showSearch)}>
                        <FaSearch size={24} />
                    </li>

                    {isInRestrictedRoute ? (
                        <>
                            {getProfileIcon()}
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
                                {getProfileIcon()}
                                <li><a href="#" onClick={handleLogout}><FaSignOutAlt size={24} /></a></li>
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