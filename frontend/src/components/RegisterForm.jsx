import { useState } from "react";
import api from "../services/api"; // Traemos la instancia de axios para llamar la API
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas

export default function RegisterForm({ onRegister }) {
  // Hook para cambiar de ruta
  const navigate = useNavigate();

  // Estado del formulario
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
      // Llamamos a la API para registrar usuario
      const res = await api.post("/auth/register", form);

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Mandamos el usuario al componente padre
      onRegister(res.data.user);

      // Redirigir al usuario a la página de cursos
      navigate("/cursos");
    } catch (err) {
      // Mostrar mensaje de error si falla
      setError(err.response?.data?.message || "Error en el registro");
    }
  };

  // Renderizamos el formulario de registro
  return (
    <div className="login-container">
      {/* Caja principal del registro */}
      <div className="login-box">
        {/* Título del formulario */}
        <h2>Registro</h2>

        {/* Mostrar mensaje de error si existe */}
        {error && <p className="login-error">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Input de nombre */}
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />

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
          <button type="submit">Registrarse</button>
        </form>

        {/* Enlace para ir a la página de login */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="login-link">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
