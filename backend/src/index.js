// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Importa Express para crear el servidor
const express = require("express");

// Importa CORS para permitir peticiones desde otros dominios
const cors = require("cors");

// Importa path para manejar rutas de archivos
const path = require("path");

// Conectar a MongoDB (archivo db.js se encarga de la conexión)
require("./db");
console.log("📡 Intentando conectar y levantar servidor...");

// Crear la app de Express
const app = express();

// Middlewares
app.use(cors());           // Permite solicitudes de cualquier origen
app.use(express.json());   // Permite recibir datos en formato JSON

// Importar rutas
const authRoutes = require("./routes/auth");       // Rutas de autenticación
const cursosRoutes = require("./routes/cursos");   // Rutas de cursos
const adminRoutes = require("./routes/admin");     // Rutas de administración
const profileRoutes = require("./routes/profile"); // Rutas del perfil de usuario

// Usar rutas en la app
app.use("/api/auth", authRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

// Servir imágenes de insignias de forma estática
app.use("/badges", express.static(path.join(__dirname, "..", "assets", "badges")));

// Ruta base de prueba
app.get("/", (req, res) => {
  res.json({ message: "Portal Capacitaciones API funcionando 🚀" });
});

// Levantar servidor en puerto definido en .env o 4000 por defecto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
