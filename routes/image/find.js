const Config = require('../../config')
const { Image } = require('../../database')
const { listBucketFiles } = require('../../utils/minio')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/image', // '/image?all=true',
    options: {
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(10),
          page: Joi.number().integer().min(1).default(1),
          all: Joi.bool().default(false)
        })
      }
    },
    handler: async function (request, h) {
      let images
      if (request.query.all === false) { // Find images in database with limit and pagination
        images = await Image.findAll({
          offset: (request.query.page - 1) * request.query.limit,
          limit: request.query.limit
        })
      } else { // Get all images from database
        images = await Image.findAll()
      }

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
        Our utility function promisifies that
      */
      return listBucketFiles(Config.bucketname)
    }
  },
  {
    method: 'GET',
    path: '/image/{id}',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          id: Joi.string().guid({ version: ['uuidv4'] })
        })
      }
    },
    handler: async function (request, h) {
      try {
        let userId = request.params.id;

        const userImages = await Image.findAll({
          where: {
            userId: userId
          }
        })

        return {msg: 'Here are all images belonging to the requested user', userImages}
      } catch (error) {
        return h.response(' Error ' + error.message).code(500)
      }
    }
  }
]
