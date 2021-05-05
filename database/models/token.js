const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('token', {
    id:{
      type: Sequelize.TEXT,
      primaryKey: true,
      defaultValue: 'no token'
    }
  })
}
