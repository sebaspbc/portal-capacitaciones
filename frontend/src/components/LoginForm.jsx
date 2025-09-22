import { useState } from "react";
import api from "../services/api"; // Traemos la instancia de axios para llamar la API
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas

export default function LoginForm({ onLogin }) {
  // Hook para cambiar de ruta
  const navigate = useNavigate();

  // Estado del formulario
  const [form, setForm] = useState({ email: "", password: "" });

  // Estado para mostrar errores
  const [error, setError] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // evitar que recargue la página
    setError(""); // limpiar errores previos

    try {
      // Llamamos a la API para login
      const res = await api.post("/auth/login", form);

      // Guardamos token y usuario en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Mandamos el usuario al componente padre
      onLogin(res.data.user);

      // Redirigir al usuario a la página de cursos
      navigate("/cursos");
    } catch (err) {
      // Mostrar mensaje de error si falla
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  // Renderizamos el formulario de login
  return (
    <div className="login-container">
      {/* Caja principal del login */}
      <div className="login-box">
        {/* Título del formulario */}
        <h2>Iniciar Sesión</h2>

        {/* Mostrar mensaje de error si existe */}
        {error && <p className="login-error">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Input de email */}
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Input de contraseña */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Botón de enviar formulario */}
          <button type="submit">Ingresar</button>
        </form>

        {/* Enlace para ir a la página de registro */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿No tienes cuenta?{" "}
          <a href="/register" className="login-link">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
