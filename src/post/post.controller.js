import Post from "./post.model.js";

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Operaciones relacionadas con publicaciones
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la publicación
 *               category:
 *                 type: string
 *                 description: ID de la categoría de la publicación
 *               body:
 *                 type: string
 *                 description: Contenido principal de la publicación
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Todos los campos son obligatorios
 *       401:
 *         description: Token de usuario no encontrado
 *       500:
 *         description: Error creando la publicación
 */
export const createPost = async (req, res) => {
  try {
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
      author: uid,  
      status: true  
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
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar una publicación por ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la publicación
 *               category:
 *                 type: string
 *                 description: ID de la categoría de la publicación
 *               body:
 *                 type: string
 *                 description: Contenido principal de la publicación
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: Token de usuario no encontrado
 *       403:
 *         description: No tienes permiso para actualizar esta publicación
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error actualizando la publicación
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
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) una publicación por ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación desactivada exitosamente
 *       401:
 *         description: Token de usuario no encontrado
 *       403:
 *         description: No tienes permiso para eliminar esta publicación
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error eliminando (desactivando) la publicación
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
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener una publicación por ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error obteniendo la publicación
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
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error obteniendo las publicaciones
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