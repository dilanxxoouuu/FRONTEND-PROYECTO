import React, { useState, useEffect } from 'react'; 
import { FaHome, FaBox, FaSignInAlt, FaUserPlus, FaUserCog, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({ cart = [] }) => {
    const [menuActive, setMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showCart, setShowCart] = useState(false);

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

    return (
        <div className="Navbar-container">
            <div className="navbar">
                <div className="navbar-logo">
                    <h1>PHPHONE</h1>
                </div>
                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`navbar-links ${menuActive ? 'active' : ''}`}>
                    <li><a href="/"><FaHome size={24} /></a></li>
                    <li><a href="/products"><FaBox size={24} /></a></li>
                    <li className="cart-icon" onClick={toggleCartView}>
                        <FaShoppingCart size={24} />
                        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                    </li>
                    {!isLoggedIn ? (
                        <>
                            <li><a href="/login"><FaSignInAlt size={24} /></a></li>
                            <li><a href="/register"><FaUserPlus size={24} /></a></li>
                        </>
                    ) : (
                        <>
                            <li><a href="/profile"><FaUserCog size={24} /></a></li>
                            <li><a href="#" onClick={handleLogout}><FaSignOutAlt size={24} /></a></li>
                        </>
                    )}
                </ul>
            </div>
            {showCart && (
                <div className="cart-details">
                    <h3>Carrito de Compras</h3>
                    {renderCartItems()}
                    <p><strong>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</strong></p>
                </div>
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
