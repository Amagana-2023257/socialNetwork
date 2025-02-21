import mongoose from "mongoose";

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
