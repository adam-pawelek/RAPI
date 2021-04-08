const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('user', {
    id: {
      type: Sequelize.UUID, // ddf9b02a-19c3-4036-b06e-0b9a9b6f26b2
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    username: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.TEXT
    },
    // can be admin, user, anonymous later on
    role: {
      type: Sequelize.TEXT
    }
    //scope:
    //type: [ Sequelize.TEXT ]
  })
}
