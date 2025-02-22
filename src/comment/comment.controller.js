import Comment from "./comment.model.js";

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Operaciones relacionadas con comentarios
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crear un comentario
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Contenido del comentario
 *               post:
 *                 type: string
 *                 description: ID de la publicación a la que pertenece el comentario
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Se requieren los campos 'text' y 'post'
 *       401:
 *         description: Token de usuario no encontrado
 *       500:
 *         description: Error creando el comentario
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
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Actualizar un comentario por ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       400:
 *         description: El contenido del comentario no puede estar vacío
 *       401:
 *         description: Token de usuario no encontrado
 *       403:
 *         description: No tienes permiso para actualizar este comentario
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error actualizando el comentario
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
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) un comentario por ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario desactivado exitosamente
 *       401:
 *         description: Token de usuario no encontrado
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error eliminando (desactivando) el comentario
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
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error obteniendo el comentario
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
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Obtener todos los comentarios de una publicación
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error obteniendo los comentarios
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