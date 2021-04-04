// const Config = require('../../config')
const { User } = require('../../database')
// const { Image } = require('../../database')
// const { minioClient } = require('../../utils/minio')

module.exports = [
  {
    method: 'GET',
    path: '/me',
    options: {
      auth: false
    },
    handler: async function (request, h) {
      // Which user are you?
      // Show all information belonging to me
      try {
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
