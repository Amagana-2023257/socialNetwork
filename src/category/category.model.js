import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre único de la categoría
 *           example: "Tecnología"
 *         description:
 *           type: string
 *           description: Descripción opcional de la categoría
 *           example: "Categoría relacionada con artículos de tecnología"
 *         status:
 *           type: boolean
 *           description: Indica si la categoría está activa
 *           example: true
 *         isDefault:
 *           type: boolean
 *           description: Indica si esta categoría es la categoría por defecto del sistema
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la categoría
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la categoría
 *           example: "2023-01-01T00:00:00.000Z"
 */

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      description: "Nombre único de la categoría"
    },
    description: {
      type: String,
      trim: true,
      default: "",
      description: "Descripción opcional de la categoría"
    },
    status: {
      type: Boolean,
      default: true,
      description: "Indica si la categoría está activa"
    },
    isDefault: {
      type: Boolean,
      default: false,
      description: "Indica si esta categoría es la categoría por defecto del sistema"
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;