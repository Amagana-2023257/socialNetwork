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
 * Crear una nueva publicación.
 * Solo usuarios autenticados con rol ADMIN o USER pueden crear publicaciones.
 */
router.post(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  createPostValidator,
  createPost
);

/**
 * Actualizar una publicación por ID.
 * Solo el autor de la publicación (que tenga rol ADMIN o USER) puede actualizarla.
 */
router.put(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  updatePostValidator,
  updatePost
);

/**
 * Eliminar una publicación por ID.
 * Solo el autor de la publicación (que tenga rol ADMIN o USER) puede eliminarla.
 */
router.delete(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  deletePostValidator,
  deletePost
);

/**
 * Obtener una publicación por ID.
 * Este endpoint requiere autenticación y rol (ADMIN o USER).
 */
router.get(
  "/:id",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getPostByIdValidator,
  getPostById
);

/**
 * Obtener todas las publicaciones.
 * Este endpoint requiere autenticación y rol (ADMIN o USER).
 */
router.get(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  getAllPosts
);

export default router;
