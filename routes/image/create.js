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
    options: {
      auth: {
        strategy: 'jwt_strategy',
        mode: 'try'
      }
    },
    handler: async function (request, h) {

      if(request.auth.isAuthenticated === true){
        console.log("Logged in user")
        const user = request.auth.credentials.user
        console.log(user.id)

        return await Image.create({
          filename: `image-${new Date().toDateString()}`,
          username: user.name,
          //comment the next line in, if the image should be private
          //status: false,
          userId: user.id
        })
      }else{
        console.log("Not logged in")

        return await Image.create({
          filename: `image-${new Date().toDateString()}`,
        })
      }
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
