const Sequelize = require('sequelize')
// const {User} = require("../index");
// const {Image} = require("../index");
const UserModel = require('../models/user')
const ImageModel = require('../models/image')

module.exports = function (database) {
    return database.define('favorite', {
        imageId: {
            type: Sequelize.UUID,
            references: {
                model: ImageModel,
                key: 'id'
            }
        },
        userId: {
            type: Sequelize.UUID,
            references: {
                model: UserModel,
                key: 'id'
            }
        }
    })
}
