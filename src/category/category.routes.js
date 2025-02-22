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

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operaciones relacionadas con categorías
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 */
router.get(
  "/",
  validateJWT,
  getAllCategories
);

/**
 * @swagger
 * /categories/addCategory:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.post(
  "/addCategory",
  validateJWT,
  hasRoles("ADMIN"),
  addCategoryValidator,
  addCategory
);

/**
 * @swagger
 * /categories/getCategoryById/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Categoría no encontrada
 */
router.get(
  "/getCategoryById/:id",
  validateJWT,
  hasRoles("ADMIN"),
  getCategoryByIdValidator,
  getCategoryById
);

/**
 * @swagger
 * /categories/updateCategory/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Categoría no encontrada
 */
router.put(
  "/updateCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  updateCategoryValidator,
  updateCategory
);

/**
 * @swagger
 * /categories/deleteCategory/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) una categoría
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría desactivada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Categoría no encontrada
 */
router.delete(
  "/deleteCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  deleteCategoryValidator,
  deleteCategory
);

/**
 * @swagger
 * /categories/activateCategory/{id}:
 *   patch:
 *     summary: Activar una categoría previamente eliminada
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría activada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Categoría no encontrada
 */
router.patch(
  "/activateCategory/:id",
  validateJWT,
  hasRoles("ADMIN"),
  activateCategoryValidator,
  activateCategory
);

export default router;