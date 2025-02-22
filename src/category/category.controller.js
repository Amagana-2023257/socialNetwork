import Category from "./category.model.js";

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operaciones relacionadas con categorías
 */

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
 *         description: La categoría ya existe
 *       500:
 *         description: Error creando la categoría
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
 *       500:
 *         description: Error obteniendo las categorías
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
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error obteniendo la categoría
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
 *               status:
 *                 type: boolean
 *                 description: Estado de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error actualizando la categoría
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
 *         description: No se puede eliminar la categoría por defecto
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error eliminando la categoría
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
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error activando la categoría
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