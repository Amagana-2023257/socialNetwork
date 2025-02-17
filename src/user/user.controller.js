import { hash, verify } from "argon2";
import User from "../user/user.model.js";

/**
 * Obtener el perfil de un usuario
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.usuario._id);  

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            userProfile: {
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching user profile",
            error: err.message
        });
    }
};


/**
 * Actualizar el perfil de un usuario (nombre de usuario, contraseña, foto de perfil)
 */
export const updateUserProfile = async (req, res) => {
    try {
        const { username, password, newPassword } = req.body;
        const updatedData = {};

        // Verificar si la contraseña actual es correcta
        if (password && newPassword) {
            const validPassword = await verify(req.user.password, password);
            if (!validPassword) {
                return res.status(400).json({
                    message: "Invalid password",
                    error: "The current password is incorrect"
                });
            }

            // Si la contraseña es correcta, se actualiza a la nueva
            updatedData.password = await hash(newPassword);
        }

        // Actualizar el nombre de usuario si se proporciona
        if (username) {
            updatedData.username = username;
        }

        // Si se proporciona una foto de perfil, se actualiza
        if (req.file) {
            updatedData.profilePicture = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User profile updated successfully",
            userProfile: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error updating user profile",
            error: err.message
        });
    }
}

/**
 * Eliminar un perfil de usuario
 */
export const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User profile deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error deleting user profile",
            error: err.message
        });
    }
}
