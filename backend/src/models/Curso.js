// Importa la librería mongoose para interactuar con la base de datos MongoDB
const mongoose = require("mongoose");

// Extrae el constructor Schema de mongoose para definir la estructura de los documentos
const Schema = mongoose.Schema;

// Define el esquema para la colección de cursos
const cursoSchema = new Schema({
  // Campo 'title': título del curso, obligatorio
  title: { type: String, required: true },

  // Campo 'module': módulo al que pertenece el curso, obligatorio
  module: { type: String, required: true },

  // Campo 'description': descripción del curso, opcional
  description: String,

  // Campo 'badge_image': imagen o insignia asociada al curso, opcional
  badge_image: String,
});

// Crea y exporta el modelo 'Curso' basado en el esquema definido
// Permite interactuar con la colección 'cursos' en la base de datos
module.exports = mongoose.model("Curso", cursoSchema);
