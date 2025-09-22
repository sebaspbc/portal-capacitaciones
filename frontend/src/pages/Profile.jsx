import { useEffect, useState } from "react";
import api from "../services/api"; // instancia de axios para la API

export default function Profile() {
  // Estado para guardar perfil y cursos del usuario
  const [profile, setProfile] = useState(null);

  // useEffect para cargar perfil al montar el componente
  useEffect(() => {
    let mounted = true; // para evitar actualizar estado si el componente se desmonta

    (async () => {
      try {
        const res = await api.get("/profile"); // llamada a API
        if (mounted) setProfile(res.data); // actualizar estado solo si sigue montado
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    })();

    return () => (mounted = false); // cleanup
  }, []);

  // Mostrar mensaje de carga mientras se obtiene el perfil
  if (!profile) return <p>Cargando perfil...</p>;

  // Renderizamos la UI del perfil
  return (
    <div className="perfil-container">
      {/* Encabezado con avatar y datos del usuario */}
      <div className="perfil-header">
        <div className="perfil-avatar">
          {profile.user.name.charAt(0).toUpperCase()} {/* Inicial del nombre */}
        </div>
        <div className="perfil-info">
          <h2>{profile.user.name}</h2>
          <p><strong>Email:</strong> {profile.user.email}</p>
          {profile.user.is_admin && (
            <p className="perfil-admin">👑 Administrador</p> // indicador admin
          )}
        </div>
      </div>

      {/* Lista de cursos y progreso */}
      <h3>Cursos y progreso</h3>
      <ul className="perfil-cursos">
        {profile.cursos.map(c => (
          <li key={c._id}>
            <div className="curso-item">
              {/* Contenedor flex para separar título y estado */}
              <div className="curso-titulo">{c.title}</div>
              <div className="curso-progreso">
                {/* Estado del curso: pendiente, iniciado o completado */}
                <span className={`estado ${c.progress || "pendiente"}`}>
                  {c.progress || "pendiente"}
                </span>

                {/* Mostrar insignia si el curso está completado */}
                {c.progress === "completado" && (
                  <span className="insignia">{c.badge || "🏅"}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
