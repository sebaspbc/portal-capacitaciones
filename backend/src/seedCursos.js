// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Importa la conexión a MongoDB
const mongoose = require("./db");

// Importa el modelo Curso para poder insertar cursos
const Curso = require("./models/Curso");

// Función para insertar cursos de ejemplo en la base de datos
async function seedCursos() {
  try {
    // Elimina todos los cursos existentes para empezar limpio
    await Curso.deleteMany({});

    // Insertar cursos de ejemplo
    await Curso.insertMany([
      {
        title: "Introducción a Bases de Datos", // Nombre del curso
        module: "Backend",                      // Módulo al que pertenece
        description: "Conceptos básicos de SQL y NoSQL.", // Descripción
        content: "Contenido del curso..."       // Contenido (placeholder)
      },
      {
        title: "Fundamentos de Node.js",
        module: "Backend",
        description: "Aprende Node.js desde cero.",
        content: "Contenido del curso..."
      },
      {
        title: "HTML y CSS Avanzado",
        module: "Frontend",
        description: "Construcción de interfaces modernas.",
        content: "Contenido del curso..."
      }
    ]);

    console.log("✅ Cursos de ejemplo insertados");

    // Salir del script
    process.exit();
  } catch (err) {
    console.error("❌ Error al insertar cursos:", err);
    process.exit(1); // Salir con error si falla algo
  }
}

// Ejecutar la función
seedCursos();
