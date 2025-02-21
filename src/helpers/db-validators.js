import User from "../user/user.model.js";

// Verifica si el correo ya está registrado
export const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
  return true;
};

// Bloquea la asignación de rol en el registro (si se intenta enviar rol)
export const blockRole = (value) => {
  if (value) {
    throw new Error("No puedes asignar el rol. Será asignado automáticamente como 'CLIENT'. Contacta a un Administrador.");
  }
  return true;
};

// Verifica si el usuario existe por ID (usado en validaciones de rutas)
export const userExists = async (uid = "") => {
  const exists = await User.findById(uid);
  if (!exists) {
    throw new Error("No existe un usuario con el ID proporcionado");
  }
  return true;
};

// Verifica que el ID enviado en el body coincida con el del token y que el usuario exista
export const userExistsToken = async (value, { req }) => {
  // Se asume que el middleware de JWT asigna el usuario en req.user
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

// Verifica que se haya enviado un archivo de imagen
export const pictureExist = (value, { req }) => {
  if (!req.file) {
    throw new Error("Se requiere un archivo de imagen");
  }
  return true;
};

// Ejemplo de verificación para búsqueda de producto (si es necesario)
export const searchProduct = async (productId) => {
  // Se debe importar el modelo Product si se usa
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("El producto no existe.");
  }
  return true;
};
