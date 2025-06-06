import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h3>PHPHONE</h3>
                    <p>Innovación en cada dispositivo</p>
                </div>
                <div className="footer-links">
                    <ul>
                        <li><a href="/about">Acerca de</a></li>
                        <li><a href="/privacy">Política de Privacidad</a></li>
                        <li><a href="/contact">Contáctanos</a></li>
                    </ul>
                </div>
                <div className="footer-socials">
                    <ul>
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 PHPHONE. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
