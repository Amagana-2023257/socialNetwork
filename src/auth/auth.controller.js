import { hash, verify } from "argon2"
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js";



export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;
        data.profilePicture = profilePicture;
        
        data.role = "USER"; 

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
}


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
        console.log('Password valid:', validPassword); 

        if (!validPassword) {
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error: "Contraseña incorrecta"
            });
        }

        const token = await generateJWT(user.id);
        console.log('JWT Token:', token); 

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.log(err); 
        return res.status(500).json({
            message: "login failed, server error",
            error: err.stack || err.message || err
        });
    }
};


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos del usuario para crear una cuenta.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único.
 *                 example: "usuario123"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "usuario123@mail.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 6 caracteres).
 *                 example: "password123"
 *               profilePicture:
 *                 type: string
 *                 description: Foto de perfil (opcional).
 *                 example: "profile-pic.jpg"
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has been created"
 *                 name:
 *                   type: string
 *                   example: "usuario123"
 *                 email:
 *                   type: string
 *                   example: "usuario123@mail.com"
 *       400:
 *         description: Error en los datos proporcionados.
 *       500:
 *         description: Error en el servidor durante el registro del usuario.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con un usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos de inicio de sesión del usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario (opcional si se usa username).
 *                 example: "usuario123@mail.com"
 *               username:
 *                 type: string
 *                 description: Nombre de usuario (opcional si se usa email).
 *                 example: "usuario123"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT de autenticación.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     profilePicture:
 *                       type: string
 *                       description: Foto de perfil del usuario.
 *                       example: "profile-pic.jpg"
 *       400:
 *         description: Credenciales inválidas (usuario no encontrado o contraseña incorrecta).
 *       500:
 *         description: Error en el servidor durante el inicio de sesión.
 */
