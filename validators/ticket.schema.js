const Joi = require("joi");
const db = require("../models");

const statusValues = Object.values(db.ticket.STATUS);

const ticketSchema = Joi.object({
    titulo: Joi.string().required(),
    descripcion: Joi.string().required(),
    estado: Joi.string().valid(...statusValues),
    responsableId: Joi.number().integer().allow(null)
});

const ticketStatusSchema = Joi.object({
    estado: Joi.string().valid(...statusValues).required()
});

const ticketResponsableSchema = Joi.object({
    responsableId: Joi.number().integer().required()
});

module.exports = {
    ticketSchema,
    ticketStatusSchema,
    ticketResponsableSchema
};
