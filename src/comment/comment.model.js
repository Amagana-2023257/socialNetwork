import mongoose from "mongoose";

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
