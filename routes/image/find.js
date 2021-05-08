const Config = require('../../config')
const { Image } = require('../../database')
const { listBucketFiles } = require('../../utils/minio')
const Joi = require('joi')

module.exports = [
  {
    // SHOWS ONLY PUBLIC IMAGES
    // To get user's private go to /me/images
    method: 'GET',
    path: '/image', // '/image?all=true',
    options: {
      auth: false,
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
          limit: request.query.limit,
          where: { isPublic: true }
        })
      } else { // Get all images from database
        images = await Image.findAll({
          where: {
            isPublic: true
          }
        })
      }

      // Map through results
      return images.map(image => (
        {
          ...image.toJSON(), // We dont want the whole sequelize model, just data
          // Construct a path for fetching images directly
          fullpath: `http://minio.imager.local/${Config.bucketname}/${image.filename}`,
        }
      ))
    }
  }
]
