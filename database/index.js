const { Sequelize } = require('sequelize')

const ImageModel = require('./models/image')
const UserModel = require('./models/user')
const config = require('../config')

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database_host,
  port: config.database_port,
  username: config.database_user,
  password: config.database_pass,
  database: config.database_db
})

module.exports = {
  sequelize,
  Image: ImageModel(sequelize),
  User: UserModel(sequelize)
}
