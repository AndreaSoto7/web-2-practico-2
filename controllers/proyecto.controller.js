const proyectoService = require("../services/proyectos.service");
const ticketService = require("../services/tickets.service");

exports.getProyectos = async (req, res) => {
    const proyectos = await proyectoService.getObjectList(req.user);
    res.json(proyectos);
};

exports.getProyectoById = async (req, res) => {
    res.json(req.obj);
};

exports.postProyectoCreate = async (req, res) => {
    const proyecto = await proyectoService.createObject(req.body, req.user);
    res.json(proyecto);
};

exports.putProyectoUpdate = async (req, res) => {
    const { id } = req.params;
    const proyecto = await proyectoService.updateObject(id, req.body, req.user);
    res.json(proyecto);
};

exports.postProyectoUsuario = async (req, res) => {
    const { id } = req.params;
    const proyecto = await proyectoService.addMember(id, req.body, req.user);
    if (!proyecto) {
        return res.status(404).json({ message: "Object not found" });
    }
    res.json(proyecto);
};

exports.getProyectoBoard = async (req, res) => {
    const { id } = req.params;
    const board = await ticketService.getBoard(id, req.user);
    if (!board) {
        return res.status(404).json({ message: "Object not found" });
    }
    res.json(board);
};
