const Config = require('../../config')
const { Image } = require('../../database')
const {Vote } = require('../../database')

const Joi = require('joi')

module.exports = [
  {
    method: 'PUT',
    path: '/image/{id}/upvote', // '/image?all=true',

    options: {
    //  auth: false
    },


    handler: async function (request, h) {
      let images
      let id = request.params.id
      let userId = request.auth.credentials.user.id
      let wasUpdated = 1


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

        }else{
          wasUpdated = 0
        }
      }catch (error) {
        return h.response('Wrong ID').code(400);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }

      // Map through results and



      if (wasUpdated === 1) {
        return h.response('Upvote correctly').code(200);
      }if (wasUpdated === 0) {
        return h.response('This user can not Upvote more than 1 time').code(400);
      }


    }
  }

]
