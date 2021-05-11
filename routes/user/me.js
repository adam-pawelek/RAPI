const { User } = require('../../database')
const Boom = require('@hapi/boom')

module.exports = [
  {
    method: 'GET',
    path: '/me',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: async function (request, h) {
        let user = request.auth.credentials.user
        console.log(user.id);

        const me = await User.findAll({
          where: {
            id: user.id
          }
        })

        return {
          msg: 'Success! This is ME',
          me
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/me/image',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: async function (request, h) {
try{
  const me = request.auth.credentials.model

  const myImages = await me.getImages()
  if (!myImages) {
    let error = new Error('No images for this user found')
    throw Boom.boomify(error, { statusCode: 400 })
  }

  return {
    msg: 'Success! These are all my posted images',
    myImages
  }
}catch (e) {
  return h.response('Error')
}
      }
    }
  }
]


