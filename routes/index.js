module.exports = app => {
  require('./auth.routes')(app);
  require('./proyecto.routes')(app);
  require('./ticket.routes')(app);
};
