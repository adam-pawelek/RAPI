const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('image', {
    id: {
      type: Sequelize.UUID, // ddf9b02a-19c3-4036-b06e-0b9a9b6f26b2
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    filename: {
      type: Sequelize.TEXT
    },
    isAnonymous: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    // username: {
    //   type: Sequelize.TEXT,
    //   defaultValue: 'anonymous'
    // },

    // Can be private (false) or public (true) for later
    isPublic: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  })
}
