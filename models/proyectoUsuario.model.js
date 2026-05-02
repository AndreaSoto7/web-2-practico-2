module.exports = (sequelize) => {
    const ProyectoUsuario = sequelize.define(
        "ProyectoUsuario",
        {},
        {
            indexes: [
                {
                    unique: true,
                    fields: ["usuarioId", "proyectoId"]
                }
            ]
        },
    );
    return ProyectoUsuario;
}
