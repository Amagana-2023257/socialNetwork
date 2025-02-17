import { Router } from "express";
import { getUserProfile, updateUserProfile, deleteUserProfile } from "./user.controller.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validateJWT } from "../middlewares/validate-jwt.js"; 
import { deleteUserValidator, updateUserValidator, getUserByIdValidator} from "../middlewares/user-validators.js"

const router = Router();

router.get(
    "/",
    validateJWT,
    getUserProfile
);

router.put(
    "/update-profile",
    validateJWT,  
    uploadProfilePicture.single("profilePicture"), 
    updateUserValidator,
    updateUserProfile
);

router.delete(
    "/delete",
    validateJWT,
    deleteUserValidator,
    deleteUserProfile
);

export default router;
