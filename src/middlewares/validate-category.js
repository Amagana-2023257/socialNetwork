import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

// Validador para agregar una nueva categoría
export const addCategoryValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("El nombre de la categoría es requerido")
    .bail() // Si está vacío, detiene la cadena y no sigue con más validaciones
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
  
  body("description")
    .optional()
    .trim(),
  
  validarCampos,
  handleErrors,
];

// Validador para obtener una categoría por ID
export const getCategoryByIdValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  
  validarCampos,
  handleErrors,
];

// Validador para actualizar una categoría
export const updateCategoryValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
  
  body("description")
    .optional()
    .trim(),
  
  body("status")
    .optional()
    .isBoolean().withMessage("El estado debe ser un valor booleano"),
  
  validarCampos,
  handleErrors,
];

// Validador para eliminar (desactivar) una categoría
export const deleteCategoryValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  
  validarCampos,
  handleErrors,
];

// Validador para activar una categoría
export const activateCategoryValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  
  validarCampos,
  handleErrors,
];
