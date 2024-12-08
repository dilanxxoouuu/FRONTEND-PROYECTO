import React, { useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { useNavigate } from 'react-router-dom'; // Para la redirección
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Estado para indicar que la solicitud está en proceso
    const [loginError, setLoginError] = useState(''); // Error de autenticación
    const navigate = useNavigate(); // Hook de redirección

    // Función para manejar el cambio de los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función de validación del formulario
    const validateForm = (data) => {
        const errors = {};
        if (!data.email) errors.email = 'El correo electrónico es obligatorio.';
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'El correo electrónico no es válido.';
        
        if (!data.password) errors.password = 'La contraseña es obligatoria.';
        return errors;
    };

    // Función para enviar el formulario y realizar el login
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true); // Activar el estado de carga
            setLoginError(''); // Limpiar cualquier error previo

            try {
                // Solicitar al backend para autenticar al usuario
                const response = await axios.post('https://tu-backend.com/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                // Verificar si la respuesta es exitosa
                if (response.status === 200 && response.data.token) {
                    // Guardar el token JWT en localStorage o sessionStorage
                    localStorage.setItem('token', response.data.token);
                    
                    // Redirigir a la página de productos o dashboard
                    navigate('/productos'); // O '/dashboard' dependiendo de la respuesta del backend
                }
            } catch (error) {
                // Manejar los errores de autenticación (por ejemplo, usuario o contraseña incorrectos)
                setLoginError('Correo electrónico o contraseña incorrectos.');
            } finally {
                setLoading(false); // Desactivar el estado de carga después de la solicitud
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            <br />
            <form onSubmit={handleSubmit} className="login-form">
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

                {loginError && <p className="error">{loginError}</p>} {/* Mostrar error de autenticación */}

                <br />

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
};

export default Login;
