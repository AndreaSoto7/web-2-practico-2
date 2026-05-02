const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const requireAuth = require("../middlewares/user.middleware.js");
const proyectoService = require("../services/proyectos.service.js");
const { proyectoSchema, proyectoUsuarioSchema } = require("../validators/proyecto.schema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/proyecto.controller.js");
    router.get("/", requireAuth, controller.getProyectos);
    router.get("/:id", requireAuth, getObjectOr404(proyectoService), controller.getProyectoById);
    router.post("/", requireAuth, isJsonRequestValid, schemaValidation(proyectoSchema), controller.postProyectoCreate);
    router.put("/:id", requireAuth, getObjectOr404(proyectoService), isJsonRequestValid, schemaValidation(proyectoSchema), controller.putProyectoUpdate);
    router.post("/:id/usuarios", requireAuth, isJsonRequestValid, schemaValidation(proyectoUsuarioSchema), controller.postProyectoUsuario);
    router.get("/:id/board", requireAuth, controller.getProyectoBoard);

    app.use('/proyectos', router);
};
