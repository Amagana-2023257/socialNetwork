// user.controller.js
import { hash, verify } from "argon2";
import User from "../user/user.model.js";

/**
 * Obtener el perfil de un usuario
 */
export const getUserProfile = async (req, res) => {
  try {
    // Se obtiene el ID del usuario desde req.user o req.usuario
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({
        message: "Token de usuario no encontrado"
      });
    }

    const user = await User.findById(uid);  
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

    // Se obtiene el ID del usuario desde req.user o req.usuario
    const uid = req.user?.id || req.usuario?._id;
    if (!uid) {
      return res.status(401).json({
        message: "Token de usuario no encontrado"
      });
    }

    const currentUser = await User.findById(uid);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Si se desea cambiar la contraseña, se verifica la contraseña actual
    if (password && newPassword) {
      const validPassword = await verify(currentUser.password, password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid password",
          error: "The current password is incorrect"
        });
      }
      updatedData.password = await hash(newPassword);
    }

    if (username) {
      updatedData.username = username;
    }

    if (req.file) {
      updatedData.profilePicture = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(uid, updatedData, { new: true });
    return res.status(200).json({
      message: "User profile updated successfully",
      userProfile: {
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating user profile",
      error: err.message
    });
  }
};
