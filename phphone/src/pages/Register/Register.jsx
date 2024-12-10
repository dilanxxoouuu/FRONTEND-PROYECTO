import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        numerodoc: '',
        correo: '',
        contrasena: '',
        confirmContrasena: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validación
    const validateForm = (data) => {
        const errors = {};
        if (!data.nombre) errors.nombre = 'El nombre es obligatorio.';
        if (!data.numerodoc) errors.numerodoc = 'El número de documento es obligatorio.';
        else if (!/^\d+$/.test(data.numerodoc)) errors.numerodoc = 'El número de documento debe ser numérico.';
        if (!data.correo) errors.correo = 'El correo electrónico es obligatorio.';
        else if (!/\S+@\S+\.\S+/.test(data.correo)) errors.correo = 'Correo electrónico inválido.';
        if (!data.contrasena) errors.contrasena = 'La contraseña es obligatoria.';
        if (data.contrasena !== data.confirmContrasena) errors.confirmContrasena = 'Las contraseñas no coinciden.';
        return errors;
    };

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            setRegisterError('');

            try {
                const response = await axios.post('http://127.0.0.1:5000/signin', {
                    nombre: formData.nombre,
                    numerodoc: formData.numerodoc,
                    correo: formData.correo,
                    contrasena: formData.contrasena
                });

                if (response.status === 201) {
                    alert(response.data.message); // Mensaje del backend
                    navigate('/login'); // Redirige al login
                }
            } catch (error) {
                const mensaje = error.response?.data?.message || 'Error inesperado al registrar la cuenta.';
                setRegisterError(mensaje); // Muestra el error de registro
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(validationErrors); // Muestra los errores de validación
        }
    };

    return (
        <div className="register-container">
            <h2>Crear cuenta</h2>
            <br />
            <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={errors.nombre ? 'input-error' : ''}
                    />
                    {errors.nombre && <small className="error">{errors.nombre}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="numerodoc">Número de documento</label>
                    <input
                        type="text"
                        id="numerodoc"
                        name="numerodoc"
                        value={formData.numerodoc}
                        onChange={handleChange}
                        className={errors.numerodoc ? 'input-error' : ''}
                    />
                    {errors.numerodoc && <small className="error">{errors.numerodoc}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={errors.correo ? 'input-error' : ''}
                    />
                    {errors.correo && <small className="error">{errors.correo}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="contrasena">Contraseña</label>
                    <input
                        type="password"
                        id="contrasena"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className={errors.contrasena ? 'input-error' : ''}
                    />
                    {errors.contrasena && <small className="error">{errors.contrasena}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="confirmContrasena">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmContrasena"
                        name="confirmContrasena"
                        value={formData.confirmContrasena}
                        onChange={handleChange}
                        className={errors.confirmContrasena ? 'input-error' : ''}
                    />
                    {errors.confirmContrasena && <small className="error">{errors.confirmContrasena}</small>}
                </div>
                <br />

                {registerError && <p className="error">{registerError}</p>} {/* Muestra error de backend */}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Cargando...' : 'Registrar'}
                </button>
            </form>
        </div>
    );
};

export default Register;