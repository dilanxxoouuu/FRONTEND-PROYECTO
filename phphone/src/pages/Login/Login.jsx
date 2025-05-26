import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.correo) errors.correo = "El correo electrónico es obligatorio.";
    if (!data.contrasena) errors.contrasena = "La contraseña es obligatoria.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setLoginError("");

      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: formData.correo,
            contrasena: formData.contrasena,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setShowToast(true);
          localStorage.setItem("token", data.token);
        
          if (data.carrito) {
            localStorage.setItem("carrito", JSON.stringify(data.carrito));
          }
        
          setTimeout(() => {
            setShowToast(false);
            switch (data.rol) {
              case 1:
                navigate("/Dashboard");
                break;
              case 2:
                navigate("/products");
                break;
              default:
                navigate("/");
                break;
            }
          }, 2000);
        }
        else {
          setLoginError(data.mensaje || "Error en el inicio de sesión");
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
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
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
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className={errors.contrasena ? "input-error" : ""}
            />
            {errors.contrasena && <small className="error">{errors.contrasena}</small>}
            

          </div>

          {loginError && <p className="login-error">{loginError}</p>}

          <div className="button-container">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </div>
          {showToast && (
            <div className="success-message">
              <span className="success-icon">✓</span> Inicio de sesión exitoso
            </div>
          )}
        </form>

        <p className="register-link">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")} className="link">
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;