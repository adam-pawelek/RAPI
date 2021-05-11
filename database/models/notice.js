const Sequelize = require('sequelize')

module.exports = function (database) {
  return database.define('notice', {
    noticeId: {
      type: Sequelize.UUID, // ddf9b02a-19c3-4036-b06e-0b9a9b6f26b2
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    imageId: {
      type: Sequelize.UUID
    },
    userId: {
      type: Sequelize.UUID
    }
  })
}
