import { useEffect, useState } from "react";
import api from "../services/api"; // Traemos la instancia de axios para llamar la API

export default function AdminCursos() {
  // Estado de los cursos
  const [cursos, setCursos] = useState([]);

  // Estado del formulario para crear un nuevo curso
  const [form, setForm] = useState({ title: "", module: "", description: "" });

  // Estado para saber qué curso se está editando
  const [editingId, setEditingId] = useState(null);

  // Función para cargar todos los cursos desde la API
  const loadCursos = async () => {
    try {
      const res = await api.get("/cursos");
      setCursos(res.data); // Guardamos cursos en el estado
    } catch (err) {
      console.error("Error cargando cursos", err);
    }
  };

  // Función para crear un curso nuevo
  const handleSubmit = async (e) => {
    e.preventDefault(); // evitar recarga de página
    try {
      await api.post("/admin/cursos", form); // Llamamos API para crear curso
      setForm({ title: "", module: "", description: "" }); // Limpiamos formulario
      loadCursos(); // Recargamos la lista de cursos
    } catch (err) {
      console.error("Error creando curso", err);
    }
  };

  // Función para eliminar un curso
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/cursos/${id}`);
      loadCursos(); // Recargamos lista de cursos
    } catch (err) {
      console.error("Error borrando curso", err);
    }
  };

  // Función para guardar cambios de un curso editado
  const handleSave = async (curso) => {
    try {
      await api.put(`/admin/cursos/${curso._id}`, {
        title: curso.title,
        description: curso.description,
        module: curso.module,
      });
      setEditingId(null); // Salimos del modo edición
      loadCursos(); // Recargamos lista de cursos
    } catch (err) {
      console.error("Error actualizando curso", err);
    }
  };

  // Cargar cursos al montar el componente
  useEffect(() => {
    loadCursos();
  }, []);

  // Renderizamos la UI
  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Administrar Cursos</h2>

      {/* Formulario de nuevo curso */}
      <form onSubmit={handleSubmit} className="curso-card" style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Módulo"
          value={form.module}
          onChange={(e) => setForm({ ...form, module: e.target.value })}
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit">Agregar Curso</button>
      </form>

      {/* Lista de cursos */}
      <div className="cursos-container">
        {cursos.map((c) => (
          <div key={c._id} className="curso-card">
            {editingId === c._id ? (
              <>
                {/* Inputs para editar el curso */}
                <input
                  type="text"
                  value={c.title}
                  onChange={(e) =>
                    setCursos(cursos.map(x =>
                      x._id === c._id ? { ...x, title: e.target.value } : x
                    ))
                  }
                />
                <textarea
                  value={c.description}
                  onChange={(e) =>
                    setCursos(cursos.map(x =>
                      x._id === c._id ? { ...x, description: e.target.value } : x
                    ))
                  }
                />
                <input
                  type="text"
                  value={c.module}
                  onChange={(e) =>
                    setCursos(cursos.map(x =>
                      x._id === c._id ? { ...x, module: e.target.value } : x
                    ))
                  }
                />
                <button onClick={() => handleSave(c)}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {/* Mostrar datos del curso */}
                <h3>{c.title}</h3>
                <p><strong>Módulo:</strong> {c.module}</p>
                <p>{c.description}</p>
                <button onClick={() => setEditingId(c._id)}>Editar</button>
                <button onClick={() => handleDelete(c._id)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
