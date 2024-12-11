import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(""); // Error de autenticación
  const navigate = useNavigate(); // Hook de redirección

  // Función para manejar el cambio de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función de validación del formulario
  const validateForm = (data) => {
    const errors = {};
    if (!data.correo) errors.correo = "El correo electrónico es obligatorio.";
    if (!data.contrasena) errors.contrasena = "La contraseña es obligatoria.";
    return errors;
  };

  // Función para enviar el formulario y realizar el login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setLoginError(""); // Limpiar cualquier error previo

      try {
        // Solicitar al backend para autenticar al usuario
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: formData.correo,  // Enviar "correo" en lugar de "nombre"
            contrasena: formData.contrasena,  // Enviar "contrasena" en lugar de "password"
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Inicio de sesión exitoso");
          localStorage.setItem("token", data.token); // Guardar el token

          // Redirección basada en el rol (usando `rol`)
          switch (data.rol) {
            case 1: // Suponiendo que rol 1 es 'admin'
              navigate("/Dashboard");
              break;
            case 2: // Suponiendo que rol 2 es 'usuario'
              navigate("/ShoppingCart");
              break;
            default:
              navigate("/");
              break;
          }
        } else {
          alert(data.mensaje || "Error en el inicio de sesión");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setLoginError("Hubo un problema al conectar con el servidor.");
      } finally {
        setLoading(false);
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
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo" // Clave alineada con el backend
            value={formData.correo}
            onChange={handleChange}
            className={errors.correo ? "input-error" : ""}
          />
          {errors.correo && <small className="error">{errors.correo}</small>}
        </div>

        <div className="input-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena" // Clave alineada con el backend
            value={formData.contrasena}
            onChange={handleChange}
            className={errors.contrasena ? "input-error" : ""}
          />
          {errors.contrasena && <small className="error">{errors.contrasena}</small>}
        </div>

        {loginError && <p className="error">{loginError}</p>} {/* Mostrar error de autenticación */}

        <br />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
