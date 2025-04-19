import React, { useState, useEffect } from 'react';
import './Alerts.css'; // Asegúrate de tener un archivo de estilo

const Alert = ({ message, type, onClose }) => {
    useEffect(() => {
        // Después de 5 segundos, la alerta desaparecerá
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`alert alert-${type}`}>
            <p>{message}</p>
            <button className="close-btn" onClick={onClose}>X</button>
        </div>
    );
};

export default Alert;