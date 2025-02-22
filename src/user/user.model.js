import mongoose from "mongoose";

const roleEnum = ['USER', 'ADMIN']; 

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
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
      default: "USER" 
    },
    status: {
      type: Boolean,
      default: true 
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
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           unique: true
 *           example: "John Doe"
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *           unique: true
 *           example: "johndoe"
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *           unique: true
 *           format: email
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           minlength: 6
 *           example: "password123"
 *         profilePicture:
 *           type: string
 *           description: URL de la foto de perfil del usuario
 *           example: "http://example.com/profile.jpg"
 *         role:
 *           type: string
 *           description: Rol del usuario
 *           enum:
 *             - USER
 *             - ADMIN
 *           example: "USER"
 *         status:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del usuario
 *           example: "2023-01-01T00:00:00.000Z"
 */