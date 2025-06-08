import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
    const [registerSuccess, setRegisterSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Limpiar errores al escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = (data) => {
        const newErrors = {};
        
        // Validación Nombre (solo letras y espacios)
        if (!data.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
        } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
            newErrors.nombre = 'Solo se permiten letras y espacios.';
        }

        // Validación Número de documento (solo números, máximo 15)
        if (!data.numerodoc.trim()) {
            newErrors.numerodoc = 'El documento es obligatorio.';
        } else if (!/^\d{1,15}$/.test(data.numerodoc)) {
            newErrors.numerodoc = 'Máximo 15 dígitos numéricos.';
        }

        // Validación Correo (formato válido)
        if (!data.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
            newErrors.correo = 'Formato inválido (ejemplo@dominio.com).';
        }

        // Validación Contraseña (8-16 caracteres alfanuméricos)
        if (!data.contrasena.trim()) {
            newErrors.contrasena = 'La contraseña es obligatoria.';
        } else if (!/^[A-Za-z0-9]{8,16}$/.test(data.contrasena)) {
            newErrors.contrasena = '8-16 caracteres alfanuméricos.';
        }

        // Validación Confirmar Contraseña
        if (data.contrasena !== data.confirmContrasena) {
            newErrors.confirmContrasena = 'Las contraseñas no coinciden.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            setRegisterError('');

            try {
                const response = await axios.post('https://backenddespliegue-production.up.railway.app/signin', {
                    ...formData,
                    numerodoc: parseInt(formData.numerodoc) // 👈 convertir aquí
                });

                if (response.status === 201) {
                    setRegisterSuccess('¡Registro exitoso! Redirigiendo...');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (error) {
                setRegisterError(error.response?.data?.mensaje || 'Error al registrar. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2>Crear cuenta</h2>
                
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? 'input-error' : ''}
                            placeholder="Ej: Johan Gomez"
                        />
                        {errors.nombre && <div className="field-error">{errors.nombre}</div>}
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
                            placeholder="Ej: 1234567890"
                        />
                        {errors.numerodoc && <div className="field-error">{errors.numerodoc}</div>}
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
                            placeholder="Ej: usuario@dominio.com"
                        />
                        {errors.correo && <div className="field-error">{errors.correo}</div>}
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
                            placeholder="8-16 caracteres numéricos"
                        />
                        {errors.contrasena && <div className="field-error">{errors.contrasena}</div>}
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
                            placeholder="Repite tu contraseña"
                        />
                        {errors.confirmContrasena && <div className="field-error">{errors.confirmContrasena}</div>}
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                {registerSuccess && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span> {registerSuccess}
                    </div>
                )}
                {registerError && (
                    <div className="alert alert-error">
                        <span className="alert-icon">!</span> {registerError}
                    </div>
                )}
                </form>


                <p className="login-link">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="link">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;