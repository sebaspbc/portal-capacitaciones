import { useEffect, useState } from "react";
import api from "../services/api"; // Instancia de axios para la API

export default function Cursos() {
  // Estado de cursos
  const [cursos, setCursos] = useState([]);

  // Estado para controlar qué cursos están cargando (botones deshabilitados)
  const [loadingIds, setLoadingIds] = useState([]);

  // Función para cargar cursos desde la API
  const fetchCursos = async () => {
    try {
      const res = await api.get("/cursos");
      setCursos(res.data); // Guardamos cursos en el estado
    } catch (err) {
      console.error("Error cargando cursos:", err);
      alert("No se pudieron cargar los cursos.");
    }
  };

  // useEffect para cargar cursos al montar el componente
  useEffect(() => {
    fetchCursos();
  }, []);

  // Funciones para manejar estado de carga de botones
  const setLoading = (id, value) => {
    setLoadingIds((prev) => (value ? [...prev, id] : prev.filter((x) => x !== id)));
  };
  const isLoading = (id) => loadingIds.includes(id);

  // Añadir curso a la lista del usuario
  const handleAdd = async (id) => {
    const token = localStorage.getItem("token"); // verificar token local
    if (!token) {
      alert("Debes iniciar sesión para añadir cursos.");
      return;
    }

    try {
      setLoading(id, true);
      await api.post(`/cursos/${id}/add`); // Llamada a API
      await fetchCursos(); // recargar cursos
    } catch (err) {
      console.error("Error al añadir curso:", err);
      const msg = err.response?.data?.message;
      if (err.response?.status === 401) {
        alert("No autorizado. Inicia sesión.");
      } else {
        alert(msg || "Error al añadir curso");
      }
    } finally {
      setLoading(id, false);
    }
  };

  // Marcar curso como iniciado o completado
  const handleCompletar = async (id, state) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para actualizar el progreso.");
      return;
    }

    try {
      setLoading(id, true);
      await api.post(`/cursos/${id}/completar`, { state });
      await fetchCursos(); // recargar cursos
    } catch (err) {
      console.error("Error al actualizar progreso:", err);
      const msg = err.response?.data?.message;
      if (err.response?.status === 401) {
        alert("No autorizado. Inicia sesión.");
      } else {
        alert(msg || "Error al actualizar progreso");
      }
    } finally {
      setLoading(id, false);
    }
  };

  // Helper: normalizar estado de progreso
  const getStateFrom = (c) => {
    if (!c) return null;
    if (typeof c === "string") return c;
    if (typeof c === "object") return c.state || c.progress || null;
    return null;
  };

  // Helper: obtener badge si existe
  const getBadgeFrom = (c) => {
    if (!c) return null;
    if (typeof c === "object") return c.badge || null;
    return null;
  };

  // Renderizamos la UI
  return (
    <div>
      <h2 style={{ color: "#5c6bc0", marginBottom: "1rem" }}>Cursos disponibles</h2>

      <div className="cursos-container">
        {cursos.map((c) => {
          const state = getStateFrom(c.progress); // estado actual
          const badge = getBadgeFrom(c.progress) || c.badge || null;
          const loading = isLoading(c._id); // si el curso está cargando

          return (
            <div key={c._id} className="curso-card">
              <h3>{c.title}</h3>
              <p style={{ color: "#b0bec5" }}>{c.description}</p>
              <p style={{ marginTop: 6 }}><strong>Módulo:</strong> {c.module}</p>

              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                {/* Si completado: mostrar estado + badge y ocultar botones */}
                {state === "completado" ? (
                  <>
                    <span className="estado completado">✅ Completado</span>
                    {badge && <span className="badge">{badge}</span>}
                  </>
                ) : (
                  <>
                    {/* Si ya está en la lista (iniciado/pendiente) */}
                    {state ? (
                      <>
                        <span className={`estado ${state}`}>{state}</span>

                        {/* Botón para completar curso */}
                        <button
                          onClick={() => handleCompletar(c._id, "completado")}
                          className="btn-primary"
                          disabled={loading}
                          aria-disabled={loading}
                        >
                          {loading ? "..." : "✅ Completar"}
                        </button>

                        {/* Botón para marcar iniciado si no está iniciado */}
                        {state !== "iniciado" && (
                          <button
                            onClick={() => handleCompletar(c._id, "iniciado")}
                            className="btn-secondary"
                            disabled={loading}
                          >
                            {loading ? "..." : "▶ Iniciar"}
                          </button>
                        )}
                      </>
                    ) : (
                      // Si no está en la lista del usuario -> mostrar añadir
                      <button
                        onClick={() => handleAdd(c._id)}
                        className="btn-add"
                        disabled={loading}
                        aria-disabled={loading}
                      >
                        {loading ? "..." : "➕ Añadir a mis cursos"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
