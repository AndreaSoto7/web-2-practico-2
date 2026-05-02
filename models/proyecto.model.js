const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Proyecto = sequelize.define(
        "Proyecto",
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.TEXT,
            }
        },
    );
    return Proyecto;
}
