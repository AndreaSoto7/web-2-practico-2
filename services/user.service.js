const db = require('../models');

exports.findUserById = async (id) => {
  return await db.usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'email', 'createdAt', 'updatedAt']
  });
};

exports.findUserByEmail = async (email) => {
  return await db.usuario.findOne({ where: { email } });
};

exports.createUser = async (nombre, email, password) => {
  return await db.usuario.create({ nombre, email, password });
};
