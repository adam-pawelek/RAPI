const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('comment', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    comment: {
      type: Sequelize.TEXT
    },
    imageId: {
      type: Sequelize.UUID
    }
  })
}
