import Comment from "./comment.model.js";

/**
 * Crear un comentario.
 * Los usuarios pueden comentar en publicaciones para expresar sus opiniones o agregar información.
 */
export const createComment = async (req, res) => {
  try {
    // Obtener el ID del usuario desde req.user o req.usuario
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({ message: "Token de usuario no encontrado" });
    }

    const { text, post } = req.body;
    if (!text || !post) {
      return res.status(400).json({ message: "Se requieren los campos 'text' y 'post'" });
    }

    const comment = new Comment({
      text: text.trim(),
      post, 
      author: uid,
      status: true
    });

    await comment.save();

    return res.status(201).json({
      message: "Comentario creado exitosamente",
      comment
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creando el comentario",
      error: err.message
    });
  }
};

/**
 * Actualizar un comentario por ID.
 * Solo el autor del comentario podrá editarlo.
 */
export const updateComment = async (req, res) => {
  try {
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({ message: "Token de usuario no encontrado" });
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (comment.author.toString() !== uid.toString()) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este comentario" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "El contenido del comentario no puede estar vacío" });
    }
    comment.text = text.trim();
    await comment.save();

    return res.status(200).json({
      message: "Comentario actualizado exitosamente",
      comment
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error actualizando el comentario",
      error: err.message
    });
  }
};

/**
 * Eliminar (desactivar) un comentario por ID.
 * Solo el autor del comentario podrá eliminarlo.
 */
export const deleteComment = async (req, res) => {
    try {
      const uid = req.user?.id || req.usuario?._id;
      if (!uid) {
        return res.status(401).json({ message: "Token de usuario no encontrado" });
      }
  
      const { id } = req.params;
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }
  
      if (comment.author.toString() !== uid.toString()) {
        return res.status(403).json({ message: "No tienes permiso para eliminar este comentario" });
      }
  
      comment.status = false;
      await comment.save();
  
      return res.status(200).json({
        message: "Comentario desactivado exitosamente",
        comment
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error eliminando (desactivando) el comentario",
        error: err.message
      });
    }
  };
  
/**
 * Obtener un comentario por ID.
 */
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id)
      .populate("author", "username email")
      .populate("post", "title");
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
    return res.status(200).json({
      message: "Comentario obtenido exitosamente",
      comment
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo el comentario",
      error: err.message
    });
  }
};

/**
 * Obtener todos los comentarios de una publicación.
 */
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "username email");
    return res.status(200).json({
      message: "Comentarios obtenidos exitosamente",
      comments
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo los comentarios",
      error: err.message
    });
  }
};
