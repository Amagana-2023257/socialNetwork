import mongoose from "mongoose";

const roleEnum = ['USER', 'ADMIN']; 

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (v) => /\S+@\S+\.\S+/.test(v),
                message: (props) => `${props.value} no es un correo electrónico válido`
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePicture: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: roleEnum,
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario único.
 *           example: "usuario123"
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario.
 *           example: "usuario123@mail.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario (mínimo 6 caracteres).
 *           example: "password123"
 *         profilePicture:
 *           type: string
 *           description: Foto de perfil del usuario (opcional).
 *           example: "profile-pic.jpg"
 *         role:
 *           type: string
 *           description: Rol del usuario (admin o user). Controla los permisos.
 *           enum: [user, admin]
 *           example: "user"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cuenta del usuario.
 *           example: "2025-02-12T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización de la cuenta del usuario.
 *           example: "2025-02-12T14:00:00Z"
 *       required:
 *         - username
 *         - email
 *         - password
 *         - createdAt
 *         - updatedAt
 *         - role
 */
