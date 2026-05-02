const db = require("../models");

const userAttributes = ["id", "nombre", "email"];

const proyectoService = {
    getObjectList: async (user) => {
        return await db.proyecto.findAll({
            include: [
                {
                    model: db.usuario,
                    as: "usuarios",
                    attributes: [],
                    through: { attributes: [] },
                    where: { id: user.id }
                },
                {
                    model: db.usuario,
                    as: "creador",
                    attributes: userAttributes
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    },
    createObject: async ({ nombre, descripcion }, user) => {
        return await db.sequelize.transaction(async (transaction) => {
            const proyecto = await db.proyecto.create({
                nombre,
                descripcion,
                creadorId: user.id
            }, { transaction });

            await db.proyectoUsuario.create({
                usuarioId: user.id,
                proyectoId: proyecto.id
            }, { transaction });

            return proyecto;
        });
    },
    getById: async (id, user) => {
        const tieneAcceso = await proyectoService.usuarioPerteneceAlProyecto(user.id, id);
        if (!tieneAcceso) {
            return null;
        }
        return await db.proyecto.findByPk(id, {
            include: [
                {
                    model: db.usuario,
                    as: "creador",
                    attributes: userAttributes
                },
                {
                    model: db.usuario,
                    as: "usuarios",
                    attributes: userAttributes,
                    through: { attributes: [] }
                }
            ]
        });
    },
    updateObject: async (id, { nombre, descripcion }, user) => {
        const proyecto = await proyectoService.getById(id, user);
        proyecto.nombre = nombre;
        proyecto.descripcion = descripcion;
        return await proyecto.save();
    },
    addMember: async (id, { email }, user) => {
        const proyecto = await proyectoService.getById(id, user);
        if (!proyecto) {
            return null;
        }
        const usuario = await db.usuario.findOne({ where: { email } });
        if (!usuario) {
            return null;
        }
        await db.proyectoUsuario.findOrCreate({
            where: {
                usuarioId: usuario.id,
                proyectoId: proyecto.id
            }
        });
        return await proyectoService.getById(id, user);
    },
    usuarioPerteneceAlProyecto: async (usuarioId, proyectoId) => {
        const proyectoUsuario = await db.proyectoUsuario.findOne({
            where: {
                usuarioId,
                proyectoId
            }
        });
        return !!proyectoUsuario;
    }
}

module.exports = proyectoService;
