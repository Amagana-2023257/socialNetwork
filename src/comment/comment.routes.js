import { Router } from "express";
import { 
  createComment, 
  updateComment, 
  deleteComment, 
  getCommentById, 
  getCommentsByPost 
} from "./comment.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { 
  createCommentValidator, 
  updateCommentValidator, 
  deleteCommentValidator, 
  getCommentByIdValidator, 
  getCommentsByPostValidator 
} from "../middlewares/comment-validators.js";

const router = Router();

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
 *     summary: Crear un nuevo comentario
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
 *               postId:
 *                 type: string
 *                 description: ID de la publicación a la que pertenece el comentario
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
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
  createCommentValidator,
  createComment
);

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
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Comentario no encontrado
 */
router.put(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  updateCommentValidator,
  updateComment
);

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
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Comentario no encontrado
 */
router.delete(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  deleteCommentValidator,
  deleteComment
);

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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Comentario no encontrado
 */
router.get(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getCommentByIdValidator,
  getCommentById
);

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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.get(
  "/post/:postId",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getCommentsByPostValidator,
  getCommentsByPost
);

export default router;
