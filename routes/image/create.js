const FileType = require('file-type')
const uuid = require('uuid')
const Config = require('../../config')
const { Image } = require('../../database')
const { minioClient } = require('../../utils/minio')
const Joi = require('joi')
const Boom = require('@hapi/boom')

module.exports = [
  {
    method: 'POST',
    path: '/image',
    options: {
      auth: {
        strategy: 'jwt_strategy',
        mode: 'try',
      },
      validate: {
        query: Joi.object({
          isPublic: Joi.bool().default(true)
        })
      }
    },
    handler: async function (request, h) {
      try {
        if(request.payload === null){
          let error = new Error('Payload is empty')
          throw Boom.boomify(error, {statusCode: 400})
        }

        // Read image base64 data to buffer
        const data = Buffer.from(request.payload.imagedata, 'base64')
        // Detect file extension and mime type
        const ft = await FileType.fromBuffer(data)
        // Add metadata to uploaded file so minio understands our file better
        const metaData = {
          'Content-Type': ft.mime
        }
        const filename =   `image-${uuid.v4()}.${ft.ext}`

        await minioClient.putObject(Config.bucketname, filename, data, metaData)

        let postedImage

        if (request.auth.isAuthenticated === true) {
          //const user = request.auth.credentials.user

          postedImage = await Image.create({
            filename: filename,
            isAnonymous: false,
            isPublic: request.query.isPublic,
            userId: request.auth.credentials.user.id,
            count: 0
          })
        } else {
          postedImage = Image.create({
            filename: filename
          })
        }

        return postedImage
      } catch (e) {
        console.log(e)
        return h.response('Image upload was not possible ' + e.message).code(500)
      }
    }
  }
]
