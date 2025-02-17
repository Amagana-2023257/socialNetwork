import { body, param, validationResult } from "express-validator"; 
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { emailExists, blockRole, userExists, userExistsToken, blockToken, pictureExist } from "../helpers/db-validators.js"

export const registerValidator = [
  body("name")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

  body("email")
    .isEmail().withMessage("El correo electrónico no es válido")
    .normalizeEmail() 
    .custom(emailExists), 

  body("password")
    .notEmpty().withMessage("La contraseña es requerida")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("role")
    .optional() 
    .custom(blockRole), 

  validarCampos, 
  handleErrors,
];

export const loginValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("username")
    .optional()
    .isString()
    .withMessage("El nombre de usuario debe ser una cadena de caracteres"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),
  validarCampos,
  handleErrors,
];



export const getUserByIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB")
    .custom(userExists),
  validarCampos,
  handleErrors,
];

export const updateUserValidator = [
  body("_id")
    .custom(userExistsToken),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .optional()
    .isIn(["ADMIN", "CLIENT"])
    .withMessage("El rol debe ser 'ADMIN' o 'CLIENT'"),
  validarCampos,
  handleErrors,
];

export const deleteUserValidator = [
   body("_id")
   .custom(userExistsToken),
  validarCampos,
  handleErrors,
];