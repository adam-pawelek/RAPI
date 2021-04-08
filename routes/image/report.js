const Config = require('../../config')
const { Notice } = require('../../database')
const jwt = require('jsonwebtoken')

module.exports = [
  {
    method: 'POST',
    path: '/image/{id}/report',
    handler: async function (request, h) {
        let imageId = request.params.id
        console.log('ImageID: ' + imageId)

        let userToken = await request.headers
        const token = userToken.authorization.split(' ')
        const decoded = jwt.verify(token[1], Config.jwt_secret)
        let user = decoded.user
        console.log('UserID: ' + user.id)

        return Notice.create({
          imageId: imageId,
          userId: user.id
        })
    }
  }
]
