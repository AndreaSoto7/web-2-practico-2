const db = require("../models");
const proyectoService = require("./proyectos.service");

const STATUS = db.ticket.STATUS;
const allowedTransitions = {
    [STATUS.PENDIENTE]: [STATUS.EN_PROGRESO],
    [STATUS.EN_PROGRESO]: [STATUS.PENDIENTE, STATUS.COMPLETADO],
    [STATUS.COMPLETADO]: [STATUS.EN_PROGRESO]
};

const ticketInclude = [
    {
        model: db.usuario,
        as: "responsable",
        attributes: ["id", "nombre", "email"]
    },
    {
        model: db.usuario,
        as: "creador",
        attributes: ["id", "nombre", "email"]
    },
    {
        model: db.proyecto,
        as: "proyecto",
        attributes: ["id", "nombre"]
    }
];

const ticketService = {
    getObjectList: async (proyectoId, user) => {
        const tieneAcceso = await proyectoService.usuarioPerteneceAlProyecto(user.id, proyectoId);
        if (!tieneAcceso) {
            return null;
        }
        return await db.ticket.findAll({
            where: { proyectoId },
            include: ticketInclude,
            order: [["createdAt", "DESC"]]
        });
    },
    createObject: async (proyectoId, { titulo, descripcion, estado, responsableId }, user) => {
        const tieneAcceso = await proyectoService.usuarioPerteneceAlProyecto(user.id, proyectoId);
        if (!tieneAcceso) {
            return null;
        }
        const estadoTicket = estado || STATUS.PENDIENTE;
        if (estadoTicket === STATUS.EN_PROGRESO && !responsableId) {
            throw new Error("El ticket necesita un responsable antes de iniciar");
        }
        if (responsableId) {
            const responsableValido = await proyectoService.usuarioPerteneceAlProyecto(responsableId, proyectoId);
            if (!responsableValido) {
                throw new Error("El responsable debe ser miembro del proyecto");
            }
        }
        return await db.ticket.create({
            titulo,
            descripcion,
            estado: estadoTicket,
            proyectoId,
            creadorId: user.id,
            responsableId: responsableId || null
        });
    },
    getById: async (id, user) => {
        const ticket = await db.ticket.findByPk(id, { include: ticketInclude });
        if (!ticket) {
            return null;
        }
        const tieneAcceso = await proyectoService.usuarioPerteneceAlProyecto(user.id, ticket.proyectoId);
        if (!tieneAcceso) {
            return null;
        }
        return ticket;
    },
    updateObject: async (id, { titulo, descripcion, responsableId }, user) => {
        const ticket = await ticketService.getById(id, user);
        if (responsableId) {
            const responsableValido = await proyectoService.usuarioPerteneceAlProyecto(responsableId, ticket.proyectoId);
            if (!responsableValido) {
                throw new Error("El responsable debe ser miembro del proyecto");
            }
        }
        ticket.titulo = titulo;
        ticket.descripcion = descripcion;
        ticket.responsableId = responsableId || null;
        return await ticket.save();
    },
    updateStatus: async (id, { estado }, user) => {
        const ticket = await ticketService.getById(id, user);
        if (ticket.estado === estado) {
            return ticket;
        }
        if (!allowedTransitions[ticket.estado].includes(estado)) {
            throw new Error("Transicion de estado invalida");
        }
        if (estado === STATUS.EN_PROGRESO && !ticket.responsableId) {
            throw new Error("El ticket necesita un responsable antes de iniciar");
        }
        ticket.estado = estado;
        return await ticket.save();
    },
    assignUser: async (id, { responsableId }, user) => {
        const ticket = await ticketService.getById(id, user);
        const responsableValido = await proyectoService.usuarioPerteneceAlProyecto(responsableId, ticket.proyectoId);
        if (!responsableValido) {
            throw new Error("El responsable debe ser miembro del proyecto");
        }
        ticket.responsableId = responsableId;
        return await ticket.save();
    },
    deleteObject: async (id, user) => {
        const ticket = await ticketService.getById(id, user);
        return await ticket.destroy();
    },
    getBoard: async (proyectoId, user) => {
        const tickets = await ticketService.getObjectList(proyectoId, user);
        if (!tickets) {
            return null;
        }
        return {
            pendientes: tickets.filter((ticket) => ticket.estado === STATUS.PENDIENTE),
            enProgreso: tickets.filter((ticket) => ticket.estado === STATUS.EN_PROGRESO),
            completados: tickets.filter((ticket) => ticket.estado === STATUS.COMPLETADO)
        };
    }
}

module.exports = ticketService;
