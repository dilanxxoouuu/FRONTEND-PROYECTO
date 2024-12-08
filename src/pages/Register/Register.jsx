import React, { useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { useNavigate } from 'react-router-dom'; // Para la redirección
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Estado de carga para la solicitud
    const [registerError, setRegisterError] = useState(''); // Mensaje de error de registro
    const navigate = useNavigate(); // Hook de redirección

    // Maneja el cambio en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función para validar el formulario
    const validateForm = (data) => {
        const errors = {};
        if (!data.username) errors.username = 'El nombre de usuario es obligatorio.';
        if (!data.email) errors.email = 'El correo electrónico es obligatorio.';
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Correo electrónico inválido.';
        if (!data.password) errors.password = 'La contraseña es obligatoria.';
        if (data.password !== data.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
        return errors;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true); // Activar estado de carga
            setRegisterError(''); // Limpiar errores previos

            try {
                // Enviar la solicitud POST para registrar al usuario
                const response = await axios.post('https://tu-backend.com/api/auth/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                // Si la creación de la cuenta es exitosa, redirigir al login
                if (response.status === 201) {
                    navigate('/login'); // Redirige al login
                }
            } catch (error) {
                // Manejo de errores (por ejemplo, correo ya registrado)
                setRegisterError('Hubo un error al registrar la cuenta. Intenta nuevamente.');
            } finally {
                setLoading(false); // Desactivar estado de carga después de la solicitud
            }
        } else {
            setErrors(validationErrors); // Establecer errores de validación
        }
    };

    return (
        <div className="register-container">
            <h2>Crear cuenta</h2>
            <br />
            <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? 'input-error' : ''}
                    />
                    {errors.username && <small className="error">{errors.username}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <small className="error">{errors.email}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <small className="error">{errors.password}</small>}
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'input-error' : ''}
                    />
                    {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
                </div>
                <br />

                {registerError && <p className="error">{registerError}</p>} {/* Error de registro */}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Cargando...' : 'Registrar'}
                </button>
            </form>
        </div>
    );
};

export default Register;
