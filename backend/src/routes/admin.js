// Importa Express para crear rutas y manejar peticiones HTTP
const express = require("express");
const router = express.Router();

// Importa JWT para verificar tokens de autenticación
const jwt = require("jsonwebtoken");

// Importa el modelo Curso para interactuar con la colección 'cursos'
const Curso = require("../models/Curso");

// Define la clave secreta para firmar y verificar JWT
const secret = process.env.JWT_SECRET || "token_ejemplo_123";

// Middleware para verificar si el usuario es administrador
function verifyAdmin(req, res, next) {
  // Obtiene el header Authorization de la petición
  const header = req.headers.authorization;

  // Si no existe, devuelve error 401 (no autorizado)
  if (!header) return res.status(401).json({ message: "No autorizado" });

  try {
    // Extrae el token del header (formato "Bearer token")
    const token = header.split(" ")[1];

    // Verifica y decodifica el token
    const user = jwt.verify(token, secret);

    // Comprueba si el usuario tiene permisos de administrador
    if (!user.is_admin) {
      return res.status(403).json({ message: "Acceso denegado: no eres administrador" });
    }

    // Guarda los datos del usuario en la request para usarlo más adelante
    req.user = user;

    // Continúa con la siguiente función/middleware
    next();
  } catch (err) {
    // Si el token no es válido, devuelve error 401
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Ruta para crear un curso (solo admin)
router.post("/cursos", verifyAdmin, async (req, res) => {
  try {
    // Obtiene los datos enviados en el body de la petición
    const { title, module, description, content } = req.body;

    // Crea un nuevo curso con los datos recibidos
    const curso = new Curso({ title, module, description, content });

    // Guarda el curso en la base de datos
    await curso.save();

    // Responde con éxito y devuelve el curso creado
    res.status(201).json({ success: true, curso });
  } catch (err) {
    console.error("❌ Error al crear curso:", err.message);
    res.status(500).json({ message: "Error al crear curso", error: err.message });
  }
});

// Ruta para editar un curso existente (solo admin)
router.put("/cursos/:id", verifyAdmin, async (req, res) => {
  try {
    // Busca el curso por ID y actualiza con los datos recibidos
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Si no se encuentra el curso, devuelve error 404
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    // Responde con éxito y devuelve el curso actualizado
    res.json({ success: true, curso });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar curso" });
  }
});

// Ruta para eliminar un curso (solo admin)
router.delete("/cursos/:id", verifyAdmin, async (req, res) => {
  try {
    // Busca el curso por ID y lo elimina de la base de datos
    const curso = await Curso.findByIdAndDelete(req.params.id);

    // Si no se encuentra el curso, devuelve error 404
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    // Responde con éxito confirmando la eliminación
    res.json({ success: true, message: "Curso eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar curso" });
  }
});

// Exporta el router para usar estas rutas en la app principal
module.exports = router;
