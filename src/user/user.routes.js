import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./user.controller.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { updateUserValidator } from "../middlewares/user-validators.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.get(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"), // Permite ADMIN y USER
  getUserProfile
);

/**
 * @swagger
 * /update-profile:
 *   put:
 *     summary: Actualiza el perfil del usuario (nombre de usuario, contraseña, foto de perfil)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario
 *     responses:
 *       200:
 *         description: Perfil del usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
router.put(
  "/update-profile",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  uploadProfilePicture.single("profilePicture"),
  updateUserValidator,
  updateUserProfile
);

export default router;