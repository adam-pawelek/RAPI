const Config = require('../../config')
const { Image } = require('../../database')
const {Vote } = require('../../database')

const Joi = require('joi')

module.exports = [
  {
    method: 'PUT',
    path: '/image/upvote/{id}', // '/image?all=true',

    options: {
    //  auth: false
    },


    handler: async function (request, h) {
      let images
      let id = request.params.id
      let userId = request.auth.credentials.user.id


      images = await Image.findAll()

      let upvoteMe = null
      const myVote = await Vote.findOne(
        { where: { imageId: id,
                    userId: userId
                  }
        }
      )

      try {


        if (myVote === null) {

          const voteJson = await Image.findOne(
            { where: { id: id } }
          )

          upvoteMe = await Image.update(
            { count: voteJson.count + 1 },
            { where: { id: id } }
          )
          //  upvoteMe.count = 1
          // await upvoteMe.reload();
          Vote.create({
            // Storing with date as filename is bad and can cause collisions
            imageId: id,
            userId: userId,
            count: 1
          })

        }
        else if (myVote.count < 1){
          const myJson = await Image.findOne(
            { where: { id: id } }
          )

          upvoteMe = await Image.update(
            { count: myJson.count +1 },
            { where: { id: id } }
          )
          upvoteCount = await Vote.update(
            { count: myVote.count + 1 },
            { where: { imageId: id,
                userId: userId} }
          )

        }
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
