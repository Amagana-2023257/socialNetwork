import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./user.controller.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { updateUserValidator } from "../middlewares/user-validators.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

// Endpoint para obtener el perfil del usuario autenticado
router.get(
  "/",
  validateJWT,
  hasRoles("ADMIN", "USER"), // Permite ADMIN y USER
  getUserProfile
);

// Endpoint para actualizar el perfil (nombre de usuario, contraseña, foto de perfil)
router.put(
  "/update-profile",
  validateJWT,
  hasRoles("ADMIN", "USER"),
  uploadProfilePicture.single("profilePicture"),
  updateUserValidator,
  updateUserProfile
);

export default router;
