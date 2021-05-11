const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('vote', {
    imageId: {
      type: Sequelize.UUID, // ddf9b02a-19c3-4036-b06e-0b9a9b6f26b2
  //    primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      type: Sequelize.UUID, // ddf9b02a-19c3-4036-b06e-0b9a9b6f26b2
     // primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    count: {
      type: Sequelize.INTEGER
    }

  })
}
