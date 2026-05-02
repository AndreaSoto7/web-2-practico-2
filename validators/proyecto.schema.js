const Joi = require("joi");

const proyectoSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().allow("", null)
});

const proyectoUsuarioSchema = Joi.object({
    email: Joi.string().email().required()
});

module.exports = {
    proyectoSchema,
    proyectoUsuarioSchema
};
