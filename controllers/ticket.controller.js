const ticketService = require("../services/tickets.service");

exports.getTickets = async (req, res) => {
    const tickets = await ticketService.getObjectList(req.params.proyectoId, req.user);
    if (!tickets) {
        return res.status(404).json({ message: "Object not found" });
    }
    res.json(tickets);
};

exports.getTicketById = async (req, res) => {
    res.json(req.obj);
};

exports.postTicketCreate = async (req, res) => {
    try {
        const ticket = await ticketService.createObject(req.params.proyectoId, req.body, req.user);
        if (!ticket) {
            return res.status(404).json({ message: "Object not found" });
        }
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.putTicketUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.updateObject(id, req.body, req.user);
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.patchTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.updateStatus(id, req.body, req.user);
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.patchTicketResponsable = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.assignUser(id, req.body, req.user);
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    const { id } = req.params;
    await ticketService.deleteObject(id, req.user);
    res.json({ message: "Ticket eliminado correctamente" });
};
