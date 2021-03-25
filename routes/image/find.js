const Config = require('../../config')
const { Image } = require('../../database')
const { listBucketFiles } = require('../../utils/minio')

module.exports = [
  {
    method: 'GET',
    path: '/image',
    handler: async function (request, h) {
      // Get all images from database
      const images = await Image.findAll()

      // Map through results and
      return images.map(image => (
        {
          ...image.toJSON(), // We dont want the whole sequelize model, just data
          // Construct a path for fetching images directly
          fullpath: `http://minio.imager.local/${Config.bucketname}/${image.filename}`
        }
      ))
    }
  },
  {
    method: 'GET',
    path: '/image/minio',
    options: {
      auth: false
    },
    handler: function (request, h) {
      /*
        minioClient.listObjectsV2 returns a stream
        Our utility fuction promisifies that
      */
      return listBucketFiles(Config.bucketname)
    }
  }
]
