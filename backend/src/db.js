// Importa mongoose para conectarse y manejar MongoDB
const mongoose = require("mongoose");

// URL de conexión a la base de datos (usa variable de entorno si existe, si no, local)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/portal";

// Conecta mongoose a la base de datos
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,     // permite usar el parser moderno de URL
  useUnifiedTopology: true,  // usa el motor de topología más reciente
});

// Evento: conexión exitosa
mongoose.connection.on("connected", () => {
  console.log("✅ Conectado a MongoDB Atlas");
});

// Evento: error de conexión
mongoose.connection.on("error", (err) => {
  console.error("❌ Error en conexión MongoDB:", err);
});

// Exporta la conexión para usarla en otros archivos de la app
module.exports = mongoose;
