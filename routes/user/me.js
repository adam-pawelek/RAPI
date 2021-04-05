// const Config = require('../../config')
const { User } = require('../../database')
// const { Image } = require('../../database')
// const { minioClient } = require('../../utils/minio')
const jwt = require('jsonwebtoken')

module.exports = [
  {
    method: 'GET',
    path: '/me',
    handler: async function (request, h) {
      // Which user are you?
      // getJWToken
      // Show all information belonging to me
      try {
        // const user = await jwt.decode(request.)
        const user = await User.findOne({
          where: {
            username: request.payload.username
          }
        }, {
          rejectOnEmpty: true
        })
        return user.map(userData => (
          {
            ...userData.toJSON()
          }
        ))
      } catch (err) {
        return h.response().code(401)
      }
    }
  }
]
