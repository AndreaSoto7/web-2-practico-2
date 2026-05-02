const { generateToken } = require('../utils/jwt.utils');
const { sha1Encode } = require('../utils/text.utils');
const userService = require('../services/user.service');

exports.postRegister = async (req, res) => {
  const { nombre, email, password } = req.body;
  const existingUser = await userService.findUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: 'El correo electronico ya esta registrado' });
  }

  const encodedPassword = sha1Encode(password);
  await userService.createUser(nombre, email, encodedPassword);
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await userService.findUserByEmail(email);

  if (!usuario) {
    return res.status(401).json({ message: 'Usuario o contrasena incorrectas' });
  }

  const encodedPassword = sha1Encode(password);

  if (encodedPassword !== usuario.password) {
    return res.status(401).json({ message: 'Usuario o contrasena incorrectas' });
  }

  const token = generateToken({
    id: usuario.id,
  });
  res.status(200).json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    }
  });
};
