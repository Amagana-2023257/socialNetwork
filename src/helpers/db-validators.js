import User from "../user/user.model.js";

export const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
  return true;
};

export const blockRole = (value) => {
  if (value) {
    throw new Error("No puedes asignar el rol. Será asignado automáticamente como 'CLIENT'. Contacta a un Administrador.");
  }
  return true;
};

export const userExists = async (uid = "") => {
  const exists = await User.findById(uid);
  if (!exists) {
    throw new Error("No existe un usuario con el ID proporcionado");
  }
  return true;
};

export const userExistsToken = async (value, { req }) => {
  const uidFromToken = req.user && req.user.id;
  if (!uidFromToken) {
    throw new Error("ID de usuario no disponible en el token");
  }
  if (value && value !== uidFromToken.toString()) {
    throw new Error("No tiene permisos para actualizar este usuario");
  }
  const user = await User.findById(uidFromToken);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return true;
};

export const pictureExist = (value, { req }) => {
  if (!req.file) {
    throw new Error("Se requiere un archivo de imagen");
  }
  return true;
};

export const searchProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("El producto no existe.");
  }
  return true;
};
