// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Importa bcryptjs para encriptar contraseñas
const bcrypt = require("bcryptjs");

// Importa la conexión a MongoDB
const mongoose = require("./db");

// Importa el modelo User para crear usuarios
const User = require("./models/User");

// Función autoejecutable para crear el usuario admin
(async () => {
  try {
    // Verificar si ya existe un admin con este email
    const exists = await User.findOne({ email: "admin@example.com" });
    if (exists) {
      console.log("⚠️ Admin ya existe");
      process.exit(); // Salir del script si ya existe
    }

    // Encriptar la contraseña del admin
    const hashed = await bcrypt.hash("admin123", 10);

    // Crear el usuario admin
    const admin = new User({
      name: "Admin",                   // Nombre
      email: "admin@example.com",      // Email
      password: hashed,                // Contraseña encriptada
      is_admin: true,                  // Marcar como administrador
    });

    // Guardar el admin en la base de datos
    await admin.save();
    console.log("✅ Usuario admin creado con éxito");

    // Salir del script
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1); // Salir con error si algo falla
  }
})();
