import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - author
 *         - post
 *       properties:
 *         text:
 *           type: string
 *           description: Contenido del comentario
 *           example: "Este es un comentario de ejemplo."
 *         author:
 *           type: string
 *           description: ID del autor del comentario
 *           example: "603d2149fc13ae1a3c000002"
 *         post:
 *           type: string
 *           description: ID de la publicación a la que pertenece el comentario
 *           example: "603d2149fc13ae1a3c000001"
 *         status:
 *           type: boolean
 *           description: Estado del comentario (activo/inactivo)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del comentario
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del comentario
 *           example: "2023-01-01T00:00:00.000Z"
 */

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "El contenido del comentario es obligatorio"],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El autor del comentario es obligatorio"]
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "La publicación es obligatoria"]
    },
    status: {
      type: Boolean,
      default: true,
      description: "Estado del comentario: true = activo, false = desactivado"
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
