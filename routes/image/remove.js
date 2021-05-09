const { Image } = require('../../database')
const Joi = require('joi')
const Config = require('../../config')
const { User } = require('../../database')
const { removeFileFromBucket } = require('../../utils/minio')
const Boom = require('@hapi/boom')

module.exports = [
  {
    method: 'DELETE',
    path: '/image/{id}',
    options: {
      validate: {
        query: Joi.object({
          id: Joi.string().guid({ version: ['uuidv4'] })
        })
      },
      auth: {
        scope: ['admin', 'user']
      }
    },
    handler: async function (request, h) {
        let imageId = request.params.id
        let deleted = null
        let userScope = request.auth.credentials.scope

        let file;
        try{
         file = await Image.findOne({ where: { id: imageId } })
        } catch (e)  {
          let error = new Error('Image does not exist')
          throw Boom.boomify(error, { statusCode: 400 })
        }
        if (!file) {
          let error = new Error('Image does not exist')
          throw Boom.boomify(error, { statusCode: 400 })
        }
        let filename = file.get('filename')

        if (userScope == 'admin') {
          if (!await removeFileFromBucket(Config.bucketname, filename)) {
            let error = new Error('Deletion from bucket unsuccessful')
            throw Boom.boomify(error, { statusCode: 500 })
          }
          deleted = await Image.destroy({ where: { id: imageId } })
        }

        if (userScope == 'user') {
          const userId = request.auth.credentials.user.id
          const image = await Image.findOne({ where: { id: imageId } })

          if (image.userId === userId) {
            if (!await removeFileFromBucket(Config.bucketname, filename)) {
              let error = new Error('Deletion from bucket unsuccessful')
              throw Boom.boomify(error, { statusCode: 500 })
            }
            deleted = await Image.destroy({ where: { id: imageId } })
          } else {
            console.log('here2');
            let error = new Error('Not allowed: This is not your image')
            throw Boom.boomify(error, { statusCode: 401 })
          }
        }

        if (deleted) {
          return h.response('Image deleted successfully').code(200)
        } else {
          let error = new Error('Image does not exist!')
          throw Boom.boomify(error, { statusCode: 400 })
        }
    }
  },
  {
    method: 'DELETE',
    path: '/image/minio/{filename}',
    handler: function (request, h) {
      return removeFileFromBucket(Config.bucketname, request.params.filename)
    }
  }
]
