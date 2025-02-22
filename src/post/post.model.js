import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - body
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la publicación
 *           example: "Mi primer post"
 *         category:
 *           type: string
 *           description: ID de la categoría de la publicación
 *           example: "603d2149fc13ae1a3c000001"
 *         body:
 *           type: string
 *           description: Contenido principal de la publicación
 *           example: "Este es el contenido de mi primer post."
 *         author:
 *           type: string
 *           description: ID del autor de la publicación
 *           example: "603d2149fc13ae1a3c000002"
 *         status:
 *           type: boolean
 *           description: Estado de la publicación (activa/inactiva)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la publicación
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la publicación
 *           example: "2023-01-01T00:00:00.000Z"
 */

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"]
    },
    body: {
      type: String,
      required: [true, "El contenido principal es obligatorio"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El autor es obligatorio"]
    },
    status: {
      type: Boolean,
      default: true,
      description: "Estado de la publicación: true = activa, false = desactivada"
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
