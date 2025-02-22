import { Router } from "express";
import { 
  createPost, 
  updatePost, 
  deletePost, 
  getPostById, 
  getAllPosts 
} from "./post.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { 
  createPostValidator, 
  updatePostValidator, 
  deletePostValidator, 
  getPostByIdValidator 
} from "../middlewares/post-validators.js";

const router = Router();

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
 *               content:
 *                 type: string
 *                 description: Contenido de la publicación
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.post(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  createPostValidator,
  createPost
);

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
 *               content:
 *                 type: string
 *                 description: Contenido de la publicación
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Publicación no encontrada
 */
router.put(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  updatePostValidator,
  updatePost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar una publicación por ID
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
 *         description: Publicación eliminada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Publicación no encontrada
 */
router.delete(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  deletePostValidator,
  deletePost
);

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
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Publicación no encontrada
 */
router.get(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getPostByIdValidator,
  getPostById
);

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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.get(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getAllPosts
);

export default router;
