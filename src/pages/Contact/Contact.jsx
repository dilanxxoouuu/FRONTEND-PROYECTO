import React, { useState } from 'react';
import './Contact.css'; // Estilos para el apartado de contacto

const Contact = () => {
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías agregar la lógica para enviar el formulario
        console.log(formData);
        alert('Formulario enviado!');
    };

    return (
        <div className="contact-container">
            <h2>Contáctenos</h2>
            <p>Si tienes alguna pregunta, no dudes en enviarnos un mensaje.</p>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Mensaje</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="submit-button">Enviar Mensaje</button>
            </form>

        </div>
    );
};

export default Contact;
