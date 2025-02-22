import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación
 */

/**
 * Función para crear el usuario admin si no existe
 */
export const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";

    if (!adminEmail || !adminPassword) {
      console.log("No se encontraron credenciales de admin en las variables de entorno");
      return;
    }

    // Verificar si el admin ya existe por email
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("El usuario admin ya existe");
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(adminPassword);

    // Crear el usuario admin
    const adminUser = new User({
      name: adminName,
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      status: true,
    });
    await adminUser.save();
    console.log("Usuario admin creado exitosamente");
  } catch (err) {
    console.error("Error al crear el usuario admin:", err);
  }
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error en el registro del usuario
 */
export const register = async (req, res) => {
  try {
    const data = req.body;
    let profilePicture = req.file ? req.file.filename : null;
    const encryptedPassword = await hash(data.password);
    data.password = encryptedPassword;
    data.profilePicture = profilePicture;
    
    data.role = "USER";  // Se asigna rol USER

    const user = await User.create(data);

    return res.status(201).json({
      message: "User has been created",
      name: user.name,
      email: user.email
    });
  } catch (err) {
    return res.status(500).json({
      message: "User registration failed",
      error: err.message
    });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el inicio de sesión
 */
export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (!user) {
      return res.status(400).json({
        message: "Crendenciales inválidas",
        error: "No existe el usuario o correo ingresado"
      });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Crendenciales inválidas",
        error: "Contraseña incorrecta"
      });
    }

    const token = await generateJWT(user.id);

    return res.status(200).json({
      message: "Login successful",
      userDetails: {
        token: token,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "login failed, server error",
      error: err.stack || err.message || err
    });
  }
};
