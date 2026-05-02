const { sequelize } = require('../config/db.config');

const usuario = require('./usuario.model')(sequelize);
const proyecto = require('./proyecto.model')(sequelize);
const proyectoUsuario = require('./proyectoUsuario.model')(sequelize);
const ticket = require('./ticket.model')(sequelize);

usuario.hasMany(proyecto, {
  as: 'proyectosCreados',
  foreignKey: 'creadorId'
});
proyecto.belongsTo(usuario, {
  as: 'creador',
  foreignKey: 'creadorId'
});

usuario.belongsToMany(proyecto, {
  through: proyectoUsuario,
  as: 'proyectos',
  foreignKey: 'usuarioId',
  otherKey: 'proyectoId'
});
proyecto.belongsToMany(usuario, {
  through: proyectoUsuario,
  as: 'usuarios',
  foreignKey: 'proyectoId',
  otherKey: 'usuarioId'
});

proyecto.hasMany(ticket, {
  as: 'tickets',
  foreignKey: 'proyectoId'
});
ticket.belongsTo(proyecto, {
  as: 'proyecto',
  foreignKey: 'proyectoId'
});

usuario.hasMany(ticket, {
  as: 'ticketsCreados',
  foreignKey: 'creadorId'
});
ticket.belongsTo(usuario, {
  as: 'creador',
  foreignKey: 'creadorId'
});

usuario.hasMany(ticket, {
  as: 'ticketsAsignados',
  foreignKey: 'responsableId'
});
ticket.belongsTo(usuario, {
  as: 'responsable',
  foreignKey: 'responsableId'
});

module.exports = {
  usuario,
  proyecto,
  proyectoUsuario,
  ticket,
  sequelize,
  Sequelize: sequelize.Sequelize,
};
