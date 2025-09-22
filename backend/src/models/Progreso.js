// Importa mongoose para interactuar con la base de datos MongoDB
const mongoose = require("mongoose");

// Extrae el constructor Schema de mongoose para definir la estructura de los documentos
const Schema = mongoose.Schema;

// Define el esquema para la colección de progresos de usuarios en cursos
const progresoSchema = new Schema({
  // Referencia al usuario que realiza el curso, obligatorio
  // Se conecta con el modelo 'User'
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Referencia al curso correspondiente, obligatorio
  // Se conecta con el modelo 'Curso'
  curso_id: { type: Schema.Types.ObjectId, ref: "Curso", required: true },

  // Estado del progreso del curso
  // Solo puede ser "iniciado", "completado" o "pendiente"
  // Por defecto se establece como "iniciado"
  state: { type: String, enum: ["iniciado", "completado", "pendiente"], default: "iniciado" },

  // Fecha de la última actualización del progreso
  // Se asigna automáticamente al crear el registro
  updated_at: { type: Date, default: Date.now },
});

// Crea y exporta el modelo 'Progreso' basado en el esquema definido
// Permite interactuar con la colección 'progresos' en la base de datos
module.exports = mongoose.model("Progreso", progresoSchema);
