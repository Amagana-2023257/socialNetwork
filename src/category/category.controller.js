import Category from "./category.model.js";

/**
 * Crear una nueva categoría.
 * Solo el administrador puede crear nuevas categorías.
 */
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si la categoría ya existe (por nombre)
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        message: "La categoría ya existe"
      });
    }

    const category = new Category({
      name: name.trim(),
      description: description ? description.trim() : ""
    });

    await category.save();
    return res.status(201).json({
      message: "Categoría creada exitosamente",
      category
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creando la categoría",
      error: err.message
    });
  }
};

/**
 * Obtener todas las categorías.
 */
export const getAllCategories = async (req, res) => {
  try {
    // Se pueden filtrar por estado si es necesario (ej. { status: true })
    const categories = await Category.find();
    return res.status(200).json({
      message: "Categorías obtenidas exitosamente",
      categories
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo las categorías",
      error: err.message
    });
  }
};

/**
 * Obtener una categoría por ID.
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }
    return res.status(200).json({
      message: "Categoría obtenida exitosamente",
      category
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo la categoría",
      error: err.message
    });
  }
};

/**
 * Actualizar una categoría por ID.
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Solo se permiten actualizar los campos name, description y status
    const { name, description, status } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    return res.status(200).json({
      message: "Categoría actualizada exitosamente",
      category: updatedCategory
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error actualizando la categoría",
      error: err.message
    });
  }
};

/**
 * Eliminar (desactivar) una categoría.
 * Se realiza un soft delete estableciendo status a false.
 * No se permite eliminar la categoría por defecto.
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    if (category.isDefault) {
      return res.status(400).json({
        message: "No se puede eliminar la categoría por defecto"
      });
    }

    category.status = false;
    await category.save();

    return res.status(200).json({
      message: "Categoría eliminada (desactivada) exitosamente",
      category
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error eliminando la categoría",
      error: err.message
    });
  }
};

/**
 * Activar una categoría (estableciendo status a true).
 */
export const activateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada"
      });
    }

    category.status = true;
    await category.save();

    return res.status(200).json({
      message: "Categoría activada exitosamente",
      category
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error activando la categoría",
      error: err.message
    });
  }
};
