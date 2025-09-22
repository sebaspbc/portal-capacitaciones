// Importa Express para crear rutas y manejar peticiones HTTP
const express = require("express");
const router = express.Router();

// Importa JWT para manejar tokens de autenticación
const jwt = require("jsonwebtoken");

// Importa los modelos Curso y Progreso para interactuar con la base de datos
const Curso = require("../models/Curso");
const Progreso = require("../models/Progreso");

// Define la clave secreta para firmar y verificar JWT
const secret = process.env.JWT_SECRET || "token_ejemplo_123";

// Helper: intenta leer el usuario desde el token enviado en los headers
function getUserFromToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  try {
    const token = header.split(" ")[1];
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

// GET /api/cursos → listar todos los cursos, opcionalmente filtrando por módulo
router.get("/", async (req, res) => {
  try {
    // Filtra por módulo si se recibe en la query
    const filter = req.query.module ? { module: req.query.module } : {};
    const cursos = await Curso.find(filter);

    // Obtiene el usuario desde el token si existe
    const user = getUserFromToken(req);
    if (user) {
      // Busca los progresos del usuario en la base de datos
      const progreso = await Progreso.find({ user_id: user.id });
      const progresoMap = {};
      progreso.forEach(p => { progresoMap[p.curso_id] = p.state; });

      // Devuelve los cursos junto con el progreso del usuario
      return res.json(
        cursos.map(c => ({
          ...c.toObject(),
          progress: progresoMap[c._id] || null
        }))
      );
    }

    // Si no hay usuario, devuelve solo los cursos
    res.json(cursos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener cursos" });
  }
});

// GET /api/cursos/:id → obtener detalle de un curso
router.get("/:id", async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    const user = getUserFromToken(req);
    if (user) {
      // Busca el progreso del usuario para este curso
      const prog = await Progreso.findOne({ user_id: user.id, curso_id: curso._id });
      return res.json({ ...curso.toObject(), progress: prog });
    }

    // Si no hay usuario, devuelve solo los datos del curso
    res.json(curso);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener curso" });
  }
});

// POST /api/cursos/:id/add → usuario añade curso a su lista
router.post("/:id/add", async (req, res) => {
  try {
    // Verifica que haya token
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No autorizado" });

    const token = header.split(" ")[1];
    const user = jwt.verify(token, secret);

    // Busca el curso
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    // Verifica si ya está en la lista del usuario
    const existe = await Progreso.findOne({ user_id: user.id, curso_id: curso._id });
    if (existe) {
      return res.status(400).json({ message: "Ya tienes este curso en tu lista" });
    }

    // Crea un nuevo progreso con estado pendiente
    const nuevoProgreso = new Progreso({
      user_id: user.id,
      curso_id: curso._id,
      state: "pendiente",
    });
    await nuevoProgreso.save();

    res.json({ success: true, message: "Curso añadido a tu lista" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al añadir curso" });
  }
});

// POST /api/cursos/:id/completar → marcar curso como iniciado o completado
router.post("/:id/completar", async (req, res) => {
  try {
    // Verifica que haya token
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No autorizado" });

    const token = header.split(" ")[1];
    const user = jwt.verify(token, secret);

    const { state } = req.body;
    if (!["iniciado", "completado"].includes(state)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Busca el progreso existente
    let progreso = await Progreso.findOne({ user_id: user.id, curso_id: req.params.id });

    if (progreso) {
      // Actualiza el progreso existente
      progreso.state = state;
      progreso.updated_at = new Date();

      if (state === "completado") {
        progreso.badge = `🏅 ${new Date().getFullYear()} Achievement`;
      }

      await progreso.save();
    } else {
      // Crea un nuevo progreso si no existía
      progreso = new Progreso({
        user_id: user.id,
        curso_id: req.params.id,
        state,
        badge: state === "completado" ? `🏅 ${new Date().getFullYear()} Achievement` : null,
      });
      await progreso.save();
    }

    res.json({ success: true, curso_id: req.params.id, state, badge: progreso.badge });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al marcar progreso" });
  }
});

// Exporta el router para usar estas rutas en la app principal
module.exports = router;
