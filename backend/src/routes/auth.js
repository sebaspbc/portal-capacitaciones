// Importa Express para crear rutas y manejar peticiones HTTP
const express = require("express");
const router = express.Router();

// Importa bcryptjs para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");

// Importa JWT para generar tokens de autenticación
const jwt = require("jsonwebtoken");

// Importa el modelo User para interactuar con la colección 'users'
const User = require("../models/User");

// Define la clave secreta para firmar y verificar JWT
const secret = process.env.JWT_SECRET || "token_ejemplo_123";

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  try {
    // Obtiene los datos enviados en el body de la petición
    const { name, email, password } = req.body;

    // Verifica que no falten campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos" });
    }

    // Comprueba si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario con los datos recibidos y contraseña encriptada
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      is_admin: false, // por defecto no es administrador
    });

    // Guarda el usuario en la base de datos
    await newUser.save();

    // 🔹 Genera un token JWT inmediatamente para autenticación
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, is_admin: newUser.is_admin },
      secret,
      { expiresIn: "8h" }
    );

    // Responde con éxito, token y datos del usuario
    res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        is_admin: newUser.is_admin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para iniciar sesión de un usuario existente
router.post("/login", async (req, res) => {
  try {
    // Obtiene los datos enviados en el body de la petición
    const { email, password } = req.body;

    // Busca al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Compara la contraseña enviada con la almacenada en la base de datos
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Genera un token JWT para el usuario autenticado
    const token = jwt.sign(
      { id: user._id, email: user.email, is_admin: user.is_admin },
      secret,
      { expiresIn: "8h" }
    );

    // Responde con token y datos del usuario
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Exporta el router para usar estas rutas en la app principal
module.exports = router;
