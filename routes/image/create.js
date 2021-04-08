const FileType = require('file-type')
const uuid = require('uuid')
const Config = require('../../config')
const { Image } = require('../../database')
const { minioClient } = require('../../utils/minio')
const jwt = require('jsonwebtoken')

module.exports = [
  {
    method: 'POST',
    path: '/image',
    handler: async function (request, h) {

      let userToken = await request.headers
      const token = userToken.authorization.split(' ')
      const decoded = jwt.verify(token[1], Config.jwt_secret)

      let user = decoded.user

      return Image.create({
        // Storing with date as filename is bad and can cause collisions
        filename: `image-${new Date().toDateString()}`,
        username: user.name,
        status: true,
        userId: user.id
      })
    }
  },
  {
    method: 'POST',
    path: '/image/minio',
    /*
    You might want to disable authentication when developing
    options: {
      auth: false
    },
    */
    handler: async function (request, h) {
      try {
        // Read image base64 data to buffer
        const data = Buffer.from(request.payload.imagedata, 'base64')

        // Detect file extension and mime type
        const ft = await FileType.fromBuffer(data)

        // Construct unique image name with uuid's
        const filename = `${uuid.v4()}.${ft.ext}`

        // Add metadata to uploaded file so minio understands our file better
        const metaData = {
          'Content-Type': ft.mime
        }

        // Put the image data to minio bucket
        await minioClient.putObject(Config.bucketname, filename, data, metaData)
        console.log(`Stored image: ${filename} to ${Config.bucketname}.`)

        // Store the filename to our database
        const image = await Image.create({
          filename
        })

        // If the user is authenticated set the image owner to the user
        if (request.auth.credentials.model) {
          await image.setUser(request.auth.credentials.model)
        }

        // Return the image database object
        return image
      } catch (error) {
        console.error(error)
        return { error }
      }
    }
  }
]
