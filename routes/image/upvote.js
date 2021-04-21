const Config = require('../../config')
const { Image } = require('../../database')

const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/p/{id}', // '/image?all=true',

    options: {
      auth: false
    },


    handler: async function (request, h) {
      let images
      let id = request.params.id
    //  let count = request.params.count
     // count = parseInt(count)
      //count = count + 1

      images = await Image.findAll()

      let upvoteMe = null
      try {
        const myJson = await Image.findOne(
          { where: { id: id } }
        )

        upvoteMe = await Image.update(
            {count: myJson.count  + 1},
            { where: { id: id } }
          )
      //  upvoteMe.count = 1
       // await upvoteMe.reload();
      }catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
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
  }

]
