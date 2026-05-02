const { DataTypes } = require("sequelize");

const TICKET_STATUS = {
    PENDIENTE: "PENDIENTE",
    EN_PROGRESO: "EN_PROGRESO",
    COMPLETADO: "COMPLETADO"
};

module.exports = (sequelize) => {
    const Ticket = sequelize.define(
        "Ticket",
        {
            titulo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            estado: {
                type: DataTypes.ENUM(...Object.values(TICKET_STATUS)),
                allowNull: false,
                defaultValue: TICKET_STATUS.PENDIENTE
            }
        },
    );
    Ticket.STATUS = TICKET_STATUS;
    return Ticket;
}
