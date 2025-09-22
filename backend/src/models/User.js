// Importa mongoose para interactuar con la base de datos MongoDB
const mongoose = require("mongoose");

// Extrae el constructor Schema de mongoose para definir la estructura de los documentos
const Schema = mongoose.Schema;

// Define el esquema para la colección de usuarios
const userSchema = new Schema({
  // Nombre del usuario, obligatorio
  name: { type: String, required: true },

  // Correo electrónico del usuario, obligatorio y único
  // No se pueden repetir registros con el mismo email
  email: { type: String, unique: true, required: true },

  // Contraseña del usuario, obligatorio
  password: { type: String, required: true },

  // Indica si el usuario tiene permisos de administrador
  // Por defecto se establece como falso
  is_admin: { type: Boolean, default: false },
});

// Crea y exporta el modelo 'User' basado en el esquema definido
// Permite interactuar con la colección 'users' en la base de datos
module.exports = mongoose.model("User", userSchema);
