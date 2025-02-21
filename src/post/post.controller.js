import Post from "./post.model.js";

/**
 * Crear una nueva publicación.
 * Los usuarios pueden crear publicaciones para expresar sus opiniones.
 * Cada publicación debe incluir título, categoría y contenido principal.
 */
export const createPost = async (req, res) => {
  try {
    // Se obtiene el ID del usuario desde req.user o req.usuario
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({
        message: "Token de usuario no encontrado"
      });
    }

    const { title, category, body } = req.body;
    if (!title || !category || !body) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios: título, categoría y contenido"
      });
    }

    const post = new Post({
      title: title.trim(),
      category,
      body,
      author: uid,  // Se utiliza el ID del usuario autenticado
      status: true  // La publicación se crea como activa
    });

    await post.save();

    return res.status(201).json({
      message: "Publicación creada exitosamente",
      post
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creando la publicación",
      error: err.message
    });
  }
};

/**
 * Actualizar una publicación por ID.
 * Solo el autor de la publicación puede editarla.
 */
export const updatePost = async (req, res) => {
  try {
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({
        message: "Token de usuario no encontrado"
      });
    }

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Publicación no encontrada"
      });
    }

    if (post.author.toString() !== uid.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar esta publicación"
      });
    }

    const { title, category, body } = req.body;
    if (title) post.title = title.trim();
    if (category) post.category = category;
    if (body) post.body = body;

    await post.save();

    return res.status(200).json({
      message: "Publicación actualizada exitosamente",
      post
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error actualizando la publicación",
      error: err.message
    });
  }
};

/**
 * "Eliminar" (desactivar) una publicación por ID.
 * En lugar de eliminar físicamente la publicación, se realiza un soft delete (status a false).
 * Solo el autor de la publicación puede realizar esta acción.
 */
export const deletePost = async (req, res) => {
  try {
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({
        message: "Token de usuario no encontrado"
      });
    }

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Publicación no encontrada"
      });
    }

    if (post.author.toString() !== uid.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar esta publicación"
      });
    }

    // Soft delete: cambiar status a false
    post.status = false;
    await post.save();

    return res.status(200).json({
      message: "Publicación desactivada exitosamente",
      post
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error eliminando (desactivando) la publicación",
      error: err.message
    });
  }
};

/**
 * Obtener una publicación por ID.
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("author", "username email")
      .populate("category", "name");
    if (!post) {
      return res.status(404).json({
        message: "Publicación no encontrada"
      });
    }
    return res.status(200).json({
      message: "Publicación obtenida exitosamente",
      post
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo la publicación",
      error: err.message
    });
  }
};

/**
 * Obtener todas las publicaciones.
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("category", "name");
    return res.status(200).json({
      message: "Publicaciones obtenidas exitosamente",
      posts
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo las publicaciones",
      error: err.message
    });
  }
};
