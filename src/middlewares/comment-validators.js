import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

// Validador para agregar un nuevo comentario
export const createCommentValidator = [
  body("text")
    .trim()
    .notEmpty().withMessage("El contenido del comentario es requerido")
    .bail(),
  body("post")
    .trim()
    .notEmpty().withMessage("El ID de la publicación es obligatorio")
    .bail()
    .isMongoId().withMessage("No es un ID válido de la publicación"),
  validarCampos,
  handleErrors,
];

// Validador para obtener un comentario por ID
export const getCommentByIdValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  validarCampos,
  handleErrors,
];

// Validador para actualizar un comentario
export const updateCommentValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  body("text")
    .trim()
    .notEmpty().withMessage("El contenido del comentario no puede estar vacío")
    .bail(),
  validarCampos,
  handleErrors,
];

// Validador para eliminar (desactivar) un comentario
export const deleteCommentValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido"),
  validarCampos,
  handleErrors,
];

// Validador para obtener todos los comentarios de una publicación
export const getCommentsByPostValidator = [
  param("postId")
    .isMongoId().withMessage("No es un ID válido para la publicación"),
  validarCampos,
  handleErrors,
];
