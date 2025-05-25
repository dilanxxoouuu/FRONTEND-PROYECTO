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
    const [lastScrollY, setLastScrollY] = useState(0);

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
            const decoded = jwtDecode(token);
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
        localStorage.removeItem('carrito');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.location.href = '/';
    };

    const toggleCartView = () => setShowCart(!showCart);

    useEffect(() => {
        checkLoginStatus();
    }, [location]);

    useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 10) {
        // Scroll hacia abajo: oculta el navbar
        document.querySelector('.Navbar-container').classList.add('hidden');
        } else {
        // Scroll hacia arriba o en top: muestra el navbar
        document.querySelector('.Navbar-container').classList.remove('hidden');
        }
        
        setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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

    if (loading) {
        return <div className="navbar-loading">Cargando...</div>;
    }

    return (
        <>
            <div className="Navbar-container">
                <div className="navbar">
                    <div className="navbar-logo">
                        <Link to="/" className="navbar-logo-link">
                            <h1>PHPHONE</h1>
                        </Link>
                    </div>
                    <button className="navbar-toggle" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul className={`navbar-links ${menuActive ? 'active' : ''}`}>
                        <li className="icon-with-label">
                            <Link to="/products">
                                <FaBox size={20} />
                                <span className="icon-label">Productos</span>
                            </Link>
                        </li>

                        <li className="icon-with-label search-icon" onClick={() => setShowSearch(!showSearch)}>
                            <FaSearch size={20} />
                            <span className="icon-label">Buscar</span>
                        </li>

                        <li className="icon-with-label cart-icon">
                            <Link to="/shoppingCart">
                                <FaShoppingCart size={20} />
                                <span className="icon-label">Carrito</span>
                                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                            </Link>
                        </li>

                        {isAdmin && (
                            <li className="icon-with-label">
                                <Link to="/Dashboard">
                                    <FaTachometerAlt size={20} />
                                    <span className="icon-label">Dashboard</span>
                                </Link>
                            </li>
                        )}

                        {isLoggedIn && !isAdmin && (
                            <li className="icon-with-label">
                                <Link to="/profile">
                                    <FaUserCog size={20} />
                                    <span className="icon-label">Perfil</span>
                                </Link>
                            </li>
                        )}

                        {!isLoggedIn ? (
                            <>
                                <li className="icon-with-label">
                                    <Link to="/login">
                                        <FaSignInAlt size={20} />
                                        <span className="icon-label">Ingresar</span>
                                    </Link>
                                </li>
                                <li className="icon-with-label">
                                    <Link to="/register">
                                        <FaUserPlus size={20} />
                                        <span className="icon-label">Registro</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="icon-with-label">
                                <a href="#" onClick={handleLogout}>
                                    <FaSignOutAlt size={20} />
                                    <span className="icon-label">Salir</span>
                                </a>
                            </li>
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
            <div className="navbar-spacer"></div>
        </>
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