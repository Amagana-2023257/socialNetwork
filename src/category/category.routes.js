import { Router } from "express";
import { 
  addCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory, 
  activateCategory 
} from "./category.controller.js";
import { 
  addCategoryValidator, 
  getCategoryByIdValidator, 
  updateCategoryValidator, 
  deleteCategoryValidator, 
  activateCategoryValidator 
} from "../middlewares/validate-category.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

/*
  GET / - Obtener todas las categorías.
  Se permite a cualquier usuario autenticado visualizar las categorías.
*/
router.get(
  "/",
  validateJWT,
  getAllCategories
);

/*
  POST /addCategory - Crear una nueva categoría.
  Solo el administrador (rol ADMIN) puede agregar categorías.
*/
router.post(
  "/addCategory",
  validateJWT,
  hasRoles("ADMIN"),
  addCategoryValidator,
  addCategory
);

/*
  GET /getCategoryById/:id - Obtener una categoría por ID.
  Solo el administrador tiene acceso a este endpoint (opcional, se puede ajustar si se desea que otros usuarios puedan visualizar).
*/
router.get(
  "/getCategoryById/:id",
  validateJWT,
  hasRoles("ADMIN"),
  getCategoryByIdValidator,
  getCategoryById
);

/*
  PUT /updateCategory/:id - Actualizar una categoría por ID.
  Solo el administrador puede editar las categorías.
*/
router.put(
  "/updateCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  updateCategoryValidator,
  updateCategory
);

/*
  DELETE /deleteCategory/:id - Eliminar (desactivar) una categoría.
  Solo el administrador puede eliminar categorías. Se evita eliminar la categoría por defecto.
*/
router.delete(
  "/deleteCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  deleteCategoryValidator,
  deleteCategory
);

/*
  PATCH /activateCategory/:id - Activar una categoría previamente eliminada.
  Solo el administrador puede reactivar una categoría.
*/
router.patch(
  "/activateCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  activateCategoryValidator,
  activateCategory
);

export default router;
