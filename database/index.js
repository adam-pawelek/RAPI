const { Sequelize } = require('sequelize')

const ImageModel = require('./models/image')
const NoticeModel = require('./models/notice')
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

const Image = ImageModel(sequelize)
const Notice = NoticeModel(sequelize)
const User = UserModel(sequelize)

// Create associations for foreign keys
Image.belongsTo(User)
User.hasMany(Image)

// User might have many favorite images
// User.hasMany(Image, { as: 'Favorite' })

module.exports = {
  sequelize,
  Image,
  Notice,
  User
}
