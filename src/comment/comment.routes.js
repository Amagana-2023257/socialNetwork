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
 * Crear un nuevo comentario.
 * Solo usuarios autenticados con rol ADMIN o USER pueden crear comentarios.
 */
router.post(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  createCommentValidator,
  createComment
);

/**
 * Actualizar un comentario por ID.
 * Solo el autor del comentario (con rol ADMIN o USER) puede editarlo.
 */
router.put(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  updateCommentValidator,
  updateComment
);

/**
 * Eliminar (desactivar) un comentario por ID.
 * Solo el autor del comentario (con rol ADMIN o USER) puede eliminarlo.
 */
router.delete(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  deleteCommentValidator,
  deleteComment
);

/**
 * Obtener un comentario por ID.
 * Este endpoint requiere autenticación y rol ADMIN o USER.
 */
router.get(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getCommentByIdValidator,
  getCommentById
);

/**
 * Obtener todos los comentarios de una publicación.
 * Este endpoint requiere autenticación y rol ADMIN o USER.
 */
router.get(
  "/post/:postId",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getCommentsByPostValidator,
  getCommentsByPost
);

export default router;
