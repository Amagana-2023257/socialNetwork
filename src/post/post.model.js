import mongoose from "mongoose";

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
