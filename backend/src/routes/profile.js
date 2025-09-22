// Importa Express para crear rutas y manejar peticiones HTTP
const express = require("express");
const router = express.Router();

// Importa JWT para manejar tokens de autenticación
const jwt = require("jsonwebtoken");

// Importa los modelos User, Progreso y Curso
const User = require("../models/User");
const Progreso = require("../models/Progreso");
const Curso = require("../models/Curso");

// Define la clave secreta para firmar y verificar JWT
const secret = process.env.JWT_SECRET || "token_ejemplo_123";

// Middleware: verifica que el usuario esté autenticado
function verifyUser(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No autorizado" });

  try {
    const token = header.split(" ")[1];
    const user = jwt.verify(token, secret);
    req.user = user; // guardamos los datos del usuario en la request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// GET /api/profile → devuelve los datos del usuario y su progreso en los cursos
router.get("/", verifyUser, async (req, res) => {
  try {
    // Busca el usuario en la base de datos, excluyendo el password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Busca todos los progresos del usuario
    const progresos = await Progreso.find({ user_id: user._id });
    const progresoMap = {};
    progresos.forEach(p => {
      progresoMap[p.curso_id] = p.state; // mapea curso_id → estado
    });

    // Trae todos los cursos y agrega el progreso del usuario
    const cursos = await Curso.find({});
    const cursosConProgreso = cursos.map(curso => ({
      ...curso.toObject(),
      progress: progresoMap[curso._id] || null
    }));

    // Devuelve datos del usuario junto con sus cursos y progreso
    res.json({
      user,
      cursos: cursosConProgreso
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// Exporta el router para usar estas rutas en la app principal
module.exports = router;
