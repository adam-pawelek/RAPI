const Config = require('../../config')
const { Image } = require('../../database')
const {Vote } = require('../../database')

const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/image/trending', // '/image?all=true',

    options: {
      //  auth: false
    },

    handler: async function (request, h) {
      let images
      let id = request.params.id
      let userId = request.auth.credentials.user.id


    //  images = await Image.findAll()

      const myVote = await Image.findAll(
        {
          order: [
            ['count', 'DESC']
          ],
          limit: 10
        }
      );


      // Map through results and



      return myVote.map(image => (
        {
          ...image.toJSON(), // We dont want the whole sequelize model, just data
          // Construct a path for fetching images directly
          fullpath: `http://minio.imager.local/${Config.bucketname}/${image.filename}`
        }
      ))


    }
  }

]
