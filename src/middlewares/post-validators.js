import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const createPostValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3 }).withMessage("El título debe tener al menos 3 caracteres"),
  body("category")
    .trim()
    .notEmpty().withMessage("La categoría es obligatoria"),
  body("body")
    .trim()
    .notEmpty().withMessage("El contenido principal es obligatorio"),
  validarCampos,
  handleErrors,
];

export const updatePostValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("El título no puede estar vacío")
    .bail()
    .isLength({ min: 3 }).withMessage("El título debe tener al menos 3 caracteres"),
  body("category")
    .optional()
    .trim()
    .notEmpty().withMessage("La categoría no puede estar vacía"),
  body("body")
    .optional()
    .trim()
    .notEmpty().withMessage("El contenido principal no puede estar vacío"),
  validarCampos,
  handleErrors,
];

export const deletePostValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  validarCampos,
  handleErrors,
];

export const getPostByIdValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  validarCampos,
  handleErrors,
];
