const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const requireAuth = require("../middlewares/user.middleware.js");
const ticketService = require("../services/tickets.service.js");
const { ticketSchema, ticketStatusSchema, ticketResponsableSchema } = require("../validators/ticket.schema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/ticket.controller.js");
    router.get("/proyecto/:proyectoId", requireAuth, controller.getTickets);
    router.post("/proyecto/:proyectoId", requireAuth, isJsonRequestValid, schemaValidation(ticketSchema), controller.postTicketCreate);
    router.get("/:id", requireAuth, getObjectOr404(ticketService), controller.getTicketById);
    router.put("/:id", requireAuth, getObjectOr404(ticketService), isJsonRequestValid, schemaValidation(ticketSchema), controller.putTicketUpdate);
    router.patch("/:id/estado", requireAuth, getObjectOr404(ticketService), isJsonRequestValid, schemaValidation(ticketStatusSchema), controller.patchTicketStatus);
    router.patch("/:id/responsable", requireAuth, getObjectOr404(ticketService), isJsonRequestValid, schemaValidation(ticketResponsableSchema), controller.patchTicketResponsable);
    router.delete("/:id", requireAuth, getObjectOr404(ticketService), controller.deleteTicket);

    app.use('/tickets', router);
};
